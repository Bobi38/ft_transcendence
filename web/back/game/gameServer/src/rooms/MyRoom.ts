import { Room, Client, CloseCode } from "colyseus";
import { MyRoomState } from "./schema/MyRoomState.js";
import { ArcRotateCamera, HavokPlugin, MeshBuilder, NullEngine, PhysicsBody, PhysicsMotionType, PhysicsShape, PhysicsShapeBox, PhysicsShapeSphere, Quaternion, Scene, TransformNode, Vector3 } from "@babylonjs/core"
import HavokPhysics from "@babylonjs/havok";
import { Env } from "../../../../../media/media.js"
import fs from "fs";
import path from "path";

function ToVec3(input: any) : Vector3 {
    const ret = new Vector3(input.x, input.y, input.z);
    return ret;
}

function ToQuat(input: any) : Quaternion {
    const ret = Quaternion.FromEulerAngles(input.x, input.y, input.z);
    return ret;
}

export class MyRoom extends Room {
  private _scene : Scene;
  private _engine: NullEngine;
  private _ball: PhysicsBody;
  private _bodies: PhysicsBody[] = [];
  private _shapes: PhysicsShape[] = [];
  private _nodes: TransformNode[] = [];
  private _havokPlugin: HavokPlugin;

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
      this._ball.transformNode.setAbsolutePosition(ballPos);
      console.log(client.sessionId,  "hit the ball: ", data);
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
    this._ball = this._createBall();
    this._createWalls();

    scene.onBeforePhysicsObservable.add(() => {
      //console.log(this._ball.transformNode.position._z);
      //console.log(this._ball.getLinearVelocity());
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
  }

  onLeave (client: Client, code: CloseCode) {
    /**
     * Called when a client leaves the room.//manually stepping
    setInterval(() => {
      console.log(this._ballNode.position);
      console.log(ball.getLinearVelocity());
      havokPlugin.executeStep(deltaTime, this._bodies);
    }, deltaTime * 1000);
     */
    console.log(client.sessionId, "left room", this.roomId, "with code", code);
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

  private _createBall() : PhysicsBody {
    const ballPos = new Vector3(this.state.ball.position.x, this.state.ball.position.y, this.state.ball.position.z);
    const ballNode = new TransformNode("ballNode", this._scene);
    ballNode.position = ballPos;
    const ballShape = new PhysicsShapeSphere(Vector3.Zero(), 0.5, this._scene);
    const ball = new PhysicsBody(ballNode, PhysicsMotionType.DYNAMIC, false, this._scene);
    ball.shape = ballShape;
    const material = {friction: 0, restitution: 1};
    ballShape.material = material;
    ball.setMassProperties({mass: 1});
    ball.setLinearDamping(0);
    ball.setAngularDamping(0);
    this._bodies.push(ball);
    return ball;
  }

  private _createWalls() {
    const env = JSON.parse(Env);
    let wallRightShape = new PhysicsShapeBox(Vector3.Zero(), Quaternion.Identity(), ToVec3(env.wallDimensions), this._scene);
    let wallLeftShape = new PhysicsShapeBox(Vector3.Zero(), Quaternion.Identity(), ToVec3(env.wallDimensions), this._scene);
    let groundShape = new PhysicsShapeBox(Vector3.Zero(), Quaternion.Identity(), ToVec3(env.groundDimensions), this._scene);
    let elevanShape = new PhysicsShapeBox(Vector3.Zero(), Quaternion.Identity(), ToVec3(env.groundDimensions), this._scene);
    let ceilingShape = new PhysicsShapeBox(Vector3.Zero(), Quaternion.Identity(), ToVec3(env.groundDimensions), this._scene);
    let wallRightNode = new TransformNode("wallRightNode", this._scene);
    let wallLeftNode = new TransformNode("wallLeftNode", this._scene);
    let groundNode = new TransformNode("groundNode", this._scene);
    let ceilingNode = new TransformNode("ceilingNode", this._scene);
    let elevanNode = new TransformNode("elevanNode", this._scene);
    wallRightNode.position = ToVec3(env.wallRightPos);
    wallLeftNode.position = ToVec3(env.wallLeftPos);
    ceilingNode.position = ToVec3(env.ceilingPos);
    elevanNode.position = ToVec3(env.elevanPos);
    wallRightNode.rotationQuaternion = ToQuat(env.wallQuaternion);
    wallLeftNode.rotationQuaternion = ToQuat(env.wallQuaternion);
    elevanNode.rotationQuaternion = ToQuat(env.elevanQuaternion);
    let wallRight = new PhysicsBody(wallRightNode, PhysicsMotionType.STATIC, false, this._scene);
    let wallLeft = new PhysicsBody(wallLeftNode, PhysicsMotionType.STATIC, false, this._scene);
    let ground = new PhysicsBody(groundNode, PhysicsMotionType.STATIC, false, this._scene);
    let ceiling = new PhysicsBody(ceilingNode, PhysicsMotionType.STATIC, false, this._scene);
    let elevan = new PhysicsBody(elevanNode, PhysicsMotionType.STATIC, false, this._scene);
    wallRight.shape = wallRightShape;
    wallLeft.shape = wallLeftShape;
    ground.shape = groundShape;
    ceiling.shape = ceilingShape;
    elevan.shape = elevanShape;
    const wallmaterial = {friction: 0, restitution: 1};
    wallRightShape.material = wallmaterial;
    wallLeftShape.material = wallmaterial;
    groundShape.material = wallmaterial;
    ceilingShape.material = wallmaterial;
    elevanShape.material = wallmaterial;
    wallRight.setMassProperties({mass: 1});
    wallLeft.setMassProperties({mass: 1});
    ground.setMassProperties({mass: 1});
    ceiling.setMassProperties({mass: 1});
    elevan.setMassProperties({mass: 1});
    wallRight.setLinearDamping(0);
    wallLeft.setLinearDamping(0);
    ground.setLinearDamping(0);
    ceiling.setLinearDamping(0);
    elevan.setLinearDamping(0);
    wallRight.setAngularDamping(0);
    wallLeft.setAngularDamping(0);
    ground.setAngularDamping(0);
    ceiling.setAngularDamping(0);
    elevan.setAngularDamping(0);
    this._bodies.push(wallLeft);
    this._bodies.push(wallRight);
    this._bodies.push(ground);
    this._bodies.push(ceiling);
    this._bodies.push(elevan);
    this._shapes.push(wallRightShape);
    this._shapes.push(wallLeftShape);
    this._shapes.push(groundShape);
    this._shapes.push(ceilingShape);
    this._shapes.push(elevanShape);
    this._nodes.push(wallRightNode);
    this._nodes.push(wallLeftNode);
    this._nodes.push(groundNode);
    this._nodes.push(ceilingNode);
    this._nodes.push(elevanNode);
  }

}
