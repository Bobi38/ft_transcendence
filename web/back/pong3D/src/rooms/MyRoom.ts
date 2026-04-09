import { Room, Client, AuthContext, ServerError } from "colyseus";
import { MyRoomState, Player, RoomStatus } from "./schema/MyRoomState.js";
import { Vector3 } from "@babylonjs/core"
import fs from "fs";
import User from "../models/user.js";
import StatPong3D from "../models/StatPong3D.js"
import GamePong3D from "../models/GamePong3D.js"
import jwt from "jsonwebtoken"
import { Simulation } from "../simulation.js";

const secret = fs.readFileSync('/run/secrets/cle_pswd', 'utf-8').trim();
const activePlayers = new Set<string>();

export interface PlayerStats {
    id: string;
    score: number;
    hasWon: boolean;
    hasDisconnected: boolean;
    side: "near" | "far";
}

interface RoomUserData {
    stats: PlayerStats;
    suspended?: boolean;
}

export class MyRoom extends Room {
  private _simulation: Simulation;
  private _nextPlayerIndex: number = 0;
  private _matchStats = new Map<string, PlayerStats>();
  private _timeStart: number;
  private _timeEnd: number;

  maxClients = 2;
  patchRate = 50;
  state = new MyRoomState();

  static count : number = 0;
  messages = {
    yourMessageType: (client: Client, message: any) => {
      /**
       * Handle "yourMessageType" message.
       */
      console.log(client.sessionId, "sent a message:", message);
    },
    "initialTick" : (client: Client, data: any) => {
      client.send("initialTick", this._simulation.getTick());
    },
    "synchronizeTick" : (client: Client, data: any) => {
      client.send("synchronizeTick", this._simulation.getTick());
    },
    "racketImpact": (client: Client, data: any) => {
      const ballPos = new Vector3(data.position[0], data.position[1], data.position[2]);
      const ballVel = new Vector3(data.velocity[0], data.velocity[1], data.velocity[2]);
      this._simulation.setPendingImpact({tick: data.tick, position: ballPos, velocity: ballVel});
      //this._ball.setLinearVelocity(ballVel);
      console.log(client.sessionId,  "hit the ball: ", data, "at server tick:", this._simulation.getTick());
      this.broadcast("racketImpact", data, { except: client });
      client.send("impactResponse", this._simulation.getTick());
    },
    "bodyMoved": (client: Client, data: any) => {
      const playerPos = this.state.players.get(client.sessionId).position;
      playerPos.x = data.position[0];
      playerPos.y = data.position[1];
      playerPos.z = data.position[2];
    },
    "racketMoved": (client: Client, data: any) => {
      const racketPos = this.state.players.get(client.sessionId).rackPos;
      racketPos.x = data.position[0];
      racketPos.y = data.position[1];
      racketPos.z = data.position[2];
      const racketRot = this.state.players.get(client.sessionId).rackRot;
      racketRot.x = data.rotation[0];
      racketRot.y = data.rotation[1];
      racketRot.z = data.rotation[2];
      racketRot.w = data.rotation[3];
    },
  }

  onBeforePatch(state: MyRoomState) {
    if (!this._simulation)
      return ;
    const toSend = this._simulation.getSnapshotToSend();
    if (!toSend)
      return ;
    const ballPos = toSend.position;
    const ballVel = toSend.velocity;
    state.ball.position.x = ballPos.x;
    state.ball.position.y = ballPos.y;
    state.ball.position.z = ballPos.z;

    state.ball.velocity.x = ballVel.x;
    state.ball.velocity.y = ballVel.y;
    state.ball.velocity.z = ballVel.z;

    state.ball.tickStamp = toSend.tick;
  }

  onCreate (options: any) {
    /**
     * Called when a new room is created.
     */
    this.state.ball.velocity.x = 0;
    this.state.ball.velocity.y = 0;
    this.state.ball.velocity.z = 0;
    console.log("room", this.roomId, "created and starting physics simulation");
    this._simulation = new Simulation(this, this.state, this._matchStats);
  }

  static async onAuth (token: string, options: any, context: AuthContext) {
      /**
       * This is a good place to validate the client's auth token.
       */
      const ourToken : string = options.token;
      console.log(ourToken);
      if (!ourToken) {
        console.log("Failed to send authorization token");
        return false;
      }
      let decoded;
      try {
        decoded = jwt.verify(ourToken, secret);
        if (typeof decoded === "string" || !("id" in decoded)) {
          console.log("Invalid token");
          return false;
        }
      } catch (e) {
        console.log("Verification failed:", e);
      }
      let result;
      try {
        result = await User.findOne({ where: { id: decoded.id } });
      } catch (e) {
        console.log(e);
        return false;
      }
      if (result == 0) {
        console.log("Failed to find token in database");
        return false;
      }

      console.log("result.id:", result.id);
      if (activePlayers.has(result.id)) {
            console.log(`Blocked duplicate login for: ${result.id}`);
            throw new ServerError(401, "Account is already logged in elsewhere!");
        }
      return result;
  }

  onJoin (client: Client, options: any, auth: any) {
    /**
     * Called when a client joins the room.
     */
    activePlayers.add(auth.id);

    const isNear = this._nextPlayerIndex % 2 === 0;
    const playerStats: PlayerStats = {
            id: auth.id,
            score: 0,
            hasWon: false,
            hasDisconnected: false,
            side: isNear ? "near" : "far"
        };
    this._matchStats.set(client.sessionId, playerStats);
    client.userData = { 
        stats: this._matchStats.get(client.sessionId), 
        suspended: false 
    } as RoomUserData;

    console.log("auth.id:", auth.id);
    console.log(client.sessionId, "joined room", this.roomId);

    const player = new Player();
      if (!isNear) player.sideNear = false;
    player.position.x = 0;
    player.position.y = 0.5;
    if (player.sideNear)
      player.position.z = -20;
    else 
      player.position.z = 40

    this.state.players.set(client.sessionId, player);
    this._nextPlayerIndex++;

    if (this.state.players.size == 2 && this.state.roomStatus == RoomStatus.WAITING) {
      console.log("Game starting");
      this.state.roomStatus = RoomStatus.STARTED;
      this._timeStart = Date.now();
    }
  }

  async onLeave(client: Client, code: number) {
    const userData = client.userData as RoomUserData;
    const isSuspended = userData?.suspended;
    
    const consented = (code === 4000);

    if (consented && !isSuspended) {
      console.log(`${client.sessionId} left permanently (Code: ${code})`);
      this._finalizeDisconnection(client.sessionId);
      return;
    }

    console.log(`${client.sessionId} disconnected (Code: ${code}). Awaiting reconnection...`);
    
    const player = this.state.players.get(client.sessionId);
    if (player) player.connected = false;
    
    console.log("onLeave:", this.state.roomStatus);
    if (this.state.roomStatus === RoomStatus.STARTED) {
      this.state.roomStatus = RoomStatus.AWAITING_RECONNECTION;
    }

    try {
      await this.allowReconnection(client, 5);
      
      console.log(`${client.sessionId} reconnected successfully!`);
      if (player) player.connected = true;

      console.log("on reconnection",this.state.roomStatus);
      if (this.state.roomStatus === RoomStatus.AWAITING_RECONNECTION) {
        this.state.roomStatus = RoomStatus.STARTED;
      }

      } catch (e) {
        console.log(`${client.sessionId} failed to return. Finalizing exit.`);
        this._finalizeDisconnection(client.sessionId);
      }
  }

  private _finalizeDisconnection(sessionId: string) {
    const stats = this._matchStats.get(sessionId);
    if (stats) {
        stats.hasDisconnected = true;
        activePlayers.delete(stats.id);
    }

    const state = this.state.roomStatus;
    if (state == RoomStatus.STARTED || state == RoomStatus.AWAITING_RECONNECTION || state == RoomStatus.WAITING) {
        this.state.roomStatus = RoomStatus.PLAYER_DISCONNECTED;
    }
    
    this._timeEnd = this._timeEnd || Date.now();
    this._simulation?.getEngine()?.stopRenderLoop();
    this.lock();
  } 

  async _sendGameDataToDatabase() {
    const players = Array.from(this._matchStats.values());
    if (players.length < 2)
      return;

    const p1 = players[0];
    const p2 = players[1];
    const timePlayed = this._timeEnd - this._timeStart;
    const isAbort = this.state.roomStatus === RoomStatus.PLAYER_DISCONNECTED;

    let loserStats = p1.hasDisconnected ? p1 : (p2.hasDisconnected ? p2 : (p1.hasWon ? p2 : p1));
    let winnerStats = (loserStats === p1) ? p2 : p1;

    try {
        await GamePong3D.create({
            id_player_1: p1.id,
            id_player_2: p2.id,
            score_1: p1.score,
            score_2: p2.score,
            time: timePlayed,
            date_game_start: this._timeStart,
            date_game_end: this._timeEnd,
            ...(isAbort 
                ? { abortwinner: winnerStats.id, abortloser: loserStats.id }
                : { winner: winnerStats.id, loser: loserStats.id }
            )
        });

        await this._updateDbPlayer(winnerStats.id, true, timePlayed);
        await this._updateDbPlayer(loserStats.id, false, timePlayed);

    } catch (e) {
        console.error("Failed to store game results in database", e);
    }
  }

  async _updateDbPlayer(playerId: string, won: boolean, timePlayed: number){
    const userData = await StatPong3D.findOne({where: {idUser: playerId}});
    await userData.increment({total_game: 1, time_played: timePlayed, win: won, lose: !won});
  }

  onDispose() {
    console.log(`Room ${this.roomId} disposing...`);
    
    if (this.state.roomStatus !== RoomStatus.WAITING) {
        this._timeEnd = this._timeEnd || Date.now(); 
        this._sendGameDataToDatabase();
    }

    for (let stats of this._matchStats.values()) {
        activePlayers.delete(stats.id);
    }

    this._simulation?.dispose();
  }
}