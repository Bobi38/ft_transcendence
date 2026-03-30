import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import "@babylonjs/gui"
import { Engine, Scene, Vector3, Mesh, MeshBuilder, Color4, StandardMaterial, Color3, PointLight, ShadowGenerator, TransformNode, HavokPlugin, Quaternion, PhysicsBody, SpotLight, DirectionalLight, HemisphericLight, Matrix } from "@babylonjs/core";
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
import { BallSnapshot, SnapshotBuffer } from "./snapshots";
import { SynchronizedClock } from "./SynchronizedClock";
import { RacketHistory } from "./RacketHistory";

export enum RoomStatus {
  WAITING = 0,
  STARTED = 1,
  WON = 2,
  PLAYER_DISCONNECTED = 3,
  AWAITING_RECONNECTION = 4
}

const TIMESTEP : number = 1/60;

export class App {
    private _canvas: HTMLCanvasElement;
    private _engine: Engine;
    private _scene: Scene;
    //private _havokPlugin: HavokPlugin;
    private _environment: Environment;
    private _player: Player;
    private _enemy: Enemy;
    private _camera: PlayerCamera;
    private MAX_SPEED: number = 40;
    private _ball: Ball;
    private _room : Room<MyRoomState>;
    private _callback : StateCallbackStrategy<MyRoomState>;
    private _shadows : ShadowGenerator[] = [];
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
            try {
            room = await colyseusSDK.joinOrCreate<MyRoomState>("my_room", {token: token});
            } catch (newRoomError) {
                window.location.href = "/";
                console.log("Failed to join new room, error:", newRoomError, "sending back to home");
            }
        }
        localStorage.setItem("reconnectionGameToken", room.reconnectionToken);

        console.log("Joined room " + room.roomId);
        this._room = room;
        const callback = Callbacks.get(room);
        this._callback = callback;
    }

    public _executeStep() {
        const oldPos = this._ball.getPhysicsBodyPosition();
        const newPos = oldPos.add(this._ball.getVelocity().scale(TIMESTEP));
        this._ball.setPhysicsBodyPosition(newPos);
    }

    public _checkRacketCollision() {
        const ballPos = this._ball.getPhysicsBodyPosition();
    
        const racketWorldMatrix = this._player.getRacketWorldMatrix();
        const invRacketMatrix = racketWorldMatrix.clone().invert();
        const localBallPos = Vector3.TransformCoordinates(ballPos, invRacketMatrix);
        localBallPos.subtractInPlace(this._player.racketOffset);

        const halfWidth = this._player.racketDimensions.x / 2;
        const halfHeight = this._player.racketDimensions.y / 2;
        const halfDepth = this._player.racketDimensions.z / 2;

        const closestX = Math.max(-halfWidth,  Math.min(localBallPos.x, halfWidth));
        const closestY = Math.max(-halfHeight, Math.min(localBallPos.y, halfHeight));
        const closestZ = Math.max(-halfDepth,  Math.min(localBallPos.z, halfDepth));
        const closest = new Vector3(closestX, closestY, closestZ);
        const distanceSquared = localBallPos.subtract(closest).lengthSquared();
        //console.log("distanceSquared:", distanceSquared);

        if (distanceSquared < (this._ball.radius ** 2)) {
            const newVel = this._player.getRacketHit();
            this._ball.setVelocity(newVel);
            if (!this._ball.isResimming) {
                this._room.send("racketImpact", {position: ballPos.asArray(), velocity: newVel.asArray(), tick: this._clock.tick});
            }
        }
    }

    public _checkWallCollision(){
        const ballPos = this._ball.getPhysicsBodyPosition();
        const radius = this._ball.radius;
        const min = this._environment.wallMin;
        const max = this._environment.wallMax;

        const ballVel : Vector3 = this._ball.getVelocity();
        if (ballPos.x - radius < min.x) {
            ballPos.x = min.x + radius;
            ballVel.x *= -1;
        } else if (ballPos.x + radius > max.x) {
            ballPos.x = max.x - radius;
            ballVel.x *= -1;
        }

        if (ballPos.y - radius < min.y) {
            ballPos.y = min.y + radius;
            ballVel.y *= -1;
        } else if (ballPos.y + radius > max.y) {
            ballPos.y = max.y - radius;
            ballVel.y *= -1;
        }

        this._ball.setPhysicsBodyPosition(ballPos);
        this._ball.setVelocity(ballVel);
    }

    private _updatePhysicsAndRender() {
        this._clock.updateAccumulator(this._engine.getDeltaTime());
        this._ball.correctPosAndVel();
        while (this._clock.getAccumulator() >= 1000/60) {
            this._updatePlayerAndEnemy();
            this._executeStep();
            this._checkRacketCollision();
            this._checkWallCollision();
            this._ball.snapshots.saveSnapshot(this._clock.tick, this._ball.getPhysicsBodyPosition(), this._ball.getVelocity());
            this._clock.tick++;
            this._clock.setbackAccumulator();
            //console.log("Adding supplementary physics step, tick now:", this._clock.tick);
        }
        this._ball.smoothPosition();
        this._scene.render();
    }

    private _setupPhysicsMessagesListener() {
        this._room.onMessage('Goal!', (data: any) => {
            const tick = data.tick;
            const newPos = new Vector3(data.position[0], data.position[1], data.position[2]);
            console.log("server sent pos:", newPos);
            this._ball.setPhysicsBodyPosition(newPos);
            this._ball.setMeshPosition(Vector3.Zero());
            this._ball.setVelocity(Vector3.Zero());
            //this._ball.setAngularVelocity(Vector3.Zero());
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
            const preRollbackPos = this._ball.getPhysicsBodyPosition();
            this._ball.setPhysicsBodyPosition(ballPos);
            this._ball.setVelocity(ballVel);
            this._ball.snapshots.clearAfterTickIncluded(data.tick);
            this._ball.snapshots.saveSnapshot(data.tick, ballPos, ballVel);
            for (let i = 1; i < ticksToResimulate; i++) {
                const simulatingTick = impactTick + i;
                this._executeStep();
                //this._checkRacketCollision();
                this._checkWallCollision();
                this._ball.snapshots.saveSnapshot(simulatingTick, this._ball.getPhysicsBodyPosition(), this._ball.getVelocity());
            }
            const postRollbackPos = this._ball.getPhysicsBodyPosition();
            const teleportDelta = preRollbackPos.subtract(postRollbackPos);
            this._ball.visualOffset.addInPlace(teleportDelta);
            console.log("Other player hit the ball");
        });
        this._room.onMessage("impactResponse", (tick) => {
            this._ball.recentImpact = false;
            this._ball.ignoreServerUntil = tick;
            console.log("server acknowledges impact at tick:", tick);
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
                case RoomStatus.AWAITING_RECONNECTION:
                    this._player.lockControls();
                    this._ui.showAwaitingReconnectionUI();
                    break;
            }
        });
        this._callback.onChange(this._room.state.score, () => {
            this._ui.updateScoreUI(this._isNear, this._room.state.score.teamNear, this._room.state.score.teamFar);
        });
        this._room.onDrop((code, reason) => {
            console.log("Connection dropped attempting to reconnect...");
            console.log("code:", code, "reason:", reason);
            this._player.lockControls();
            this._ui.showAwaitingReconnectionUI();
        });
        this._room.onReconnect(() => {
            console.log("successfully reconnected to the room!");
            this._player.unlockControls();
            this._ui.showNoUI();
        });
        this._room.onLeave(() => {
            console.log("Failed to reconnect on time");
            this._ui.showFailedReconnectionUI();
        });
    }

    private async _setupHavok() {
        // const havokInstance = await HavokPhysics({
        //     locateFile: (file) => `/node_modules/@babylonjs/havok/lib/esm/${file}`
        // });
        // this._havokPlugin = new HavokPlugin(false, havokInstance);
        // this._havokPlugin.setTimeStep(1/60);
        // this._scene.enablePhysics(new Vector3(0, 0, 0), this._havokPlugin); //no gravity (middle value at 0)
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
        this._initLightAndBall(this._scene);

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
        });
    }


    private _initLightAndBall(scene: Scene) {
        let light1 = new SpotLight('Light1', new Vector3(0,6,-10), new Vector3(0,-0.5,1), Math.PI/4, 40, scene);
        light1.diffuse = new Color3(1,1,1);
        light1.intensity = 0.4;
        let shadow1 = new ShadowGenerator(2048, light1);
        shadow1.darkness = 0.1;
        this._shadows.push(shadow1);
        let light2 = new SpotLight('Light1', new Vector3(0,6,30), new Vector3(0,-0.5,-1), Math.PI/4, 40, scene);
        //let light2 = new DirectionalLight('Light2', new Vector3(0.4,-0.6,-1), scene);
        light2.diffuse = new Color3(1,1,1);
        light2.intensity = 0.5;
        let light3 = new HemisphericLight("Light3", new Vector3(0,1,0), scene);
        light3.intensity = 0.6;
        light3.groundColor = new Color3(0.5, 0.5, 0.5);
        let shadow2 = new ShadowGenerator(2048, light2);
        shadow2.darkness = 0.1;
        this._shadows.push(shadow2);

        let ballPos = new Vector3(this._room.state.ball.position.x, this._room.state.ball.position.y, this._room.state.ball.position.z);
        let ballVel = new Vector3(this._room.state.ball.velocity.x, this._room.state.ball.velocity.y, this._room.state.ball.velocity.z);
        this._ball = new Ball(ballPos, ballVel, 1, this.MAX_SPEED, this._shadows, this._scene, this._clock, this);        
        this._setupBallUpdates();
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
        this._player = new Player(this, this._camera.getUniversalCamera(), sessionId, playerAssets, this._scene, this._shadows, this._room);
        this._player.setPlayerInput(
            new PlayerInput(this._scene, this._camera, this._player.getHandNode(), this._player.getRacketNode()));
    }

    private _updatePlayerAndEnemy() {
        if (this._player) {
            this._player.updateBody();
            this._player.updateRacket(this._clock.tick);
            this._camera.updateCamera(this._isNear, this._player.getPlayerPosition());
        }
        if (this._enemy) {
            this._enemy.updateBody();
            this._enemy.updateRacket();
        }
    }

    private async _setupEnemy(sessionId : string, position: Vector3, isNearSide: boolean) {
        const enemyAssets = await this._loadCharacterAssets(position, false, isNearSide);
        this._enemy = new Enemy(this._scene, enemyAssets, this._shadows, isNearSide);
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

    public getEngine() : Engine {
        return this._engine;
    }

    public updateSnapshot(snapshot : BallSnapshot) {
        this._ball.snapshots.clearAfterTickIncluded(this._clock.tick);
        this._ball.snapshots.saveSnapshot(snapshot.tick, snapshot.position, snapshot.velocity);
    }
}
