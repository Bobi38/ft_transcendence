import { EventEmitter } from "./EventEmitter";
import { Callbacks, Client, Room } from "@colyseus/sdk";
import { StateCallbackStrategy } from "@colyseus/schema";
import { MyRoomState } from "./schema/MyRoomState";
import { BallSnapshot } from "./snapshots";
import { GameState } from "./GameState";
import { Quaternion, Vector3 } from "@babylonjs/core";
import { SynchronizedClock } from "./SynchronizedClock";


export class NetworkManager extends EventEmitter {
    private _room : Room<MyRoomState>;
    private _callback : StateCallbackStrategy<MyRoomState>;
    private _client : Client;
    private _gameState : GameState;
    private _clock : SynchronizedClock;
    public onUnauthorized?: () => void;

    constructor(gameState: GameState, clock: SynchronizedClock) {
        super();
        this._gameState = gameState;
    }

    
    public async initialize(): Promise<void> {
        this._room = await this._connectOrReconnectToRoom();
        const callback = Callbacks.get(this._room);
        this._callback = callback;

        this._setupPhysicsMessages();

        this._setupNetworkEvents();
        
        this._callback.listen("roomStatus", () => {
            this.emit('onGameStatusChange', this._room.state.roomStatus);
            this._gameState.gameStatus = this._room.state.roomStatus;
        });
        this._callback.onChange(this._room.state.score, () => {
            this.emit('onScoreChange', this._room.state.score.teamNear, this._room.score.teamFar)
            this._gameState.teamNear = this._room.state.score.teamNear;
            this._gameState.teamFar = this._room.state.score.teamFar;
        });
        this._syncWithColyseus();

        this._setupPlayerJoinedRoom();

        this._setupClock();

        return new Promise((resolve) => {
            this._room.onStateChange.once(() => {
                this.emit("onReady");
                resolve();
            });
        });
    }

    public sendRacketImpact(ballState: BallSnapshot) {
        this._room.send("racketImpact", {tick: ballState.tick, position: ballState.position.asArray(), velocity: ballState.velocity.asArray()});
    }

    public async leave(): Promise<void> {
        if (this._room) {
            await this._room.leave(true);
        }
        localStorage.removeItem("reconnectionGameToken");
        console.log("Network session cleaned up.");
    }

    public async drop(): Promise<void> {
        if (this._room) {
            await this._room.leave(false);
        }
    }

    private async _connectOrReconnectToRoom() {
        const protocol = window.location.protocol;
        const hostname = window.location.hostname;
        console.log("iciiiiiiii====   " , `${protocol}//${hostname}/api/pong3d`);
        let colyseusSDK : Client = new Client(`${protocol}//${hostname}:9443/api/pong3d`);
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
                console.log(newRoomError);
                if (newRoomError.code == 401) {
                    this.onUnauthorized?.();
                }
                window.location.href = "/";
                console.log("Failed to join new room, error:", newRoomError, "sending back to home");
            }
        }
        localStorage.setItem("reconnectionGameToken", room.reconnectionToken);

        console.log("Joined room " + room.roomId);
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
        this._callback.onChange
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
        this._room.onReconnect((code: number, reason: string) => {
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
        setInterval(() => {
                const t0 = Date.now();
                this._room.send("synchronizeTick", t0);
            }, 250);
    }

    private _setupPlayerJoinedRoom() {
        this._callback.onAdd("players", (player, sessionId) => {
            console.log("Player joined:", sessionId);
            if (sessionId === this._room.sessionId) {
                const playerPos = new Vector3(player.position.x, player.position.y, player.position.z);
                const racketPos = new Vector3(player.position.x, player.position.y, player.position.z);
                const racketRot = new Vector3(player.position.x, player.position.y, player.position.z);
                this._gameState.players.set(sessionId, {pos: playerPos,
                    rackPos: racketPos, rackRot: racketRot,
                    sideNear: player.sideNear, connected: player.connected});
                this.emit("onPlayerJoined", sessionId, playerPos, player.sideNear)
                //this._setupPlayer(sessionId, playerPos, player.sideNear);
            }
            else {
                const enemyPos = new Vector3(player.position.x, player.position.y, player.position.z);
                const racketPos = new Vector3(player.position.x, player.position.y, player.position.z);
                const racketRot = new Vector3(player.position.x, player.position.y, player.position.z);
                this._gameState.players.set(sessionId, {pos: enemyPos,
                    rackPos: racketPos, rackRot: racketRot,
                    sideNear: player.sideNear, connected: player.connected});
                this.emit("onEnemyJoined", sessionId, enemyPos, player.sideNear);

                this._callback.onChange(this._room.state.players.get(sessionId).position, () => {
                    const newPos = this._room.state.players.get(sessionId).position;
                    this._gameState.players.get(sessionId).pos = newPos;
                });
                this._callback.onChange(this._room.state.players.get(sessionId).rackPos, () => {
                    const newPos = this._room.state.players.get(sessionId).rackPos;
                    const newRot = this._room.state.players.get(sessionId).rackRot;
                    this._gameState.players.get(sessionId).rackPos = newPos;
                    this._gameState.players.get(sessionId).rackRot = newRot;
                });
            }
        });
    }
}