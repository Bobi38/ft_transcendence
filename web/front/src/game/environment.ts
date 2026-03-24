import { Color3, MeshBuilder, PhysicsAggregate, PhysicsBody, PhysicsMotionType, PhysicsShapeBox, PhysicsShapeType, Quaternion, Scene, StandardMaterial, TransformNode, Vector3 } from "@babylonjs/core";
import { Env } from "/app/media/media.js";


function ToVec3(input) : Vector3 {
    const ret = new Vector3(input.x, input.y, input.z);
    return ret;
}

function ToQuat(input) : Quaternion {
    const ret = Quaternion.FromEulerAngles(input.x, input.y, input.z);
    return ret;
}

export class Environment {
    private _scene: Scene;
    public bodies: PhysicsBody[] = [];

    constructor(scene: Scene) {
        this._scene = scene;
    }

    public async load() {
        const env = JSON.parse(Env);
        let wallRightShape = new PhysicsShapeBox(Vector3.Zero(), Quaternion.Identity(), ToVec3(env.wallDimensions), this._scene);
        let wallLeftShape = new PhysicsShapeBox(Vector3.Zero(), Quaternion.Identity(), ToVec3(env.wallDimensions), this._scene);
        let groundShape = new PhysicsShapeBox(Vector3.Zero(), Quaternion.Identity(), ToVec3(env.groundDimensions), this._scene);
        // let elevanShape = new PhysicsShapeBox(Vector3.Zero(), Quaternion.Identity(), ToVec3(env.groundDimensions), this._scene);
        let ceilingShape = new PhysicsShapeBox(Vector3.Zero(), Quaternion.Identity(), ToVec3(env.groundDimensions), this._scene);
        let wallRightNode = new TransformNode("wallRightNode", this._scene);
        let wallLeftNode = new TransformNode("wallLeftNode", this._scene);
        let groundNode = new TransformNode("groundNode", this._scene);
        let ceilingNode = new TransformNode("ceilingNode", this._scene);
        // let elevanNode = new TransformNode("elevanNode", this._scene);
        wallRightNode.position = ToVec3(env.wallRightPos);
        wallLeftNode.position = ToVec3(env.wallLeftPos);
        ceilingNode.position = ToVec3(env.ceilingPos);
        // elevanNode.position = ToVec3(env.elevanPos);
        wallRightNode.rotationQuaternion = ToQuat(env.wallQuaternion);
        wallLeftNode.rotationQuaternion = ToQuat(env.wallQuaternion);
        // elevanNode.rotationQuaternion = ToQuat(env.elevanQuaternion);
        let wallRightBody = new PhysicsBody(wallRightNode, PhysicsMotionType.STATIC, false, this._scene);
        let wallLeftBody = new PhysicsBody(wallLeftNode, PhysicsMotionType.STATIC, false, this._scene);
        let groundBody = new PhysicsBody(groundNode, PhysicsMotionType.STATIC, false, this._scene);
        let ceilingBody = new PhysicsBody(ceilingNode, PhysicsMotionType.STATIC, false, this._scene);
        // let elevan = new PhysicsBody(elevanNode, PhysicsMotionType.STATIC, false, this._scene);
        wallRightBody.shape = wallRightShape;
        wallLeftBody.shape = wallLeftShape;
        groundBody.shape = groundShape;
        ceilingBody.shape = ceilingShape;
        // // elevan.shape = elevanShape;
        const wallmaterial = {friction: 0, restitution: 1};
        wallRightShape.material = wallmaterial;
        wallLeftShape.material = wallmaterial;
        groundShape.material = wallmaterial;
        ceilingShape.material = wallmaterial;
        // elevanShape.material = wallmaterial;
        wallRightBody.setMassProperties({mass: 1});
        wallLeftBody.setMassProperties({mass: 1});
        groundBody.setMassProperties({mass: 1});
        ceilingBody.setMassProperties({mass: 1});
        // elevan.setMassProperties({mass: 1});
        wallRightBody.setLinearDamping(0);
        wallLeftBody.setLinearDamping(0);
        groundBody.setLinearDamping(0);
        ceilingBody.setLinearDamping(0);
        // elevan.setLinearDamping(0);
        wallRightBody.setAngularDamping(0);
        wallLeftBody.setAngularDamping(0);
        groundBody.setAngularDamping(0);
        ceilingBody.setAngularDamping(0);
        // elevan.setAngularDamping(0);
        this.bodies.push(wallLeftBody);
        this.bodies.push(wallRightBody);
        this.bodies.push(groundBody);
        this.bodies.push(ceilingBody);
        // this.bodies.push(elevan);
        
        let ground = MeshBuilder.CreateBox("ground", {size: 1}, this._scene);
        let ceiling = MeshBuilder.CreateBox("ceiling", {size: 1}, this._scene);
        let wall_left = MeshBuilder.CreateBox("wall_left", {size: 1}, this._scene);
        let wall_right = MeshBuilder.CreateBox("wall_right", {size: 1}, this._scene);

        wall_right.checkCollisions = true;
        wall_left.checkCollisions = true;

        ground.scaling = ToVec3(env.groundDimensions);
        ceiling.scaling = ToVec3(env.groundDimensions);
        wall_left.scaling = ToVec3(env.wallDimensions);
        wall_right.scaling = ToVec3(env.wallDimensions);

        ground.receiveShadows = true;
        ceiling.receiveShadows = true;
        wall_left.receiveShadows = true;
        wall_right.receiveShadows = true;

        ceiling.position = ToVec3(env.ceilingPos);
        wall_left.position = ToVec3(env.wallLeftPos);
        wall_right.position = ToVec3(env.wallRightPos);
    
        let rotationQuaternion = ToQuat(env.wallQuaternion);
        wall_left.rotationQuaternion = rotationQuaternion;
        wall_right.rotationQuaternion = rotationQuaternion;

        let wall_mat = new StandardMaterial("wallmat", this._scene);
        wall_mat.diffuseColor = new Color3(1,1,1);
        wall_mat.roughness = 0.1;
        wall_left.material = wall_mat;
        wall_right.material = wall_mat;
        ground.material = wall_mat;
        ceiling.material = wall_mat;

        // let elevanWall = MeshBuilder.CreateBox("wall_elevan", {size: 1}, this._scene);
        // elevanWall.scaling = ToVec3(env.groundDimensions);
        // elevanWall.receiveShadows = true;
        // elevanWall.material = wall_mat;
        // elevanWall.position = ToVec3(env.elevanPos);
        // elevanWall.rotationQuaternion = ToQuat(env.elevanQuaternion);

        // const wall_leftAggregate = new PhysicsAggregate(wall_left, PhysicsShapeType.BOX, {mass:0, restitution:1, friction: 0}, this._scene);
        // const wall_rightAggregate = new PhysicsAggregate(wall_right, PhysicsShapeType.BOX, {mass:0, restitution:1, friction: 0}, this._scene);
        // const groundAggregate = new PhysicsAggregate(ground, PhysicsShapeType.BOX, {mass:0, restitution:1, friction: 0}, this._scene);
        // const ceilingAggregate = new PhysicsAggregate(ceiling, PhysicsShapeType.BOX, {mass:0, restitution:1, friction: 0}, this._scene);
        // wall_leftAggregate.body.setMotionType(PhysicsMotionType.STATIC);
        // wall_rightAggregate.body.setMotionType(PhysicsMotionType.STATIC);
        // groundAggregate.body.setMotionType(PhysicsMotionType.STATIC);
        // ceilingAggregate.body.setMotionType(PhysicsMotionType.STATIC);

        // const elevanWallAggregate = new PhysicsAggregate(elevanWall, PhysicsShapeType.BOX, {mass:0, restitution:1, friction:0}, this._scene);
        // elevanWallAggregate.body.setMotionType(PhysicsMotionType.STATIC);
        
    }
}