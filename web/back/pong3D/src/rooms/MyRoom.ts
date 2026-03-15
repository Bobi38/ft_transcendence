import { Room, Client, CloseCode, AuthContext, room } from "colyseus";
import { MyRoomState, Player, RoomStatus } from "./schema/MyRoomState.js";
import { ArcRotateCamera, HavokPlugin, MeshBuilder, NullEngine, PhysicsBody, PhysicsImpostor, PhysicsMotionType, PhysicsShape, PhysicsShapeBox, PhysicsShapeSphere, Quaternion, Scene, TransformNode, Vector3 } from "@babylonjs/core"
import HavokPhysics from "@babylonjs/havok";
import fs from "fs";
import path from "path";
import { createBall, createWalls } from "../environment.js";
import User from "../models/user.js";
import PongStat from "../models/PongStat.js"
import jwt from "jsonwebtoken"

const secret = fs.readFileSync('/run/secrets/cle_pswd', 'utf-8').trim();

export class MyRoom extends Room {
  private _scene : Scene;
  private _engine: NullEngine;
  private _ball: PhysicsBody;
  private _bodies: PhysicsBody[] = [];
  private _shapes: PhysicsShape[] = [];
  private _nodes: TransformNode[] = [];
  private _havokPlugin: HavokPlugin;
  private _nextPlayerIndex: number = 0;
  private _tokens : Map<string, {auth: string, score: number, hasWon: boolean}> = new Map<string, {auth: string, score: number, hasWon: boolean}>();
  private _near : string;
  private _far: string;
  private _tick: number = 0;
  private _posToSend: Vector3;
  private _velToSend: Vector3;

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
    "synchronizeTick" : (client: Client, data: any) => {
      console.log(MyRoom.count++, "Received tick synchronization request from", client.sessionId);
      client.send("serverTick", {serverTick: this._tick, t0: data});
    },
    "racketImpact": (client: Client, data: any) => {
      const ballPos = new Vector3(data.position[0], data.position[1], data.position[2]);
      const ballVel = new Vector3(data.velocity[0], data.velocity[1], data.velocity[2]);
      this._ball.setLinearVelocity(ballVel);
      //this._ball.transformNode.setAbsolutePosition(ballPos);
      console.log(client.sessionId,  "hit the ball: ", data);
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
    const wasmPath = path.resolve("node_modules/@babylonjs/havok/lib/esm/HavokPhysics.wasm");
    const wasmBuffer = fs.readFileSync(wasmPath);
    const wasmBinary = wasmBuffer.buffer.slice(wasmBuffer.byteOffset,wasmBuffer.byteOffset + wasmBuffer.byteLength);
    const havok = await HavokPhysics({wasmBinary});
    console.log("HavokPhysics loaded from file");
    const havokPlugin = new HavokPlugin(true, havok);
    this._havokPlugin = havokPlugin;
    havokPlugin.setTimeStep(1/60);
    scene.enablePhysics(new Vector3(0, 0, 0), havokPlugin); //no gravity (middle value at 0)
    scene.onAfterPhysicsObservable.add(() => {
      this._tick++;
      this._posToSend = this._ball.transformNode.position.clone();
      this._velToSend = this._ball.getLinearVelocity();
      //console.log(this._tick, Date.now());
    });
    this._scene = scene;
    this._engine = engine;
    this._ball = createBall(new Vector3(this.state.ball.position.x, this.state.ball.position.y, this.state.ball.position.z),
      this._scene, this._bodies, this._shapes, this._nodes);
    createWalls(this._scene, this._bodies, this._shapes, this._nodes);

    this._scene.onAfterPhysicsObservable.add(() => {
      let ballPos = this._ball.transformNode.position;
      if (this._ball.transformNode.position.z < -23) {
        console.log("Team Far won a point");
        this.state.score.teamFar++;
        this._tokens.get(this._far).score++;
        if (this.state.score.teamFar >= 3) {
          this.state.roomStatus = RoomStatus.WON;
          this._tokens.get(this._far).hasWon = true;
        }
      }
      else if (this._ball.transformNode.position.z > 40) {
        console.log("Team Near won a point");
        this.state.score.teamNear++;
        this._tokens.get(this._near).score++;
        if (this.state.score.teamNear >= 3) {
          this.state.roomStatus = RoomStatus.WON;
          this._tokens.get(this._near).hasWon = true;
        }
      }
      if (this._ball.transformNode.position.z < -23 || this._ball.transformNode.position.z > 40) {
                        console.log(this._ball.transformNode.position);
        this._ball.setLinearVelocity(Vector3.Zero());
        this._ball.setAngularVelocity(Vector3.Zero());
        this._ball.transformNode.position.set(0,3,7);
        this.broadcast('Goal!', { afterNextPatch: true });
        //this._ball.setTargetTransform(new Vector3(0,3,7), Quaternion.Identity());
         //       console.log(this._ball.transformNode.position);
      }
    });

    engine.runRenderLoop(() => {
      scene.render();
    });
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
    const ballPos = this._posToSend;
    const ballVel = this._velToSend;
    //console.log(ballPos);
    //console.log(ballVel);
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

    state.ball.tickStamp = this._tick;
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
    this._tokens.set(client.sessionId, {auth: auth, score: 0, hasWon: false});
    const player = new Player();
    player.position.x = 0;
    player.position.y = 1.5;
    if (this._nextPlayerIndex % 2 == 0) {
      player.position.z = 0;
      this._near = client.sessionId;
    }
    else {
      player.position.z = 20;
      player.sideNear = false;
      this._far = client.sessionId;
    }
    this.state.players.set(client.sessionId, player);
    this._nextPlayerIndex++;
    if (this.state.players.size == 2) {
      console.log("Game starting");
      this.state.roomStatus = RoomStatus.STARTED;
    }
  }

  onDrop(client: Client, code: number) {
    console.log(`Client ${client.sessionId} dropped (code: ${code})`);
    const player = this.state.players.get(client.sessionId);
    if (player) {
      player.connected = false;
    }
    this.allowReconnection(client, 5).catch(() => {
      this.state.roomStatus = RoomStatus.PLAYER_DISCONNECTED;
    });
  }

  onReconnect(client: Client) {
    console.log(`Client ${client.sessionId} reconnected!`);
 
    const player = this.state.players.get(client.sessionId);
    if (player) {
      player.connected = true;
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
    this.lock();
    this.state.players.delete(client.sessionId);
  }

  async _sendGameDataToDatabase() {
    const iterator = this._tokens.entries();
      const firstPlayer = iterator.next().value;
      const secondPlayer = iterator.next().value;
      const player1id = firstPlayer[1].auth;
      const player2id = secondPlayer[1].auth;
      const score1 = firstPlayer[1].score;
      const score2 = secondPlayer[1].score;
      let whowin, wholose;
      if (firstPlayer[1].hasWon) {whowin = player1id; wholose = player2id;} else {whowin = player2id; wholose = player1id;}
      try {
      await PongStat.create({Player1id: player1id, Player2id: player2id, whowin: whowin, wholose: wholose, score1: score1, score2: score2});
      } catch (e) {
        console.log("Failed to store results in database", e);
      }
  }

  onDispose() {
    /**
     * Called when the room is disposed.
     */
    console.log(this.state.roomStatus);
    if (this.state.roomStatus != RoomStatus.WAITING && this.state.roomStatus != RoomStatus.PLAYER_DISCONNECTED)
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

    if (this._havokPlugin) {
        this._havokPlugin.dispose();
        this._havokPlugin = null;
    }
    if (this._scene) {
        this._scene.dispose();
        this._scene = null;
    }
    console.log("room", this.roomId, "disposing and ending simulation");
  }
}