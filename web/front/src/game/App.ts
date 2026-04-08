import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import "@babylonjs/gui"
import { Engine, Scene, Vector3, MeshBuilder, Color4, StandardMaterial, Color3, PointLight, ShadowGenerator, TransformNode, Quaternion, SpotLight, DirectionalLight, HemisphericLight, ImportMeshAsync, AbstractMesh } from "@babylonjs/core";
import { Environment, loadCharacterAssets, loadLights } from "./physics/Environment";
import { PlayerInput } from "./characters/PlayerInput";
import { Player } from "./characters/Player";
import { Ball } from "./physics/Ball";
import { GUI } from "./utils/GUI";
import { PlayerCamera } from "./characters/PlayerCamera";
import { Enemy } from "./characters/Enemy";
import { SynchronizedClock } from "./utils/SynchronizedClock";
import { NetworkSessionManager } from "./sessions/NetworkSessionManager";
import { GameState } from "./sessions/GameState"
import { PhysicsEngine } from "./physics/PhysicsEngine";
import { GameSession } from "./sessions/GameSession";
import { LocalSessionManager } from "./sessions/LocalSessionManager"

export interface CharacterAssets {
    mesh: AbstractMesh,
    handNode: TransformNode,
    racketNode: TransformNode
}

export enum RoomStatus {
  WAITING = 0,
  STARTED = 1,
  WON = 2,
  PLAYER_DISCONNECTED = 3,
  AWAITING_RECONNECTION = 4
}

export class App {
    private _canvas: HTMLCanvasElement;
    private _engine: Engine;
    private _scene: Scene;
    private _player: Player;
    private _ball: Ball;
    private _shadows : ShadowGenerator[] = [];
    private _ui : GUI;
    public  _clock : SynchronizedClock = new SynchronizedClock();
    private _isNear : boolean = true;
    //public onUnauthorized?: () => void;
    private _gameState : GameState = new GameState();
    private _session : GameSession;
    private _environment: Environment;
    //private _network : NetworkManager = new NetworkManager(this._gameState, this._clock);
    private _physicsEngine : PhysicsEngine;
    public onReturnToMenu?: () => void;
    public onReload?: () => void;


    constructor(canvas: HTMLCanvasElement, isOffline: boolean, onReturnToMenu?: () => void) {
        if (!canvas) throw new Error("Canvas is undefined");
        this._canvas = canvas;
        this.onReturnToMenu = onReturnToMenu;

        if (isOffline) {
            this._session = new LocalSessionManager(this._gameState, this._clock);
        } else {
            console.log("there", this.onReturnToMenu);
            this._session = new NetworkSessionManager(this._gameState, this._clock, this.onReturnToMenu);
        }
        this._physicsEngine = new PhysicsEngine(this._clock, this._session, isOffline);

        this._engine = new Engine(this._canvas, true, {adaptToDeviceRatio: true});
        this._scene = new Scene(this._engine);

        window.addEventListener("keydown", this._showInspector.bind(this))

        this._main();
    }
    
    private _showInspector(e: KeyboardEvent) {
        // Shift+Ctrl+Alt+I
        if (e.shiftKey && e.ctrlKey && e.altKey && (e.key === "I" || e.key === "i")) {
            if (this._scene.debugLayer.isVisible()) {
                this._scene.debugLayer.hide();
            } else {
                this._scene.debugLayer.show();
            }
        }
    }

    private async _main(): Promise<void> {
        this._engine.displayLoadingUI();        
        await this._session.initialize();

        await this._setupGameAssets();
        await this._scene.whenReadyAsync();
        this._engine.hideLoadingUI();

        this._setupUI();
        this._setupPhysicsMessagesListener();
        
        this._engine.runRenderLoop(() => {
            this._session.update();
            this._updatePhysicsAndRender();
        });
        window.addEventListener('resize', this._resizeWindow.bind(this));    
    }

    private _resizeWindow() {
        this._engine.resize();
    }

    private _updatePhysicsAndRender() {
        if (this._gameState.gameStatus == RoomStatus.STARTED) {
            this._physicsEngine.stepPhysics(this._engine.getDeltaTime());
        }
        this._scene.render();
    }

    private _setupPhysicsMessagesListener() {
        this._session.on('onGoalScored', (goalData: any) => this._physicsEngine.updatePhysicsOnGoalScored(goalData));
        this._session.on('onOpponentHit', (hitData: any) => this._physicsEngine.updateBallOnOpponentHit(hitData));
        this._session.on('onImpactResponse', (tick: number) => this._physicsEngine.updateFlagsOnImpactResponse(tick));
    }

    private _setupUI() {
        this._ui = new GUI(this._session, this.onReturnToMenu, this.onReload);

        this._isNear = this._gameState.players.get(this._player.sessionId).sideNear;
        this._gameStatusStateMachine(this._gameState.gameStatus);
        this._session.on('onGameStatusChange', (status: RoomStatus) => this._gameStatusStateMachine(status));
        this._session.on('onScoreChange', (scoreNear: number, scoreFar: number) => {
            this._ui.updateScoreUI(this._isNear, scoreNear, scoreFar);
        });
        this._session.on('onDrop', (code: number, reason: string) => {
            console.log('onDrop');
            this._player.lockControls();
            this._ui.showAwaitingReconnectionUI();
        });
        this._session.on('onReconnect', () => {
            this._gameStatusStateMachine(this._gameState.gameStatus);
        });
        this._session.on('onLeave', () => {
            this._ui.showFailedReconnectionUI();
        });
    }

     private _gameStatusStateMachine(status: RoomStatus) {
            switch (status) {
                case RoomStatus.WAITING:
                    this._ui.showWaitingUI();
                    this._player.lockControls();
                    break;
                case RoomStatus.STARTED:
                    console.log("Game has started");
                    this._player.unlockControls();
                    this._ui.showNoUI();
                    this._ui.addScoreUI(this._isNear, this._gameState.teamNear, this._gameState.teamFar);
                    break;
                case RoomStatus.WON:
                    this._player.lockControls();
                    this._ui.showEndUI(this._isNear, this._gameState.teamNear, this._gameState.teamFar);
                    break;
                case RoomStatus.PLAYER_DISCONNECTED:
                    this._player.lockControls();
                    this._ui.showOtherPlayerDisconnectUI();
                    break;
                case RoomStatus.AWAITING_RECONNECTION:
                    this._player.lockControls();
                    this._ui.showAwaitingReconnectionUI();
                    break;
            }
    }


    private async _setupGameAssets() {
        this._scene.clearColor = new Color4(0.015, 0.015, 0.2);
        this._environment = new Environment(this._scene);
        await this._physicsEngine.setEnvironment(this._environment);

        this._initLightAndBall(this._scene);

        this._gameState.players.forEach((player, id) =>
            this._setupCharacters(player.isPlayer, id, player.pos, player.sideNear));
        this._session.on("onPlayerJoined", (sessionId: string, playerPos: Vector3, sideNear: boolean) => 
            this._setupCharacters(true, sessionId, playerPos, sideNear));
        this._session.on('onEnemyJoined', (sessionId: string, enemyPos: Vector3, sideNear: boolean) => 
            this._setupCharacters(false, sessionId, enemyPos, sideNear));
    }


    private _initLightAndBall(scene: Scene) {
        this._shadows = loadLights(scene);
        let ballPos = this._gameState.ballPos;
        let ballVel = this._gameState.ballVel;
        this._ball = new Ball(ballPos, ballVel, 1, this._shadows, this._scene, this._clock, this._engine, this._physicsEngine);
        this._physicsEngine.setBall(this._ball);
        this._setupBallUpdates();
    }

    private _setupBallUpdates() {
        this._session.on('onServerPatch', () => {
            const serverPos = this._gameState.ballPos;
            const serverVel = this._gameState.ballVel;
            this._ball.serverPatch = {tick: this._gameState.ballTickStamp, position: serverPos, velocity: serverVel};
        });
    }

    private async _setupCharacters(isPlayer: boolean, sessionId: string, position: Vector3, isNearSide: boolean) {
        const assets = await loadCharacterAssets(this._scene, position, isPlayer, isNearSide);
        if (isPlayer) {
            const camera = new PlayerCamera(isNearSide, this._scene);
            this._player = new Player(camera.getUniversalCamera(), sessionId, assets, this._scene, this._shadows, this._session);
            this._player.setPlayerInput(
                new PlayerInput(this._scene, camera, this._player.getHandNode(), this._player.getRacketNode()));
            this._physicsEngine.setPlayer(this._player);
            this._physicsEngine.setCamera(camera);
        } else {
            this._physicsEngine.setEnemy(new Enemy(this._scene, assets, this._shadows, isNearSide, this._gameState, sessionId));
            this._session.setupEnemy(this._scene, this._ball, assets.mesh, assets.handNode, assets.racketNode, this._environment);
        }
    }

    // public onReload() {
    //     this._session.leave();
    //     this._gameState = new GameState();
    //     this._clock = new SynchronizedClock();
    //     if (this._session instanceof NetworkSessionManager) {
    //         this._session = new NetworkSessionManager(this._gameState, this._clock);
    //     }
    //     else {
    //         this._session = new LocalSessionManager(this._gameState, this._clock);
    //     }
    //     this._session.initialize();
    // }

    public async dispose() {
        console.log("disposing");
        if (this._session)
            await this._session.dispose();
        if (this._ui)
            this._ui.dispose();
        if (this._scene)
            this._scene.dispose();
        window.removeEventListener('resize', this._resizeWindow);
        if (this._engine)
            this._engine.dispose();
        window.removeEventListener("keydown", this._showInspector);
    }

    public getTick() : number {
        return this._clock.tick;
    }

    public getPlayer() : Player {
        return this._player;
    }

    public setRecentImpact() {
        this._ball.recentImpact = true;
    }

    public getEngine() : Engine {
        return this._engine;
    }
}