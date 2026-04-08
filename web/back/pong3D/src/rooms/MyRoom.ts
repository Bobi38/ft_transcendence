import { Room, Client, CloseCode, AuthContext, ServerError } from "colyseus";
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

export class MyRoom extends Room {
  private _simulation: Simulation;
  private _nextPlayerIndex: number = 0;
  private _tokens : Map<string, {auth: string, score: number, hasWon: boolean, hasDisconnected: boolean}>
    = new Map<string, {auth: string, score: number, hasWon: boolean, hasDisconnected: boolean}>();
  private _near : string;
  private _far: string;
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
    }
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
    this._simulation = new Simulation(this, this.state);
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
    console.log("auth.id:", auth.id);
    console.log(client.sessionId, "joined room", this.roomId);
    console.log("current room status:", this.state.roomStatus);
    this._tokens.set(client.sessionId, {auth: auth.id, score: 0, hasWon: false, hasDisconnected: false});
    const player = new Player();
    player.position.x = 0;
    player.position.y = 0.5;
    if (this._nextPlayerIndex % 2 == 0) {
      player.position.z = -20;
      this._near = client.sessionId;
    }
    else {
      player.position.z = 40;
      player.sideNear = false;
      this._far = client.sessionId;
    }
    this.state.players.set(client.sessionId, player);
    this._nextPlayerIndex++;
    if (this.state.players.size == 2 && this.state.roomStatus == RoomStatus.WAITING) {
      console.log("Game starting");
      this.state.roomStatus = RoomStatus.STARTED;
      this._timeStart = Date.now();
    }
  }

  onDrop(client: Client, code: number) {
    console.log(`Client ${client.sessionId} dropped (code: ${code})`);
    const player = this.state.players.get(client.sessionId);
    if (player && this.state.roomStatus === RoomStatus.STARTED) {
      player.connected = false;
      this._tokens.get(client.sessionId).hasDisconnected = true;
    }
    if (this.state.roomStatus === RoomStatus.STARTED)
      this.state.roomStatus = RoomStatus.AWAITING_RECONNECTION;
    console.log("room status:", this.state.roomStatus);
    if (this.state.players.size == 2) {
      this.allowReconnection(client, 5).catch(() => {
        if (this.state.roomStatus === RoomStatus.AWAITING_RECONNECTION) {
          this.state.roomStatus = RoomStatus.PLAYER_DISCONNECTED;
          this._timeEnd = Date.now();
        }
      });
    }
  }

  onReconnect(client: Client) {
    console.log(`Client ${client.sessionId} reconnected!`);
 
    const player = this.state.players.get(client.sessionId);
    if (player && this.state.roomStatus === RoomStatus.AWAITING_RECONNECTION) {
      this.state.roomStatus = RoomStatus.STARTED;
      player.connected = false;
      this._tokens.get(client.sessionId).hasDisconnected = false;
    }

    const token = this._tokens.get(client.sessionId); 
    if (token) {
        activePlayers.delete(token.auth);
    }
  }

  onLeave (client: Client, code: CloseCode) {
    /**
     * Called when a client leaves the room.
     */
    if (code == CloseCode.FAILED_TO_RECONNECT) {
      console.log(client.sessionId, "failed to reconnect to room", this.roomId);
    }
    else
      console.log(client.sessionId, "left room", this.roomId, "with code", code);
    if (this.state.roomStatus != RoomStatus.PLAYER_DISCONNECTED)
      this._timeEnd = this._simulation.getTimeEnd();
    this._simulation.getEngine().stopRenderLoop();
    this.lock();
    activePlayers.delete(this._tokens.get(client.sessionId).auth);
    this.state.players.delete(client.sessionId);
  }

  async _updateDbPlayer(playerId: string, won: boolean, timePlayed: number){
    const userData = await StatPong3D.findOne({where: {idUser: playerId}});
    await userData.increment({total_game: 1, time_played: timePlayed, win: won, lose: !won});
  }

  async _sendGameDataToDatabase() {
    const iterator = this._tokens.entries();
    const firstPlayer = iterator.next().value;
    const secondPlayer = iterator.next().value;
    const player1id = firstPlayer[1].auth;
    const player2id = secondPlayer[1].auth;
    const score1 = firstPlayer[1].score;
    const score2 = secondPlayer[1].score;
    console.log(player1id);
    let whowin, wholose;
    if (this.state.roomStatus == RoomStatus.PLAYER_DISCONNECTED) {
      if (firstPlayer[1].hasDisconnected) {whowin = player1id; wholose = player2id;} else {whowin = player2id; wholose = player2id;}
      try {
        GamePong3D.create({id_player_1: player1id, id_player_2: player2id, abortwinner: whowin, abortloser: wholose,
          score_1: score1, score_2: score2, date_game_start: this._timeStart, date_game_end: this._timeEnd, time: this._timeEnd - this._timeStart});
        this._updateDbPlayer(player1id, firstPlayer[1].hasDisconnected, this._timeEnd - this._timeStart);
        this._updateDbPlayer(player2id, secondPlayer[1].hasDisconnected, this._timeEnd - this._timeStart);
      } catch (e) {
        console.log("Failed to store results in database", e);
      }
    }
    else {
      if (firstPlayer[1].hasWon) {whowin = player1id; wholose = player2id;} else {whowin = player2id; wholose = player1id;}
      try {
        await GamePong3D.create({id_player_1: player1id, id_player_2: player2id, winner: whowin, loser: wholose,
          score_1: score1, score_2: score2, date_game_start: this._timeStart, date_game_end: this._timeEnd, time: this._timeEnd - this._timeStart});
        this._updateDbPlayer(player1id, firstPlayer[1].hasWon, this._timeEnd - this._timeStart);
        this._updateDbPlayer(player2id, secondPlayer[1].hasWon, this._timeEnd - this._timeStart);
      } catch (e) {
        console.log("Failed to store results in database", e);
      }
    }
  }

  onDispose() {
    /**
     * Called when the room is disposed.
     */
    console.log(this.state.roomStatus);
    if (this.state.roomStatus != RoomStatus.WAITING)
      this._sendGameDataToDatabase();

    for (let token of this._tokens.values()) {
      activePlayers.delete(token.auth);
    }

    this._tokens = null;
    this._simulation.dispose();

    console.log("room", this.roomId, "disposing and ending simulation");
  }

  public getTokens() {
    return this._tokens;
  }

  public getFar() : string {
    return this._far;
  }

  public getNear() : string {
    return this._near;
  }
}