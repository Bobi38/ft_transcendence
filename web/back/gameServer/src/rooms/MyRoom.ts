import { Room, Client, CloseCode } from "colyseus";
import { MyRoomState } from "./schema/MyRoomState.js";
import { Engine, HavokPlugin, MeshBuilder, PhysicsBody, PhysicsMotionType, PhysicsShape, PhysicsShapeBox, PhysicsShapeSphere, Quaternion, Scene, TransformNode, Vector3 } from "@babylonjs/core"
import HavokPhysics from "@babylonjs/havok";
import { Env } from "../../../../media/media.js"

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
  private _engine: Engine;

  maxClients = 4;
  state = new MyRoomState();

  messages = {
    yourMessageType: (client: Client, message: any) => {
      /**
       * Handle "yourMessageType" message.
       */
      console.log(client.sessionId, "sent a message:", message);
    }
  }

  private _createBall() : PhysicsBody {
    const ballPos = new Vector3(this.state.ball.position.x, this.state.ball.position.y, this.state.ball.position.z);
    const ballNode = new TransformNode("ballNode", this._scene);
    ballNode.position = ballPos;
    const ballShape = new PhysicsShapeSphere(Vector3.Zero(), 1, this._scene);
    const ball = new PhysicsBody(ballNode, PhysicsMotionType.DYNAMIC, false, this._scene);
    ball.shape = ballShape;
    return ball;
  }

  private _createWalls() {
    const env = JSON.parse(Env);
    let wallRightShape = new PhysicsShapeBox(Vector3.Zero(), Quaternion.Zero(), ToVec3(env.wallDimensions), this._scene);
    let wallLeftShape = new PhysicsShapeBox(Vector3.Zero(), Quaternion.Zero(), ToVec3(env.wallDimensions), this._scene);
    let groundShape = new PhysicsShapeBox(Vector3.Zero(), Quaternion.Zero(), ToVec3(env.groundDimensions), this._scene);
    let elevanShape = new PhysicsShapeBox(Vector3.Zero(), Quaternion.Zero(), ToVec3(env.groundDimensions), this._scene);
    let ceilingShape = new PhysicsShapeBox(Vector3.Zero(), Quaternion.Zero(), ToVec3(env.groundDimensions), this._scene);
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
  }

  private async _startSimulation() {
    const engine = new Engine(null, true);
    const scene = new Scene(engine);
    const havokInstance = await HavokPhysics({
            locateFile: (file) => `/node_modules/@babylonjs/havok/lib/esm/${file}`
        });
    const havokPlugin = new HavokPlugin(true, havokInstance);
    scene.enablePhysics(new Vector3(0, 0, 0), havokPlugin); //no gravity (middle value at 0)
    this._scene = scene;
    this._engine = engine;
    const ball : PhysicsBody = this._createBall();
    this._createWalls;
}

  onCreate (options: any) {
    /**
     * Called when a new room is created.
     */
    //START PHYSICS SIMULATION
    this._startSimulation();
  }

  onJoin (client: Client, options: any) {
    /**
     * Called when a client joins the room.
     */
    console.log(client.sessionId, "joined!");
  }

  onLeave (client: Client, code: CloseCode) {
    /**
     * Called when a client leaves the room.
     */
    console.log(client.sessionId, "left!", code);
  }

  onDispose() {
    /**
     * Called when the room is disposed.
     */
    console.log("room", this.roomId, "disposing...");
  }

}
