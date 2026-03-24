import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import "@babylonjs/gui"
import { Engine, Scene, Vector3, Mesh, MeshBuilder, Color4, StandardMaterial, Color3, PointLight, ShadowGenerator, TransformNode, HavokPlugin, Quaternion, PhysicsBody } from "@babylonjs/core";
import { Callbacks, Client, Room } from "@colyseus/sdk";
import { Environment } from "./environment";
import { PlayerInput } from "./playerInput";
import { Player } from "./player";
import HavokPhysics from "@babylonjs/havok";
import { Ball } from "./ball";
import { MyRoomState } from "./schema/MyRoomState";
import { StateCallbackStrategy } from "@colyseus/schema";
import { GUI } from "./GUI";
import { PlayerCamera } from "./PlayerCamera";
import { Enemy } from "./enemy";
import { SnapshotBuffer } from "./snapshots";
import { SynchronizedClock } from "./SynchronizedClock";
import { RacketHistory } from "./RacketHistory";

export enum RoomStatus {
  WAITING = 0,
  STARTED = 1,
  WON = 2,
  PLAYER_DISCONNECTED = 3
}

export class App {
    private _canvas: HTMLCanvasElement;
    private _engine: Engine;
    private _scene: Scene;
    private _havokPlugin: HavokPlugin;
    private _environment: Environment;
    private _player: Player;
    private _enemy: Enemy;
    private _camera: PlayerCamera;
    private MAX_SPEED: number = 40;
    private _ball: Ball;
    private _room : Room<MyRoomState>;
    private _callback : StateCallbackStrategy<MyRoomState>;
    private _shadow : ShadowGenerator;
    private _ui : GUI;
    public  _clock : SynchronizedClock = new SynchronizedClock();
    private _isNear : boolean = true;


    constructor(canvas: HTMLCanvasElement) {
        if (!canvas) throw new Error("Canvas is undefined");
        this._canvas = canvas;

        this._engine = new Engine(this._canvas, true, {adaptToDeviceRatio: true});
        this._scene = new Scene(this._engine);

        // hide/show the Inspector
        window.addEventListener("keydown", (ev) => {
            // Shift+Ctrl+Alt+I
            if (ev.shiftKey && ev.ctrlKey && ev.altKey && (ev.key === "I" || ev.key === "i")) {
                if (this._scene.debugLayer.isVisible()) {
                    this._scene.debugLayer.hide();
                } else {
                    this._scene.debugLayer.show();
                }
            }
        });

        this._main();
    }
    
    private async _main(): Promise<void> {
        this._engine.displayLoadingUI();
        
        await this._connectOrReconnectToRoom();

        await Promise.all([
            this._setupHavok(),
            this._waitForStateOnce(this._room)
        ]);
        await this._setupGameAssets()
        await this._scene.whenReadyAsync();
        this._engine.hideLoadingUI();

        this._setupUI();
        this._setupPhysicsMessagesListener();
        
        this._engine.runRenderLoop(() => {
            this._updatePhysicsAndRender();
        });
        window.addEventListener('resize', () => {
            this._engine.resize();
        });
    }

    private _waitForStateOnce(room: Room<MyRoomState>): Promise<void> {
        return new Promise((resolve) => {
            room.onStateChange.once(() => {
                resolve();
            });
        });
    }

    private async _connectOrReconnectToRoom() {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const hostname = window.location.hostname;
        console.log("iciiiiiiii====   " , `${protocol}//${hostname}:2567`);
        let colyseusSDK = new Client(`${protocol}//${hostname}:2567`);
        const token = sessionStorage.getItem("token");
        const reconnectionGameToken = localStorage.getItem("reconnectionGameToken");

        let room: Room<MyRoomState>;
        try {
            if (reconnectionGameToken) {
                console.log("Trying to reconnect...");
                room = await colyseusSDK.reconnect<MyRoomState>(reconnectionGameToken);
            } else {
                throw new Error("No room/session stored");
            }
        } catch (e) {
            console.log("Reconnect failed or no previous session, joining new room:", e);
            room = await colyseusSDK.joinOrCreate<MyRoomState>("my_room", {token: token});
        }
        localStorage.setItem("reconnectionGameToken", room.reconnectionToken);

        console.log("Joined room " + room.roomId);
        this._room = room;
        const callback = Callbacks.get(room);
        this._callback = callback;
    }

    private _updatePhysicsAndRender() {
        this._havokPlugin.setTimeStep(1/60);
        this._clock.updateAccumulator(this._engine.getDeltaTime());
        const acc = this._clock.getAccumulator();
        if (acc >= 1000/60) {
            this._havokPlugin.executeStep(1/60, this._environment.bodies);
            this._clock.tick++;
            this._clock.setbackAccumulator();
            this._ball.snapshots.saveSnapshot(this._clock.tick, this._ball.getPhysicsBodyPosition(), this._ball.getVelocity());
            //console.log("Adding supplementary physics step");
        } else if (acc <= -1000/60) {
            this._havokPlugin.setTimeStep(0);
            this._clock.tickSkipped = true;
            this._clock.addbackAccumulator();
            //console.log("Skipping a physics step");
        }

        this._scene.render();

        if (this._clock.tickSkipped) {
            this._clock.tickSkipped = false;
        } else {
            this._clock.tick++;
            this._ball.snapshots.saveSnapshot(this._clock.tick, this._ball.getPhysicsBodyPosition(), this._ball.getVelocity());
        }
    }

    private _setupPhysicsMessagesListener() {
        this._room.onMessage('Goal!', (tick: number) => {
            this._ball.setPhysicsBodyPosition(new Vector3(0,3,7));
            this._ball.setMeshPosition(Vector3.Zero());
            this._ball.setVelocity(Vector3.Zero());
            this._ball.ignoreServerUntil = tick;
            this._ball.snapshots.dispose();
            console.log("A point has been won at tick:", this._clock.tick, "and server tick:", tick);
        });
        this._room.onMessage("racketImpact", (data: any) => {
            const ballPos = new Vector3(data.position[0], data.position[1], data.position[2]);
            const ballVel = new Vector3(data.velocity[0], data.velocity[1], data.velocity[2]);
            const impactTick = data.tick;
            const ticksToResimulate = this._clock.tick - data.tick;
            console.log("impactTick:", data.tick, "ticks to resim:", ticksToResimulate);
            this._ball.setPhysicsBodyPosition(ballPos);
            this._ball.setVelocity(ballVel);
            this._ball._body.transformNode.computeWorldMatrix(true);
            this._ball._body.disablePreStep = false;
            this._ball.snapshots.clearAfterTickIncluded(data.tick);
            this._ball.snapshots.saveSnapshot(data.tick, ballPos, ballVel);
            const FIXED_TIME_STEP = 1 / 60;
            const preRollbackPos = this._ball.getPhysicsBodyPosition();
            for (let i = 0; i < ticksToResimulate; i++) {
                const simulatingTick = impactTick + i;
                this._ball._body.disablePreStep = false;
                this._havokPlugin.executeStep(FIXED_TIME_STEP, this._environment.bodies);
                this._ball._body.transformNode.computeWorldMatrix(true);
                this._ball.snapshots.saveSnapshot(simulatingTick + 1, this._ball.getPhysicsBodyPosition(), this._ball.getVelocity());
            }
            const postRollbackPos = this._ball.getPhysicsBodyPosition();
            const teleportDelta = preRollbackPos.subtract(postRollbackPos);
            this._ball.visualOffset.addInPlace(teleportDelta);
            console.log("Other player hit the ball");
        });
        this._room.onMessage("impactResponse", (tick) => {
            this._ball.recentImpact = true;
        });
    }

    private _setupUI() {
        this._ui = new GUI(this._room);

        this._isNear = this._room.state.players.get(this._player.sessionId).sideNear;
        this._callback.listen("roomStatus", () => {
            const status = this._room.state.roomStatus;
            switch (status) {
                case RoomStatus.WAITING:
                    this._ui.showWaitingUI();
                    this._player.lockControls();
                    break;
                case RoomStatus.STARTED:
                    console.log("Game has started");
                    this._player.unlockControls();
                    this._ui.showNoUI();
                    this._ui.addScoreUI(this._isNear, this._room.state.score.teamNear, this._room.state.score.teamFar);
                    break;
                case RoomStatus.WON:
                    this._player.lockControls();
                    this._ui.showEndUI(this._isNear, this._room.state.score.teamNear, this._room.state.score.teamFar);
                    break;
                case RoomStatus.PLAYER_DISCONNECTED:
                    this._player.lockControls();
                    this._ui.showOtherPlayerDisconnectUI();
                    break;
            }
        });
        this._callback.onChange(this._room.state.score, () => {
            this._ui.updateScoreUI(this._isNear, this._room.state.score.teamNear, this._room.state.score.teamFar);
        });
    }

    private async _setupHavok() {
        const havokInstance = await HavokPhysics({
            locateFile: (file) => `/node_modules/@babylonjs/havok/lib/esm/${file}`
        });
        this._havokPlugin = new HavokPlugin(true, havokInstance);
        this._havokPlugin.setTimeStep(1/60);
        this._scene.enablePhysics(new Vector3(0, 0, 0), this._havokPlugin); //no gravity (middle value at 0)
        this._room.onMessage("initialTick", (serverTick) => {
            this._clock.setInitialClientClock(serverTick);
        });
        this._room.onMessage("synchronizeTick", (serverTick) => {
            this._clock.updateAccumulatorSlew(serverTick)
        });
        this._room.send("initialTick");
        setInterval(() => {
                const t0 = Date.now();
                this._room.send("synchronizeTick", t0);
            }, 250);
    }

    private async _setupGameAssets() {
        this._scene.clearColor = new Color4(0.015, 0.015, 0.2);
        this._environment = new Environment(this._scene);
        await this._environment.load();
        this._shadow = this._initLightAndBall(this._scene);

        this._callback.onAdd("players", (player, sessionId) => {
            console.log("Player joined:", sessionId);
            if (sessionId === this._room.sessionId) {
                const playerPos = new Vector3(player.position.x, player.position.y, player.position.z);
                this._setupPlayer(sessionId, playerPos, player.sideNear);
            }
            else {
                const enemyPos = new Vector3(player.position.x, player.position.y, player.position.z);
                this._setupEnemy(sessionId, enemyPos, player.sideNear);
            }
            // this._callback.onChange(player, () => {
            //     if (player.connected = false) {
            //         this._ui.addPlayerDisconnectedUI();
            //     }
            //     if (player.connected = true && this._ui.getIsPlayerDisconnectedUIShown()) {
            //         this._ui.disposePlayerDisconnectedUI();
            //     }
            // });
        });
    }


    private _initLightAndBall(scene: Scene): ShadowGenerator {
        let light = new PointLight('PointLight', new Vector3(0,5,10), scene);
        light.diffuse = new Color3(1,1,1);
        light.intensity = 1;

        let shadow = new ShadowGenerator(1024, light);
        shadow.darkness = 0.4;
        this._shadow = shadow;

        let ballPos = new Vector3(this._room.state.ball.position.x, this._room.state.ball.position.y, this._room.state.ball.position.z);
        let ballVel = new Vector3(this._room.state.ball.velocity.x, this._room.state.ball.velocity.y, this._room.state.ball.velocity.z);
        this._ball = new Ball(ballPos, ballVel, 1, this.MAX_SPEED, shadow, this._scene, this._clock, this);
        this._ball.addToBodies(this._environment.bodies);
        
        this._setupBallUpdates();
        this._ball.setupCorrections();
        this._ball.setupSmoothing();
        return shadow;
    }

    private _setupBallUpdates() {
        this._callback.onChange(this._room.state.ball.position, () => {
            const serverPos = new Vector3(this._room.state.ball.position.x,this._room.state.ball.position.y,this._room.state.ball.position.z);
            const serverVel = new Vector3(this._room.state.ball.velocity.x,this._room.state.ball.velocity.y,this._room.state.ball.velocity.z);
            this._ball.serverPatch = {tick: this._room.state.ball.tickStamp, position: serverPos, velocity: serverVel};
        });
    }

    private async _setupPlayer(sessionId: string, position: Vector3, isNearSide: boolean) {
        const playerAssets = await this._loadCharacterAssets(position, true, isNearSide);
        this._camera = new PlayerCamera(isNearSide, this._scene);
        this._player = new Player(this, this._camera.getUniversalCamera(), sessionId, playerAssets, this._scene, this._shadow, this._room);
        this._player.setPlayerInput(
            new PlayerInput(this._scene, this._camera, this._player.getHandNode(), this._player.getRacketNode()));
        this._scene.onBeforePhysicsObservable.add(() => {
            this._player.updateBody();
            this._player.updateRacket(this._clock.tick);
            this._camera.updateCamera(isNearSide, this._player.getPlayerPosition());
        });
        this._environment.bodies.push(this._player.racketBody);
    }

    private async _setupEnemy(sessionId : string, position: Vector3, isNearSide: boolean) {
        const enemyAssets = await this._loadCharacterAssets(position, false, isNearSide);
        this._enemy = new Enemy(this._scene, enemyAssets, this._shadow, isNearSide);
        this._callback.onChange(this._room.state.players.get(sessionId).position, () => {
            const newPos = this._room.state.players.get(sessionId).position;
            this._enemy.registerBody(new Vector3(newPos.x, newPos.y, newPos.z));
        });
        this._callback.onChange(this._room.state.players.get(sessionId).rackPos, () => {
            const newPos = this._room.state.players.get(sessionId).rackPos;
            const newRot = this._room.state.players.get(sessionId).rackRot;
            this._enemy.registerRacket(new Vector3(newPos.x, newPos.y, newPos.z),
                new Quaternion(newRot.x, newRot.y, newRot.z, newRot.w));
        });
        this._scene.registerBeforeRender( () => {
            this._enemy.updateBody();
            this._enemy.updateRacket();
        });
    }

    private async _loadCharacterAssets(position: Vector3, isPlayer: boolean, isNearSide: boolean): Promise<{mesh: Mesh, handNode: TransformNode, racketNode: TransformNode}> {
        let body = MeshBuilder.CreateCylinder("body", {height: 3, diameter: 1.5}, this._scene);

        if (isPlayer) {
            body.isVisible = false;
        }
        if (isPlayer && !isNearSide) {
            body.rotation = new Vector3(0,Math.PI,0);//i dont pretend to understand why this line is required
        }
        if (!isPlayer && !isNearSide) {
            body.rotation = new Vector3(0,Math.PI,0);//i dont pretend to understand why this line is required
        }

        body.position = position;
        let bodymtl = new StandardMaterial("red", this._scene);
        bodymtl.diffuseColor = Color3.Red();
        body.material = bodymtl;
        body.isPickable = false;
        const hand_node = new TransformNode("hand_node", this._scene)
        hand_node.position = new Vector3(0.4, 2, 1);
        const hand = MeshBuilder.CreateSphere("hand", {diameter: 0.5});
        hand.material = bodymtl;

        let racketmtl = new StandardMaterial("white", this._scene);
        racketmtl.diffuseColor = new Color3(0.4,0.2,0);
        let stick = MeshBuilder.CreateCylinder("stick", {diameter: 0.2, height: 0.8});
        stick.position._y = 0.4;
        stick.material = racketmtl;
        const racket = MeshBuilder.CreateCylinder("racket", {diameter: 1, height: 0.2});
        racket.material = racketmtl;
        racket.position._y = 0.7;
        racket.rotationQuaternion = Quaternion.FromEulerAngles(Math.PI / 2, 0, 0);
        
        let racketRoot = new TransformNode("racketRoot", this._scene);

        racket.parent = stick;
        stick.parent = hand;
        hand.parent = racketRoot;
        racketRoot.parent = hand_node;
        hand_node.parent = body;
        return { mesh: body, handNode: hand_node, racketNode: racketRoot};
    }

    public getTick() : number {
        return this._clock.tick;
    }

    public getPlayerRacketHistory() : RacketHistory {
        return this._player.racketHistory;
    }

    public getPlayerImpactSnapshots() : SnapshotBuffer {
        return this._player.impactSnapshots;
    }

    public getPlayer() : Player {
        return this._player;
    }

    public setRecentImpact() {
        this._ball.recentImpact = true;
    }

    public getIsResimming() : boolean {
        return this._ball.isResimming;
    }

    public getHavokPlugin() : HavokPlugin {
        return this._havokPlugin;
    }

    public getBodies() : PhysicsBody[] {
        return this._environment.bodies;
    }

    public getEngine() : Engine {
        return this._engine;
    }
}
