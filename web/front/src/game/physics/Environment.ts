import { AbstractMesh, Color3, HemisphericLight, ImportMeshAsync, Light, MeshBuilder, PointLight, Quaternion, Scene, ShadowGenerator, StandardMaterial, Texture, TransformNode, Vector3 } from "@babylonjs/core";
import { Env } from "/app/src/game/shared/media.js";
import { CharacterAssets } from "../App";


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
    public wallMin: Vector3 = Vector3.Zero();
    public wallMax: Vector3 = Vector3.Zero();
    public materials : StandardMaterial[] = [];
    public textures : Texture[] = [];
    public meshes : AbstractMesh[] = [];
    public nodes : TransformNode[] = [];
    public shadows : ShadowGenerator[] = [];
    public lights : Light[] = [];

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
        let wallLeft = MeshBuilder.CreateBox("wall_left", {size: 1}, this._scene);
        let wallRight = MeshBuilder.CreateBox("wall_right", {size: 1}, this._scene);
        this.meshes.push(ground, ceiling, wallLeft, wallRight);

        wallRight.checkCollisions = true;
        wallLeft.checkCollisions = true;

        const zScaling : Vector3 = new Vector3(1,1,1.5);
        ground.scaling = ToVec3(env.groundDimensions).multiply(zScaling);
        ceiling.scaling = ToVec3(env.groundDimensions).multiply(zScaling);
        wallLeft.scaling = ToVec3(env.wallDimensions).multiply(zScaling);
        wallRight.scaling = ToVec3(env.wallDimensions).multiply(zScaling);

        ground.receiveShadows = true;
        ceiling.receiveShadows = true;
        wallLeft.receiveShadows = true;
        wallRight.receiveShadows = true;

        ceiling.position = ToVec3(env.ceilingPos);
        wallLeft.position = ToVec3(env.wallLeftPos);
        wallRight.position = ToVec3(env.wallRightPos);
    
        let rotationQuaternion = ToQuat(env.wallQuaternion);
        wallLeft.rotationQuaternion = rotationQuaternion;
        wallRight.rotationQuaternion = rotationQuaternion;

        let ceilingMat = new StandardMaterial("ceilingmat", this._scene);
        const ceilingTexture = new Texture("media/ceiling.png");
        ceilingTexture.wAng = - Math.PI / 2;
        ceilingTexture.wrapU = Texture.WRAP_ADDRESSMODE;
        ceilingTexture.wrapV = Texture.WRAP_ADDRESSMODE;
        ceilingTexture.uScale = 6;
        ceilingTexture.vScale = 2;
        const ceilingNTexture = new Texture("media/ceiling_n.png");
        ceilingNTexture.wrapU = Texture.WRAP_ADDRESSMODE;
        ceilingNTexture.wrapV = Texture.WRAP_ADDRESSMODE;
        ceilingNTexture.uScale = 6.0;
        ceilingNTexture.vScale = 2.0;
        ceilingNTexture.wAng = - Math.PI / 2;
        const ceilingAoTexture = new Texture("media/ceiling_ao.png");
        ceilingAoTexture.wrapU = Texture.WRAP_ADDRESSMODE;
        ceilingAoTexture.wrapV = Texture.WRAP_ADDRESSMODE;
        ceilingAoTexture.uScale = 6.0;
        ceilingAoTexture.vScale = 2.0;
        ceilingAoTexture.wAng = - Math.PI / 2;
        ceilingMat.diffuseTexture = ceilingTexture;
        ceilingMat.bumpTexture = ceilingNTexture;
        ceilingMat.ambientTexture = ceilingAoTexture;

        let wallMat = new StandardMaterial("wallmat", this._scene);
        let groundMat = new StandardMaterial("groundmat", this._scene);
        groundMat.specularColor = new Color3(0.1, 0.1, 0.1);
        const groundTexture = new Texture("media/court.png");
        groundTexture.wAng = Math.PI / 2;
        groundTexture.wrapU = Texture.WRAP_ADDRESSMODE;
        groundTexture.wrapV = Texture.WRAP_ADDRESSMODE;
        groundTexture.uScale = 15.0;
        groundTexture.vScale = 15.0;
        const wallTexture = new Texture("media/wall.png");
        wallTexture.wrapU = Texture.WRAP_ADDRESSMODE;
        wallTexture.wrapV = Texture.WRAP_ADDRESSMODE;
        wallTexture.uScale = 9.0;
        wallTexture.vScale = 3.0;
        const wallNTexture = new Texture("media/wall_normal.png");
        wallNTexture.wrapU = Texture.WRAP_ADDRESSMODE;
        wallNTexture.wrapV = Texture.WRAP_ADDRESSMODE;
        wallNTexture.uScale = 9.0;
        wallNTexture.vScale = 3.0;
        const wallAoTexture = new Texture("media/wall_ambient.png");
        wallAoTexture.wrapU = Texture.WRAP_ADDRESSMODE;
        wallAoTexture.wrapV = Texture.WRAP_ADDRESSMODE;
        wallAoTexture.uScale = 9.0;
        wallAoTexture.vScale = 3.0;
        wallMat.diffuseTexture = wallTexture;
        wallMat.bumpTexture = wallNTexture;
        wallMat.ambientTexture = wallAoTexture;
        wallMat.roughness = 0.1;
        wallLeft.material = wallMat;
        wallRight.material = wallMat;
        groundMat.diffuseTexture = groundTexture;
        ground.material = groundMat;
        ceiling.material = ceilingMat;

        this.materials.push(ceilingMat, groundMat, wallMat);
        this.textures.push(ceilingAoTexture, ceilingNTexture, ceilingTexture,
            groundTexture,
            wallAoTexture, wallNTexture, wallTexture);
    }

    private _calculateArenaBoundaries(groundDim: Vector3, wallDim: Vector3, wallLeftPos: Vector3, wallRightPos: Vector3, ceilingPos: Vector3) {
        const verticalThickness = groundDim.y / 2; 
        const horizontalThickness = wallDim.y / 2;

        this.wallMin = new Vector3(wallLeftPos.x + horizontalThickness, verticalThickness, -(groundDim.z / 2));
        this.wallMax = new Vector3(wallRightPos.x - horizontalThickness, ceilingPos.y - verticalThickness, (groundDim.z / 2));
    }

    public async loadCharacterAssets(scene: Scene, position: Vector3, isPlayer: boolean, isNearSide: boolean): Promise<CharacterAssets> {
        const assets = await ImportMeshAsync("/media/mii.glb", scene);
        const body = assets.meshes[0];  
        if (isPlayer) {
            assets.meshes.forEach((m) => {
                m.isVisible = false;
            });
        }
        if (isPlayer && !isNearSide) {
            body.rotate(new Vector3(0,1,0), Math.PI);
        }
        if (!isPlayer && !isNearSide) {
            body.rotate(new Vector3(0,1,0), Math.PI);
        }

        body.position = position;
        const bodymtl = new StandardMaterial("red", scene);
        bodymtl.diffuseColor = Color3.Red();
        body.material = bodymtl;
        body.isPickable = false;
        const hand_node = new TransformNode("hand_node", scene)
        hand_node.position = new Vector3(0.4, 2, 0);
        const hand = MeshBuilder.CreateSphere("hand", {diameter: 0.8});
        hand.material = bodymtl;

        const racketmtl = new StandardMaterial("white", scene);
        racketmtl.diffuseColor = new Color3(0.4,0.2,0);
        const stick = MeshBuilder.CreateCylinder("stick", {diameter: 0.4, height: 1.2});
        stick.position._y = 0.8;
        stick.material = racketmtl;
        const racket = MeshBuilder.CreateCylinder("racket", {diameter: 2, height: 0.4});
        racket.material = racketmtl;
        racket.position._y = 1.2;
        racket.rotationQuaternion = Quaternion.FromEulerAngles(Math.PI / 2, 0, 0);
        
        const racketRoot = new TransformNode("racketRoot", scene);

        racket.parent = stick;
        stick.parent = hand;
        hand.parent = racketRoot;
        racketRoot.parent = hand_node;
        hand_node.parent = body;

        this.meshes.push(body);
        this.materials.push(bodymtl, racketmtl);
        this.nodes.push(hand_node, racketRoot);
        return { mesh: body, handNode: hand_node, racketNode: racketRoot};
    }

    public loadLights(scene: Scene) : ShadowGenerator[] {
        const shadows : ShadowGenerator[] = [];
        let light1 = new PointLight('light1', new Vector3(0,6,-10), scene);
        light1.diffuse = new Color3(1,1,1);
        light1.intensity = 0.4;
        let shadow1 = new ShadowGenerator(2048, light1);
        shadow1.darkness = 0.1;
        shadows.push(shadow1);
        let light2 = new PointLight('light2', new Vector3(0,6,30), scene);
        light2.diffuse = new Color3(1,1,1);
        light2.intensity = 0.5;
        let light3 = new HemisphericLight("Light3", new Vector3(0,1,0), scene);
        light3.intensity = 0.6;
        light3.groundColor = new Color3(0.5, 0.5, 0.5);
        let shadow2 = new ShadowGenerator(2048, light2);
        shadow2.darkness = 0.1;
        shadows.push(shadow2);

        this.shadows.push(shadow1, shadow2);
        this.lights.push(light1, light2, light3);
        return shadows;
    }

    public dispose() {
        this.shadows.forEach((shadow: ShadowGenerator) => shadow.dispose());
        this.shadows = null;

        this.lights.forEach((light: Light) => light.dispose());
        this.lights = null;

        this.materials.forEach((material: StandardMaterial) => material.dispose());
        this.materials = null;

        this.textures.forEach((texture: Texture) => texture.dispose());
        this.textures = null;

        this.nodes.forEach((node: TransformNode) => node.dispose());
        this.nodes = null;

        this.meshes.forEach((mesh: AbstractMesh) => mesh.dispose());
    }
}

