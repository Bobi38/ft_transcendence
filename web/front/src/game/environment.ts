import { Color3, Material, MeshBuilder, PhysicsAggregate, PhysicsMotionType, PhysicsShapeType, Quaternion, Scene, StandardMaterial, Vector3 } from "@babylonjs/core";

export class Environment {
    private _scene: Scene;

    constructor(scene: Scene) {
        this._scene = scene;
    }

    public async load() {
        let ground = MeshBuilder.CreateBox("ground", {size: 24}, this._scene);
        let ceiling = MeshBuilder.CreateBox("ceiling", {size: 24}, this._scene);
        let wall_left = MeshBuilder.CreateBox("wall_left", {size: 24}, this._scene);
        let wall_right = MeshBuilder.CreateBox("wall_right", {size: 24}, this._scene);
        let scaling = new Vector3(1, .02, 3);
        ground.scaling = scaling;
        ground.receiveShadows = true;
        ceiling.scaling = scaling;
        ceiling.receiveShadows = true;
        wall_left.scaling = new Vector3(0.57, 0.02, 3);
        wall_right.scaling = new Vector3(0.57, 0.02, 3);
        ceiling.position = new Vector3(0,10,0);
        let rotationQuaternion = Quaternion.FromEulerAngles(0,0,Math.PI / 2);
        wall_left.rotationQuaternion = rotationQuaternion;
        wall_left.position = new Vector3(-10,5,0);
        wall_left.receiveShadows = true;
        wall_right.rotationQuaternion = rotationQuaternion;
        wall_right.receiveShadows = true;
        wall_right.position = new Vector3(10,5,0);
        let wall_mat = new StandardMaterial("wallmat", this._scene);
        wall_mat.diffuseColor = new Color3(1,1,1);
        wall_mat.roughness = 0.1;
        //wall_mat.reflectionFresnelParameters;
        wall_left.material = wall_mat;
        wall_right.material = wall_mat;

        let elevanWall = MeshBuilder.CreateBox("wall_elevan", {size: 24}, this._scene);
        elevanWall.scaling = scaling;
        elevanWall.receiveShadows = true;
        elevanWall.material = wall_mat;
        elevanWall.position = new Vector3(0,0,30);
        elevanWall.rotationQuaternion = Quaternion.FromEulerAngles(Math.PI / 2, 0, 0);

        const wall_leftAggregate = new PhysicsAggregate(wall_left, PhysicsShapeType.BOX, {mass:0, restitution:1, friction: 0}, this._scene);
        const wall_rightAggregate = new PhysicsAggregate(wall_right, PhysicsShapeType.BOX, {mass:0, restitution:1, friction: 0}, this._scene);
        const groundAggregate = new PhysicsAggregate(ground, PhysicsShapeType.BOX, {mass:0, restitution:1, friction: 0}, this._scene);
        const ceilingAggregate = new PhysicsAggregate(ceiling, PhysicsShapeType.BOX, {mass:0, restitution:1, friction: 0}, this._scene);
        wall_leftAggregate.body.setMotionType(PhysicsMotionType.STATIC);
        wall_rightAggregate.body.setMotionType(PhysicsMotionType.STATIC);
        groundAggregate.body.setMotionType(PhysicsMotionType.STATIC);
        ceilingAggregate.body.setMotionType(PhysicsMotionType.STATIC);

        const elevanWallAggregate = new PhysicsAggregate(elevanWall, PhysicsShapeType.BOX, {mass:0, restitution:1, friction:0}, this._scene);
        wall_leftAggregate.body.setMotionType(PhysicsMotionType.STATIC);
        
    }
}