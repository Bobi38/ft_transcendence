import { Color3, Material, MeshBuilder, PhysicsAggregate, PhysicsMotionType, PhysicsShapeType, Scene, StandardMaterial, Vector3 } from "@babylonjs/core";

export class Environment {
    private _scene: Scene;

    constructor(scene: Scene) {
        this._scene = scene;
    }

    public async load() {
        var ground = MeshBuilder.CreateBox("ground", {size: 24}, this._scene);
        var ceiling = MeshBuilder.CreateBox("ceiling", {size: 24}, this._scene);
        var wall_left = MeshBuilder.CreateBox("wall_left", {size: 24}, this._scene);
        var wall_right = MeshBuilder.CreateBox("wall_right", {size: 24}, this._scene);
        let scaling = new Vector3(1, .02, 3);
        ground.scaling = scaling;
        ground.receiveShadows = true;
        ceiling.scaling = scaling;
        wall_left.scaling = new Vector3(0.57, 0.02, 3);
        wall_right.scaling = new Vector3(0.57, 0.02, 3);
        ceiling.position = new Vector3(0,10,0);
        let rotation = new Vector3(0,0,Math.PI / 2);
        wall_left.rotation = rotation;
        wall_left.position = new Vector3(-10,5,0);
        wall_left.receiveShadows = true;
        wall_right.rotation = rotation;
        wall_right.receiveShadows = true;
        wall_right.position = new Vector3(10,5,0);
        var wall_mat = new StandardMaterial("wallmat", this._scene);
        wall_mat.diffuseColor = new Color3(1,1,1);
        wall_mat.roughness = 0.1;
        //wall_mat.reflectionFresnelParameters;
        wall_left.material = wall_mat;
        wall_right.material = wall_mat;

        const ball = MeshBuilder.CreateSphere("ball", {diameter: 1}, this._scene);
        ball.position = new Vector3(0,3,5);
        const ballAggregate = new PhysicsAggregate(ball,
            PhysicsShapeType.SPHERE,
            {mass: 1, restitution: 0.8, friction: 0.1},
            this._scene);
        ballAggregate.body.setMotionType(PhysicsMotionType.DYNAMIC);
    }
}