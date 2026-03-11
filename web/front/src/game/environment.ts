import { Color3, MeshBuilder, PhysicsAggregate, PhysicsBody, PhysicsMotionType, PhysicsShapeBox, PhysicsShapeType, PhysicsViewer, Quaternion, Scene, StandardMaterial, TransformNode, Vector3 } from "@babylonjs/core";
import { Env } from "../../../media/media.js"


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

    constructor(scene: Scene) {
        this._scene = scene;
    }

    public async load() {
        const env = JSON.parse(Env);
        let ground = MeshBuilder.CreateBox("ground", {size: 1}, this._scene);
        let ceiling = MeshBuilder.CreateBox("ceiling", {size: 1}, this._scene);
        let wall_left = MeshBuilder.CreateBox("wall_left", {size: 1}, this._scene);
        let wall_right = MeshBuilder.CreateBox("wall_right", {size: 1}, this._scene);

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

        const wall_leftAggregate = new PhysicsAggregate(wall_left, PhysicsShapeType.BOX, {mass:0, restitution:1, friction: 0}, this._scene);
        const wall_rightAggregate = new PhysicsAggregate(wall_right, PhysicsShapeType.BOX, {mass:0, restitution:1, friction: 0}, this._scene);
        const groundAggregate = new PhysicsAggregate(ground, PhysicsShapeType.BOX, {mass:0, restitution:1, friction: 0}, this._scene);
        const ceilingAggregate = new PhysicsAggregate(ceiling, PhysicsShapeType.BOX, {mass:0, restitution:1, friction: 0}, this._scene);
        wall_leftAggregate.body.setMotionType(PhysicsMotionType.STATIC);
        wall_rightAggregate.body.setMotionType(PhysicsMotionType.STATIC);
        groundAggregate.body.setMotionType(PhysicsMotionType.STATIC);
        ceilingAggregate.body.setMotionType(PhysicsMotionType.STATIC);

        // const elevanWallAggregate = new PhysicsAggregate(elevanWall, PhysicsShapeType.BOX, {mass:0, restitution:1, friction:0}, this._scene);
        // elevanWallAggregate.body.setMotionType(PhysicsMotionType.STATIC);
        
    }
}