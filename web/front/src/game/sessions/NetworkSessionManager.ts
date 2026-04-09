import { EventEmitter } from "./EventEmitter";
import { Callbacks, Client, Room } from "@colyseus/sdk";
import { StateCallbackStrategy } from "@colyseus/schema";
import { MyRoomState } from "../schema/MyRoomState";
import { BallSnapshot } from "../utils/Snapshots";
import { GameState } from "./GameState";
import { AbstractMesh, Quaternion, Scene, TransformNode, Vector3 } from "@babylonjs/core";
import { SynchronizedClock } from "../utils/SynchronizedClock";
import { GameSession } from "./GameSession";
import { Ball } from "../physics/Ball";
import { Environment } from "../physics/Environment";



export class NetworkSessionManager extends EventEmitter implements GameSession {
    private _room : Room<MyRoomState>;
    private _callback : StateCallbackStrategy<MyRoomState>;
    private _gameState : GameState;
    private _clock : SynchronizedClock;
    private _interval: number | null = null;
    public  onUnauthorized: () => void;
    public  onReturnToMenu: () => void;
    private _voluntaryLeave : boolean = false;

    constructor(gameState: GameState, clock: SynchronizedClock, onReturnToMenu: () => void, onUnauthorized: () => void) {
        super();
        this._gameState = gameState;
        this._clock = clock;
        this.onReturnToMenu = onReturnToMenu;
        this.onUnauthorized = onUnauthorized;
    }


    public async initialize(): Promise<void | null> {
        this._room = await this._connectOrReconnectToRoom();

        const callback = Callbacks.get(this._room);
        this._callback = callback;

        await this._waitForStateOnce(this._room);
        this._initGameState();

        this._setupPhysicsMessages();

        this._setupNetworkEvents();
        
        this._callback.listen("roomStatus", () => {
            this.emit('onGameStatusChange', this._room.state.roomStatus);
            this._gameState.gameStatus = this._room.state.roomStatus;
        });
        this._callback.onChange(this._room.state.score, () => {
            this.emit('onScoreChange', this._room.state.score.teamNear, this._room.state.score.teamFar)
            this._gameState.teamNear = this._room.state.score.teamNear;
            this._gameState.teamFar = this._room.state.score.teamFar;
        });
        this._syncWithColyseus();

        this._setupPlayerJoinedRoom();

        this._setupClock();

        this.emit("onReady");
    }

    public sendRacketImpact(ballState: BallSnapshot) {
        this._room.send("racketImpact", {tick: ballState.tick, position: ballState.position.asArray(), velocity: ballState.velocity.asArray()});
    }

    public sendUpdateBody(pos: Vector3) {
        this._room.send("bodyMoved", {position: pos.asArray()});
    }

    public sendUpdateRacket(rackPos: Vector3, rackRot: Quaternion) {
        this._room.send("racketMoved", {position: rackPos.asArray(), rotation: rackRot.asArray()});
    }

    public async leave(): Promise<void> {
        if (this._room) {
            await this._room.leave(true);
        }
        localStorage.removeItem("reconnectionGameToken");
        console.log("Network session cleaned up.");
    }

    private async _waitForStateOnce(room: Room<MyRoomState>): Promise<void> {
        return new Promise((resolve) => {
            room.onStateChange.once(() => {
                resolve();
            });
        });
    }
    
    private _initGameState() {
        this._gameState.ballPos = new Vector3(this._room.state.ball.position.x, this._room.state.ball.position.y, this._room.state.ball.position.z);
        this._gameState.ballVel = new Vector3(this._room.state.ball.velocity.x, this._room.state.ball.velocity.y, this._room.state.ball.velocity.z);
        this._gameState.teamFar = this._room.state.score.teamFar;
        this._gameState.teamNear = this._room.state.score.teamNear;
        this._gameState.gameStatus = this._room.state.roomStatus;
    }

    private async _connectOrReconnectToRoom() : Promise<Room> {
        const protocol = window.location.protocol;
        const hostname = window.location.hostname;
        const port = window.location.port;
        let colyseusSDK : Client;
        if (protocol === "https")
            colyseusSDK = new Client(`${protocol}//${hostname}:${port}/api/pong3d`);
        else
            colyseusSDK = new Client(`ws://${hostname}:2567`);
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
            if (reconnectionGameToken)
                localStorage.removeItem("reconnectionGameToken")
            try {
                room = await colyseusSDK.joinOrCreate<MyRoomState>("my_room", {token: token});
            } catch (newRoomError) {
                console.log(newRoomError, newRoomError.code);
                if (newRoomError.code == 401) {
                    console.log("going to use onUnauthorized", this.onUnauthorized);
                    this.onUnauthorized();
                    throw Error("Failed to connect");
                }
                this.onReturnToMenu();
                console.log("Failed to join new room, error:", newRoomError, "sending back to home");
                throw Error("Failed to connect");
            }
        }
        localStorage.setItem("reconnectionGameToken", room.reconnectionToken);
        console.log("Joined room " + room.roomId);
        return room;
    }

    private _syncWithColyseus() {
        this._callback.onChange(this._room.state.ball.position, () => {
            const newPos = new Vector3(this._room.state.ball.position.x, this._room.state.ball.position.y, this._room.state.ball.position.z);
            const newVel = new Vector3(this._room.state.ball.velocity.x, this._room.state.ball.velocity.y, this._room.state.ball.velocity.z);
            this._gameState.ballPos = newPos;
            this._gameState.ballVel = newVel;
            this._gameState.ballTickStamp = this._room.state.ball.tickStamp;
            this.emit('onServerPatch');
        });
    }

    private _setupPhysicsMessages() {
        this._callback.onChange(this._room.state.ball.position, () => this.emit('onNewBallPos'));
        this._room.onMessage('Goal!', (data: any) => this.emit('onGoalScored', data));
        this._room.onMessage("racketImpact", (data: any) => this.emit('onOpponentHit', data));
        this._room.onMessage("impactResponse", (tick: number) => this.emit('onImpactResponse', tick));
    }

    private _setupNetworkEvents() {
        this._room.onDrop((code: number, reason: string) => {
            console.log("Connection dropped attempting to reconnect...");
            console.log("code:", code, "reason:", reason);
            this.emit('onDrop')});
        this._room.onReconnect(() => {
            console.log("successfully reconnected to the room!");
            this.emit('onReconnect')});
        this._room.onLeave((code: number, reason: string) => {
            console.log("Failed to reconnect on time");
            this.emit('onLeave')});
    }

    private async _setupClock() {
        this._room.onMessage("initialTick", (serverTick: number) => {
            this._clock.setInitialClientClock(serverTick);
        });
        this._room.onMessage("synchronizeTick", (serverTick: number) => {
            this._clock.updateAccumulatorSlew(serverTick)
        });
        this._room.send("initialTick");
        this._interval = setInterval(() => {
            const t0 = Date.now();
            this._room.send("synchronizeTick", t0);
        }, 250) as unknown as number;
    }

    private _setupPlayerJoinedRoom() {
        this._callback.onAdd("players", (player, sessionId: string) => {
            console.log("Player joined:", sessionId);
            if (sessionId === this._room.sessionId) {
                const playerPos = new Vector3(player.position.x, player.position.y, player.position.z);
                const racketPos = new Vector3(player.rackPos.x, player.rackPos.y, player.rackPos.z);
                const racketRot = new Quaternion(player.rackRot.x, player.rackRot.y, player.rackRot.z, player.rackRot.w);
                this._gameState.players.set(sessionId, {isPlayer: true, pos: playerPos,
                    rackPos: racketPos, rackRot: racketRot,
                    sideNear: player.sideNear, connected: player.connected});
                this.emit("onPlayerJoined", sessionId, playerPos, player.sideNear)
            }
            else {
                const enemyPos = new Vector3(player.position.x, player.position.y, player.position.z);
                const racketPos = new Vector3(player.rackPos.x, player.rackPos.y, player.rackPos.z);
                const racketRot = new Quaternion(player.rackRot.x, player.rackRot.y, player.rackRot.z, player.rackRot.w);
                this._gameState.players.set(sessionId, {isPlayer: false, pos: enemyPos,
                    rackPos: racketPos, rackRot: racketRot,
                    sideNear: player.sideNear, connected: player.connected});
                this.emit("onEnemyJoined", sessionId, enemyPos, player.sideNear);

                this._callback.onChange(this._room.state.players.get(sessionId).position, () => {
                    const newPos = this._room.state.players.get(sessionId).position;
                    this._gameState.players.get(sessionId).pos = new Vector3(newPos.x, newPos.y, newPos.z);
                });
                this._callback.onChange(this._room.state.players.get(sessionId).rackPos, () => {
                    const newPos = this._room.state.players.get(sessionId).rackPos;
                    const newRot = this._room.state.players.get(sessionId).rackRot;
                    this._gameState.players.get(sessionId).rackPos = new Vector3(newPos.x, newPos.y, newPos.z);
                    this._gameState.players.get(sessionId).rackRot =  new Quaternion(newRot.x, newRot.y, newRot.z, newRot.w);
                });
            }
        });
    }

    public setVoluntaryLeave() {
        this._voluntaryLeave = true;
    }

    public async dispose() : Promise<void> {
        this.onUnauthorized = null;
        this.onReturnToMenu = null;
        this._callback = null;

        if (this._room) {
            this._room.removeAllListeners();
            this._room.onStateChange.clear();
            this._room.onDrop.clear();
            this._room.onReconnect.clear();
            this._room.onLeave.clear();
            this._room.onError.clear();
            if (!this._voluntaryLeave) {
                this._room.reconnection.maxRetries = 0;
                await this._room.leave(false);
            } else await this._room.leave(true);
            this._room = null;
        }
        
        clearInterval(this._interval);
        this.clear();
    }

    public emitGoalScored(teamNearScored: boolean): void {}
    public update() {}
    public setupEnemy(scene: Scene, ball: Ball, body: AbstractMesh, handNode: TransformNode, racketNode: TransformNode, env: Environment) {}
}