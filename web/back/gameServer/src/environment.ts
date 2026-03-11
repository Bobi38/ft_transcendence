import { PhysicsBody, PhysicsMotionType, PhysicsShape, PhysicsShapeBox, PhysicsShapeSphere, Quaternion, Scene, TransformNode, Vector3 } from "@babylonjs/core";
import { Env } from "../../../media/media.js"

function ToVec3(input: any) : Vector3 {
    const ret = new Vector3(input.x, input.y, input.z);
    return ret;
}

function ToQuat(input: any) : Quaternion {
    const ret = Quaternion.FromEulerAngles(input.x, input.y, input.z);
    return ret;
}

  export function createBall(ballPos: Vector3, scene: Scene, bodies: PhysicsBody[], shapes: PhysicsShape[], nodes: TransformNode[]) : PhysicsBody {
    //const ballPos = new Vector3(this.state.ball.position.x, this.state.ball.position.y, this.state.ball.position.z);
    const ballNode = new TransformNode("ballNode", scene);
    ballNode.position = ballPos;
    const ballShape = new PhysicsShapeSphere(Vector3.Zero(), 0.5, scene);
    const ball = new PhysicsBody(ballNode, PhysicsMotionType.DYNAMIC, false, scene);
    ball.shape = ballShape;
    const material = {friction: 0, restitution: 1};
    ballShape.material = material;
    ball.setMassProperties({mass: 1});
    ball.setLinearDamping(0);
    ball.setAngularDamping(0);
    ball.disablePreStep = false;
    nodes.push(ballNode);
    shapes.push(ballShape);
    bodies.push(ball);
    return ball;
  }

  export function createWalls(scene: Scene, bodies: PhysicsBody[], shapes: PhysicsShape[], nodes: TransformNode[]) {
    const env = JSON.parse(Env);
    let wallRightShape = new PhysicsShapeBox(Vector3.Zero(), Quaternion.Identity(), ToVec3(env.wallDimensions), scene);
    let wallLeftShape = new PhysicsShapeBox(Vector3.Zero(), Quaternion.Identity(), ToVec3(env.wallDimensions), scene);
    let groundShape = new PhysicsShapeBox(Vector3.Zero(), Quaternion.Identity(), ToVec3(env.groundDimensions), scene);
    let elevanShape = new PhysicsShapeBox(Vector3.Zero(), Quaternion.Identity(), ToVec3(env.groundDimensions), scene);
    let ceilingShape = new PhysicsShapeBox(Vector3.Zero(), Quaternion.Identity(), ToVec3(env.groundDimensions), scene);
    let wallRightNode = new TransformNode("wallRightNode", scene);
    let wallLeftNode = new TransformNode("wallLeftNode", scene);
    let groundNode = new TransformNode("groundNode", scene);
    let ceilingNode = new TransformNode("ceilingNode", scene);
    let elevanNode = new TransformNode("elevanNode", scene);
    wallRightNode.position = ToVec3(env.wallRightPos);
    wallLeftNode.position = ToVec3(env.wallLeftPos);
    ceilingNode.position = ToVec3(env.ceilingPos);
    elevanNode.position = ToVec3(env.elevanPos);
    wallRightNode.rotationQuaternion = ToQuat(env.wallQuaternion);
    wallLeftNode.rotationQuaternion = ToQuat(env.wallQuaternion);
    elevanNode.rotationQuaternion = ToQuat(env.elevanQuaternion);
    let wallRight = new PhysicsBody(wallRightNode, PhysicsMotionType.STATIC, false, scene);
    let wallLeft = new PhysicsBody(wallLeftNode, PhysicsMotionType.STATIC, false, scene);
    let ground = new PhysicsBody(groundNode, PhysicsMotionType.STATIC, false, scene);
    let ceiling = new PhysicsBody(ceilingNode, PhysicsMotionType.STATIC, false, scene);
    let elevan = new PhysicsBody(elevanNode, PhysicsMotionType.STATIC, false, scene);
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
    bodies.push(wallLeft);
    bodies.push(wallRight);
    bodies.push(ground);
    bodies.push(ceiling);
    bodies.push(elevan);
    shapes.push(wallRightShape);
    shapes.push(wallLeftShape);
    shapes.push(groundShape);
    shapes.push(ceilingShape);
    shapes.push(elevanShape);
    nodes.push(wallRightNode);
    nodes.push(wallLeftNode);
    nodes.push(groundNode);
    nodes.push(ceilingNode);
    nodes.push(elevanNode);
  }
