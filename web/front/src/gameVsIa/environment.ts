import { Color3, MeshBuilder, PhysicsAggregate, PhysicsBody, PhysicsMotionType, PhysicsShapeBox, PhysicsShapeType, Quaternion, Scene, StandardMaterial, Texture, TransformNode, Vector3 } from "@babylonjs/core";
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
    public wallMin: Vector3;
    public wallMax: Vector3;

    constructor(scene: Scene) {
        this._scene = scene;
    }

    public async load() {
        const env = JSON.parse(Env);
        const groundDim = ToVec3(env.groundDimensions);
        const wallDim = ToVec3(env.wallDimensions);
        const wallRightPos = ToVec3(env.wallRightPos);
        const wallLeftPos = ToVec3(env.wallLeftPos);
        const ceilingPos = ToVec3(env.ceilingPos);
        this._calculateArenaBoundaries(groundDim, wallDim, wallLeftPos, wallRightPos, ceilingPos);

        let ground = MeshBuilder.CreateBox("ground", {size: 1}, this._scene);
        let ceiling = MeshBuilder.CreateBox("ceiling", {size: 1}, this._scene);
        let wall_left = MeshBuilder.CreateBox("wall_left", {size: 1}, this._scene);
        let wall_right = MeshBuilder.CreateBox("wall_right", {size: 1}, this._scene);

        wall_right.checkCollisions = true;
        wall_left.checkCollisions = true;

        const z_scaling : Vector3 = new Vector3(1,1,1.5);
        ground.scaling = ToVec3(env.groundDimensions).multiply(z_scaling);
        ceiling.scaling = ToVec3(env.groundDimensions).multiply(z_scaling);
        wall_left.scaling = ToVec3(env.wallDimensions).multiply(z_scaling);
        wall_right.scaling = ToVec3(env.wallDimensions).multiply(z_scaling);

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

        let ceiling_mat = new StandardMaterial("ceilingmat", this._scene);
        const ceiling_texture = new Texture("/media/ceiling.png");
        ceiling_texture.wAng = - Math.PI / 2;
        ceiling_texture.wrapU = Texture.WRAP_ADDRESSMODE;
        ceiling_texture.wrapV = Texture.WRAP_ADDRESSMODE;
        ceiling_texture.uScale = 6;
        ceiling_texture.vScale = 2;
        const ceiling_n_texture = new Texture("/media/ceiling_n.png");
        ceiling_n_texture.wrapU = Texture.WRAP_ADDRESSMODE;
        ceiling_n_texture.wrapV = Texture.WRAP_ADDRESSMODE;
        ceiling_n_texture.uScale = 6.0;
        ceiling_n_texture.vScale = 2.0;
        ceiling_n_texture.wAng = - Math.PI / 2;
        const ceiling_ao_texture = new Texture("/media/ceiling_ao.png");
        ceiling_ao_texture.wrapU = Texture.WRAP_ADDRESSMODE;
        ceiling_ao_texture.wrapV = Texture.WRAP_ADDRESSMODE;
        ceiling_ao_texture.uScale = 6.0;
        ceiling_ao_texture.vScale = 2.0;
        ceiling_ao_texture.wAng = - Math.PI / 2;
        ceiling_mat.diffuseTexture = ceiling_texture;
        ceiling_mat.bumpTexture = ceiling_n_texture;
        ceiling_mat.ambientTexture = ceiling_ao_texture;

        let wall_mat = new StandardMaterial("wallmat", this._scene);
        let ground_mat = new StandardMaterial("groundmat", this._scene);
        ground_mat.specularColor = new Color3(0.1, 0.1, 0.1);
        const ground_texture = new Texture("/media/court.png");
        ground_texture.wAng = Math.PI / 2;
        ground_texture.wrapU = Texture.WRAP_ADDRESSMODE;
        ground_texture.wrapV = Texture.WRAP_ADDRESSMODE;
        ground_texture.uScale = 15.0;
        ground_texture.vScale = 15.0;
        const wall_texture = new Texture("/media/wall.png");
        wall_texture.wrapU = Texture.WRAP_ADDRESSMODE;
        wall_texture.wrapV = Texture.WRAP_ADDRESSMODE;
        wall_texture.uScale = 9.0;
        wall_texture.vScale = 3.0;
        const wall_n_texture = new Texture("/media/wall_normal.png");
        wall_n_texture.wrapU = Texture.WRAP_ADDRESSMODE;
        wall_n_texture.wrapV = Texture.WRAP_ADDRESSMODE;
        wall_n_texture.uScale = 9.0;
        wall_n_texture.vScale = 3.0;
        const wall_ao_texture = new Texture("/media/wall_ambient.png");
        wall_ao_texture.wrapU = Texture.WRAP_ADDRESSMODE;
        wall_ao_texture.wrapV = Texture.WRAP_ADDRESSMODE;
        wall_ao_texture.uScale = 9.0;
        wall_ao_texture.vScale = 3.0;
        wall_mat.diffuseTexture = wall_texture;
        wall_mat.bumpTexture = wall_n_texture;
        wall_mat.ambientTexture = wall_ao_texture;
        wall_mat.roughness = 0.1;
        wall_left.material = wall_mat;
        wall_right.material = wall_mat;
        ground_mat.diffuseTexture = ground_texture;
        ground.material = ground_mat;
        ceiling.material = ceiling_mat; 
    }

    private _calculateArenaBoundaries(groundDim: Vector3, wallDim: Vector3, wallLeftPos: Vector3, wallRightPos: Vector3, ceilingPos: Vector3) {
        const verticalThickness = groundDim.y / 2; 
        const horizontalThickness = wallDim.y / 2;

        this.wallMin = new Vector3(wallLeftPos.x + horizontalThickness, verticalThickness, -(groundDim.z / 2));
        this.wallMax = new Vector3(wallRightPos.x - horizontalThickness, ceilingPos.y - verticalThickness, (groundDim.z / 2));
    }
}