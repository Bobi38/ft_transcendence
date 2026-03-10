import { Room, Client, CloseCode } from "colyseus";
import { MyRoomState, Player } from "./schema/MyRoomState.js";
import { ArcRotateCamera, HavokPlugin, MeshBuilder, NullEngine, PhysicsBody, PhysicsImpostor, PhysicsMotionType, PhysicsShape, PhysicsShapeBox, PhysicsShapeSphere, Quaternion, Scene, TransformNode, Vector3 } from "@babylonjs/core"
import HavokPhysics from "@babylonjs/havok";
import fs from "fs";
import path from "path";
import { createBall, createWalls } from "../environment.js";


export class MyRoom extends Room {
  private _scene : Scene;
  private _engine: NullEngine;
  private _ball: PhysicsBody;
  private _bodies: PhysicsBody[] = [];
  private _shapes: PhysicsShape[] = [];
  private _nodes: TransformNode[] = [];
  private _havokPlugin: HavokPlugin;
  private _nextPlayerIndex: number = 0;

  maxClients = 2;
  patchRate = 50;
  state = new MyRoomState();

  messages = {
    yourMessageType: (client: Client, message: any) => {
      /**
       * Handle "yourMessageType" message.
       */
      console.log(client.sessionId, "sent a message:", message);
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
    const deltaTime = 1 / 60;
    havokPlugin.setTimeStep(deltaTime);
    scene.enablePhysics(new Vector3(0, 0, 0), havokPlugin); //no gravity (middle value at 0)
    this._scene = scene;
    this._engine = engine;
    this._ball = createBall(new Vector3(this.state.ball.position.x, this.state.ball.position.y, this.state.ball.position.z),
      this._scene, this._bodies, this._shapes, this._nodes);
    createWalls(this._scene, this._bodies, this._shapes, this._nodes);

    this._scene.onAfterPhysicsObservable.add(() => {
      let ballPos = this._ball.transformNode.position;
      if (this._ball.transformNode.position.z < -23) {
        console.log("Team Far won a point");
        console.log(this._ball.transformNode.position);
        this.state.score.teamFar++;
        if (this.state.score.teamFar >= 3)
          this.state.won = true;
      }
      else if (this._ball.transformNode.position.z > 40) {
        console.log("Team Near won a point");
        console.log(this._ball.transformNode.position);
        this.state.score.teamNear++;
        if (this.state.score.teamNear >= 3)
          this.state.won = true;
      }
      if (this._ball.transformNode.position.z < -23 || this._ball.transformNode.position.z > 40) {
                        console.log(this._ball.transformNode.position);
        this._ball.setLinearVelocity(Vector3.Zero());
        this._ball.setAngularVelocity(Vector3.Zero());
        this._ball.transformNode.position.set(0,3,7);
        //this._ball.setTargetTransform(new Vector3(0,3,7), Quaternion.Identity());
         //       console.log(this._ball.transformNode.position);
      }
    });

    engine.runRenderLoop(() => {
      scene.render();
    });
  }

  onBeforePatch(state: MyRoomState) {
    const ballPos = this._ball.transformNode.position.clone();
    const ballVel = this._ball.getLinearVelocity();
    //console.log(ballPos);
    //console.log(ballVel);
    state.ball.position.x = ballPos.x;
    state.ball.position.y = ballPos.y;
    state.ball.position.z = ballPos.z;

    state.ball.velocity.x = ballVel.x;
    state.ball.velocity.y = ballVel.y;
    state.ball.velocity.z = ballVel.z;
  }

  onCreate (options: any) {
    /**
     * Called when a new room is created.
     */
    //START PHYSICS SIMULATION
    console.log("room", this.roomId, "created and starting physics simulation");
    this._startSimulation();
  }

  onJoin (client: Client, options: any) {
    /**
     * Called when a client joins the room.
     */
    console.log(client.sessionId, "joined room", this.roomId);
    const player = new Player();
    player.position.x = 0;
    player.position.y = 1.5;
    if (this._nextPlayerIndex % 2 == 0)
      player.position.z = 0;
    else {
      player.position.z = 20;
      player.sideNear = false;
    }
    this.state.players.set(client.sessionId, player);
    this._nextPlayerIndex++;
    if (this.state.players.size == 2) {
      console.log("Game starting");
      this.state.started = true;
    }
  }

  onLeave (client: Client, code: CloseCode) {
    /**
     * Called when a client leaves the room.
     */
    console.log(client.sessionId, "left room", this.roomId, "with code", code);
    this.state.players.delete(client.sessionId);
  }

  onDispose() {
    /**
     * Called when the room is disposed.
     */
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
