import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import "@babylonjs/gui"
import { Engine, Scene, Vector3, Mesh, MeshBuilder, Color4, StandardMaterial, Color3, PointLight, ShadowGenerator, TransformNode, HavokPlugin, Quaternion, Epsilon, UniversalCamera} from "@babylonjs/core";
import { Callbacks, Client, CloseCode, Room } from "@colyseus/sdk";
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
    //public playerAssets;

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

    private _waitForStateOnce(room: Room<MyRoomState>): Promise<void> {
        return new Promise((resolve) => {
            room.onStateChange.once(() => {
            resolve();
        });
    });
}

    private async _main(): Promise<void> {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const hostname = window.location.hostname;
        console.log("iciiiiiiii====   " , `${protocol}//${hostname}:2567`);
        let colyseusSDK = new Client(`${protocol}//${hostname}:2567`);
        // let colyseusSDK = new Client("ws://localhost:2567");
        const token = sessionStorage.getItem("token");
        const reconnectionGameToken = localStorage.getItem("reconnectionGameToken");

        let room: Room<MyRoomState>;
        try {
            if (reconnectionGameToken) {
                console.log("Trying to reconnect...");
                // Reconnect to the existing room
                room = await colyseusSDK.reconnect<MyRoomState>(reconnectionGameToken);
            } else {
                throw new Error("No room/session stored, joining new room");
            }
        } catch (e) {
            //const token = sessionStorage.getItem("token");
            console.log("Reconnect failed or no previous session, joining new room:", e);
            room = await colyseusSDK.joinOrCreate<MyRoomState>("my_room", {token: token});
        }
        console.log(room.state);
        localStorage.setItem("reconnectionGameToken", room.reconnectionToken);

        // const room = await colyseusSDK.joinOrCreate<MyRoomState>("my_room");
        console.log("Joined room " + room.roomId);
        this._room = room;
        const callback = Callbacks.get(room);
        this._callback = callback;

        this._engine.displayLoadingUI();
        await Promise.all([
            this._setupHavok(),
            this._waitForStateOnce(room)
        ]);
        console.log(room.state);
        await this._setupGameAssets();
        await this._scene.whenReadyAsync();
        this._engine.hideLoadingUI();

        this._ui = new GUI(room);
        this._ui.addWaitingUI();

        callback.listen("roomStatus", () => {
            const status = this._room.state.roomStatus;
            switch (status) {
                case RoomStatus.STARTED:
                    console.log("Game has started");
                    this._player.unlockControls();
                    this._ui.disposeWaitingUI();
                    this._ui.addScoreUI(room.state.players.get(this._player.sessionId).sideNear);
                    break;
                case RoomStatus.WON:
                    this._player.lockControls();
                    this._ui.addEndUI(room.state.score.teamNear, room.state.score.teamFar);
                    break;
                case RoomStatus.PLAYER_DISCONNECTED:
                    this._player.lockControls();
                    this._ui.addOtherPlayerDisconnectUI();
                    break;
            }
        });
        callback.onChange(room.state.score, () => {
            this._ui.updateScoreUI(room.state.score.teamNear, room.state.score.teamFar);
        });
        // callback.listen("won", () => {
        //     if (!this._room.state.won)
        //         return ;
        //     this._player.lockControls();
        //     this._ui.addEndUI(room.state.score.teamNear, room.state.score.teamFar);
        // });
        // callback.listen("endedDisconnect", () => {
        //     if (!this._room.state.endedDisconnect)
        //         return ;
        //     this._player.lockControls();
        //     this._ui.addOtherPlayerDisconnectUI();
        // });

        // room.onDrop((code, reason) => {
        //     console.log(`Disconnected: ${code} - ${reason}`);
        //     localStorage.setItem("test", "test1");
        //     //showReconnectingUI();
        // });esult
        // room.onReconnect(() => {
        //     console.log("Reconnected!");
        //     //hideReconnectingUI();
        // });
        // room.onLeave((code, reason) => {
        //     console.log(`Left room: ${code}`);
 
        //     // if (code === CloseCode.FAILED_TO_RECONNECT) {
        //     //     showError("Failed to reconnect. Please try again.");
        //     // }
 
        //     // // Clean up and return to menu
        //     // cleanupGame();
        // });
        // room.onError((code, message) => {
        //     console.error(`Room error: ${code} - ${message}`);
        // });
        this._engine.runRenderLoop(() => {
            this._scene.render();
        });
        window.addEventListener('resize', () => {
            this._engine.resize();
        });
    }

    private async _setupHavok() {
        const havokInstance = await HavokPhysics({
            locateFile: (file) => `/node_modules/@babylonjs/havok/lib/esm/${file}`
        });
        const havokPlugin = new HavokPlugin(true, havokInstance);
        havokPlugin.setTimeStep(1/60);
        this._scene.enablePhysics(new Vector3(0, 0, 0), havokPlugin); //no gravity (middle value at 0)
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
            this._callback.onChange(player, () => {
                if (player.connected = false) {
                    this._ui.addPlayerDisconnectedUI();
                }
                if (player.connected = true && this._ui.getIsPlayerDisconnectedUIShown()) {
                    this._ui.disposePlayerDisconnectedUI();
                }
            });
        });
        this._callback.onChange(this._room.state.ball, () => {
            let ballPos = new Vector3(this._room.state.ball.position.x, this._room.state.ball.position.y, this._room.state.ball.position.z);
            this._ball = new Ball(ballPos, 1, this.MAX_SPEED, this._shadow, this._scene);
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
        this._ball = new Ball(ballPos, 1, this.MAX_SPEED, shadow, this._scene);
        
        this._callback.onChange(this._room.state.ball.position, () => {
            const newPos = new Vector3(this._room.state.ball.position.x,this._room.state.ball.position.y,this._room.state.ball.position.z);
            this._ball.positionError = newPos.subtract(this._ball.getMeshPosition());
        });
        this._callback.onChange(this._room.state.ball.velocity, () => {
            const newVel = new Vector3(this._room.state.ball.velocity.x,this._room.state.ball.velocity.y,this._room.state.ball.velocity.z);
            this._ball.setVelocity(newVel);
        });
        this._scene.onBeforeRenderObservable.add(() => {
            if (!this._ball.positionError)
                return ;
            const patchRate = 0.05; //in seconds
            const dt = this._engine.getDeltaTime() / 1000; // time between frames in seconds
            const fractionElapsed = patchRate / dt;
            const correctionFactor = 1 - Math.pow(0.05, fractionElapsed); //see what happen when framerate slower than patchRate
            const ballPos = this._ball.getMeshPosition();
            this._ball.setMeshPosition(ballPos.add(this._ball.positionError.scale(correctionFactor)));
            this._ball.positionError.scaleInPlace(1 - correctionFactor);
            if (this._ball.positionError.lengthSquared() < Epsilon)
                this._ball.positionError = null;
        });
        return shadow;
    }

    private async _setupPlayer(sessionId: string, position: Vector3, isNearSide: boolean) {
        const playerAssets = await this._loadCharacterAssets(position, true, isNearSide);
        this._camera = new PlayerCamera(isNearSide, this._scene);
        this._player = new Player(sessionId, playerAssets, this._scene, this._shadow, this._room);
        this._player.setPlayerInput(
            new PlayerInput(this._scene, this._camera, this._player.getHandNode(), this._player.getRacketNode()));
        this._scene.registerBeforeRender(() => {
            this._player.updateBody();
            this._player.updateRacket();
            this._camera.updateCamera(isNearSide, this._player.getPlayerPosition());
        });
    }

    private async _setupEnemy(sessionId : string, position: Vector3, isNearSide: boolean) {
        const enemyAssets = await this._loadCharacterAssets(position, false, isNearSide);
        this._enemy = new Enemy(this._scene, enemyAssets, this._shadow);
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
}
