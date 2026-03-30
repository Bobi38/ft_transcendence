import { Room, Client, CloseCode, AuthContext } from "colyseus";
import { MyRoomState, Player, RoomStatus } from "./schema/MyRoomState.js";
import { ArcRotateCamera, HavokPlugin, NullEngine, PhysicsBody, PhysicsShape, Scene, TransformNode, Vector3 } from "@babylonjs/core"
import HavokPhysics from "@babylonjs/havok";
import fs from "fs";
import path from "path";
import { Environment } from "../environment.js";
import User from "../models/user.js";
import StatPong3D from "../models/StatPong3D.js"
import GamePong3D from "../models/GamePong3D.js"
import jwt from "jsonwebtoken"
import { BallSnapshot, SnapshotBuffer } from "../snapshots.js";
import { Ball } from "../ball.js";

const secret = fs.readFileSync('/run/secrets/cle_pswd', 'utf-8').trim();
const TIMESTEP : number = 1/60;

export class MyRoom extends Room {
  private _scene : Scene;
  private _engine: NullEngine;
  private _ball: Ball;
  private _environment: Environment = new Environment();
  private _bodies: PhysicsBody[] = [];
  private _shapes: PhysicsShape[] = [];
  private _nodes: TransformNode[] = [];
  // private _havokPlugin: HavokPlugin;
  private _nextPlayerIndex: number = 0;
  private _tokens : Map<string, {auth: string, score: number, hasWon: boolean, hasDisconnected: boolean}>
    = new Map<string, {auth: string, score: number, hasWon: boolean, hasDisconnected: boolean}>();
  private _near : string;
  private _far: string;
  private _tick: number = 0;
  private _impactSnapshots : SnapshotBuffer = new SnapshotBuffer();
  private _snapshotToSend : BallSnapshot;
  private _pendingImpact : BallSnapshot = null;
  private _timeStart: number;
  private _timeEnd: number;
  private _served : boolean = true;

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
      client.send("initialTick", this._tick);
    },
    "synchronizeTick" : (client: Client, data: any) => {
      client.send("synchronizeTick", this._tick);
    },
    "racketImpact": (client: Client, data: any) => {
      const ballPos = new Vector3(data.position[0], data.position[1], data.position[2]);
      const ballVel = new Vector3(data.velocity[0], data.velocity[1], data.velocity[2]);
      this._pendingImpact = {tick: data.tick, position: ballPos, velocity: ballVel};
      //this._ball.setLinearVelocity(ballVel);
      console.log(client.sessionId,  "hit the ball: ", data, "at server tick:", this._tick);
      this.broadcast("racketImpact", data, { except: client });
      client.send("impactResponse", this._tick);
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

  private async _startSimulation() {
    const engine = new NullEngine();
    const scene = new Scene(engine);
    const camera = new ArcRotateCamera("Camera", 0, 0.8, 100, Vector3.Zero(), scene); //necessary for scene.render()
    this._scene = scene;
    this._engine = engine;
    this._ball = new Ball(new Vector3(this.state.ball.position.x, this.state.ball.position.y, this.state.ball.position.z),
      Vector3.Zero(), 1, scene);

    engine.runRenderLoop(() => {
      this._checkPendingImpacts();
      this._executeStep();
      const racketImpact = this._impactSnapshots.getSnapshotAtTick(this._tick)
      if (racketImpact && racketImpact.snapshot && racketImpact.snapshot.tick === this._tick) {
        this._ball.setPhysicsBodyPosition(racketImpact.snapshot.position.clone());
        this._ball.setVelocity(racketImpact.snapshot.velocity.clone());
      }
      this._checkWallCollision();
      this._checkIfPointWon();
      this._snapshotToSend = {tick: this._tick,position: this._ball.getPhysicsBodyPosition(), velocity: this._ball.getVelocity()};
      this._tick++;
      scene.render();
    });
  }

  private _executeStep() {
    const oldPos = this._ball.getPhysicsBodyPosition();
    const newPos = oldPos.add(this._ball.getVelocity().scale(TIMESTEP));
    this._ball.setPhysicsBodyPosition(newPos);
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

  private _checkPendingImpacts() {
    if (!this._pendingImpact)
      return ;
    const ticksToResimulate = this._tick - this._pendingImpact.tick;
    console.log("tick:", this._tick, "impactTick:", this._pendingImpact.tick, "ticks to resim:", ticksToResimulate);
    if (ticksToResimulate <= 0) {
      this._impactSnapshots.saveSnapshot(this._pendingImpact.tick, this._pendingImpact.position, this._pendingImpact.velocity);
    } else {
      this._ball.setPhysicsBodyPosition(this._pendingImpact.position);
      this._ball.setVelocity(this._pendingImpact.velocity);
      for (let i = 0; i < ticksToResimulate; i++) {
          this._executeStep();
          this._checkWallCollision();
      }
    }
    this._pendingImpact = null;
  }

  private _checkIfPointWon() {
    let ballPos = this._ball.getPhysicsBodyPosition();
      if (ballPos.z < -33) {
        console.log("Team Far won a point");
        this.state.score.teamFar++;
        this._tokens.get(this._far).score++;
        if (this.state.score.teamFar >= 3) {
          this.state.roomStatus = RoomStatus.WON;
          this._tokens.get(this._far).hasWon = true;
          this._timeEnd = Date.now();
        }
      }
      else if (ballPos.z > 50) {
        console.log("Team Near won a point");
        this.state.score.teamNear++;
        this._tokens.get(this._near).score++;
        if (this.state.score.teamNear >= 3) {
          this.state.roomStatus = RoomStatus.WON;
          this._tokens.get(this._near).hasWon = true;
          this._timeEnd = Date.now();
        }
      }
      if (ballPos.z < -33 || ballPos.z > 50) {
        this._ball.setVelocity(Vector3.Zero());
        //this._ball.setAngularVelocity(Vector3.Zero());
        this.state.ball.velocity.x = 0;
        this.state.ball.velocity.y = 0;
        this.state.ball.velocity.z = 0;
        this.state.ball.position.x = 0;
        this.state.ball.position.y = 3;
        if (!this._served) {
          ballPos = new Vector3(0,3,-12);
          this._ball.setPhysicsBodyPosition(ballPos);
          this.state.ball.position.z = -12;
          this._served = true;
        } else {
          ballPos = new Vector3(0,3,34.5);
          this._ball.setPhysicsBodyPosition(ballPos);
          this.state.ball.position.z = 34.5;
          this._served = false;
        }
        
        this.broadcast('Goal!', {tick: this._tick, position: ballPos.asArray()},{ afterNextPatch: true });
      }
  }

  private _isSuspiciousSpeed(oldVel: Vector3, newVel: Vector3) : boolean {
    const isSuspicious = (
        (Math.abs(oldVel.x) > 0.5 && Math.abs(newVel.x) < 0.001) ||
        (Math.abs(oldVel.y) > 0.5 && Math.abs(newVel.y) < 0.001) ||
        (Math.abs(oldVel.z) > 0.5 && Math.abs(newVel.z) < 0.001)
    );
    return isSuspicious;
  }

  onBeforePatch(state: MyRoomState) {
    if (!this._snapshotToSend)
      return ;
    const ballPos = this._snapshotToSend.position;
    const ballVel = this._snapshotToSend.velocity;
    // console.log("tick:", this._tick,  "pos:", ballPos, "vel:", ballVel);
    state.ball.position.x = ballPos.x;
    state.ball.position.y = ballPos.y;
    state.ball.position.z = ballPos.z;

    const stateVel = new Vector3(state.ball.velocity.x,state.ball.velocity.y,state.ball.velocity.z);
    // if (stateVel.subtract(ballVel).lengthSquared() > 0.0001 && !this._isSuspiciousSpeed(stateVel, ballVel)) {
    if (!this._isSuspiciousSpeed(stateVel, ballVel)) {
      state.ball.velocity.x = ballVel.x;
      state.ball.velocity.y = ballVel.y;
      state.ball.velocity.z = ballVel.z;
    }

    state.ball.tickStamp = this._snapshotToSend.tick;
  }

  onCreate (options: any) {
    /**
     * Called when a new room is created.
     */
    this.state.ball.velocity.x = 0;
    this.state.ball.velocity.y = 0;
    this.state.ball.velocity.z = 0;
    console.log("room", this.roomId, "created and starting physics simulation");
    this._startSimulation();
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
      return result;
  }

  onJoin (client: Client, options: any, auth: any) {
    /**
     * Called when a client joins the room.
     */
    console.log(client.sessionId, "joined room", this.roomId);
    this._tokens.set(client.sessionId, {auth: auth.id, score: 0, hasWon: false, hasDisconnected: false});
    const player = new Player();
    player.position.x = 0;
    player.position.y = 1.5;
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
    if (this.state.players.size == 2) {
      if (this._tokens.get(this._near).auth === this._tokens.get(this._far).auth) {
        throw new Error("Same player joined twice!");
      }
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
    this.allowReconnection(client, 5).catch(() => {
      if (this.state.roomStatus === RoomStatus.AWAITING_RECONNECTION) {
        this.state.roomStatus = RoomStatus.PLAYER_DISCONNECTED;
        this._timeEnd = Date.now();
      }
    });
  }

  onReconnect(client: Client) {
    console.log(`Client ${client.sessionId} reconnected!`);
 
    const player = this.state.players.get(client.sessionId);
    if (player && this.state.roomStatus === RoomStatus.AWAITING_RECONNECTION) {
      this.state.roomStatus = RoomStatus.STARTED;
      player.connected = false;
      this._tokens.get(client.sessionId).hasDisconnected = false;
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
    this._engine.stopRenderLoop();
    this.lock();
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

    this._tokens = null;

    this._bodies.forEach(body => {
        if (body.shape) {
            body.shape.dispose();
        }
        body.dispose(); 
    });
    this._bodies = [];

    this._nodes.forEach(node => node.dispose());
    this._nodes = [];

    this._scene.onBeforePhysicsObservable.clear();

    // if (this._havokPlugin) {
    //     this._havokPlugin.dispose();
    //     this._havokPlugin = null;
    // }
    if (this._scene) {
        this._scene.dispose();
        this._scene = null;
    }
    console.log("room", this.roomId, "disposing and ending simulation");
  }
}