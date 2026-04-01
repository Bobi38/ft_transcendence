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
    //public bodies: PhysicsBody[] = [];
    public wallMin: Vector3;
    public wallMax: Vector3;

    constructor(scene: Scene) {
        this._scene = scene;
    }

    public async load() {
        const env = JSON.parse(Env);
        // let wallRightShape = new PhysicsShapeBox(Vector3.Zero(), Quaternion.Identity(), ToVec3(env.wallDimensions), this._scene);
        // let wallLeftShape = new PhysicsShapeBox(Vector3.Zero(), Quaternion.Identity(), ToVec3(env.wallDimensions), this._scene);
        // let groundShape = new PhysicsShapeBox(Vector3.Zero(), Quaternion.Identity(), ToVec3(env.groundDimensions), this._scene);
        // // let elevanShape = new PhysicsShapeBox(Vector3.Zero(), Quaternion.Identity(), ToVec3(env.groundDimensions), this._scene);
        // let ceilingShape = new PhysicsShapeBox(Vector3.Zero(), Quaternion.Identity(), ToVec3(env.groundDimensions), this._scene);
        // let wallRightNode = new TransformNode("wallRightNode", this._scene);
        // let wallLeftNode = new TransformNode("wallLeftNode", this._scene);
        // let groundNode = new TransformNode("groundNode", this._scene);
        // let ceilingNode = new TransformNode("ceilingNode", this._scene);
        // // let elevanNode = new TransformNode("elevanNode", this._scene);
        // wallRightNode.position = ToVec3(env.wallRightPos);
        // wallLeftNode.position = ToVec3(env.wallLeftPos);
        // ceilingNode.position = ToVec3(env.ceilingPos);
        // // elevanNode.position = ToVec3(env.elevanPos);
        // wallRightNode.rotationQuaternion = ToQuat(env.wallQuaternion);
        // wallLeftNode.rotationQuaternion = ToQuat(env.wallQuaternion);
        // // elevanNode.rotationQuaternion = ToQuat(env.elevanQuaternion);
        // let wallRightBody = new PhysicsBody(wallRightNode, PhysicsMotionType.STATIC, false, this._scene);
        // let wallLeftBody = new PhysicsBody(wallLeftNode, PhysicsMotionType.STATIC, false, this._scene);
        // let groundBody = new PhysicsBody(groundNode, PhysicsMotionType.STATIC, false, this._scene);
        // let ceilingBody = new PhysicsBody(ceilingNode, PhysicsMotionType.STATIC, false, this._scene);
        // // let elevan = new PhysicsBody(elevanNode, PhysicsMotionType.STATIC, false, this._scene);
        // wallRightBody.shape = wallRightShape;
        // wallLeftBody.shape = wallLeftShape;
        // groundBody.shape = groundShape;
        // ceilingBody.shape = ceilingShape;
        // // // elevan.shape = elevanShape;
        // const wallmaterial = {friction: 0, restitution: 1};
        // wallRightShape.material = wallmaterial;
        // wallLeftShape.material = wallmaterial;
        // groundShape.material = wallmaterial;
        // ceilingShape.material = wallmaterial;
        // // elevanShape.material = wallmaterial;
        // wallRightBody.setMassProperties({mass: 1});
        // wallLeftBody.setMassProperties({mass: 1});
        // groundBody.setMassProperties({mass: 1});
        // ceilingBody.setMassProperties({mass: 1});
        // // elevan.setMassProperties({mass: 1});
        // wallRightBody.setLinearDamping(0);
        // wallLeftBody.setLinearDamping(0);
        // groundBody.setLinearDamping(0);
        // ceilingBody.setLinearDamping(0);
        // // elevan.setLinearDamping(0);
        // wallRightBody.setAngularDamping(0);
        // wallLeftBody.setAngularDamping(0);
        // groundBody.setAngularDamping(0);
        // ceilingBody.setAngularDamping(0);
        // // elevan.setAngularDamping(0);
        // this.bodies.push(wallLeftBody);
        // this.bodies.push(wallRightBody);
        // this.bodies.push(groundBody);
        // this.bodies.push(ceilingBody);
        // // this.bodies.push(elevan);
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
        wall_mat.diffuseColor = new Color3(1,1,1);
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

    private _calculateArenaBoundaries(groundDim: Vector3, wallDim: Vector3, wallLeftPos: Vector3, wallRightPos: Vector3, ceilingPos: Vector3) {
        const verticalThickness = groundDim.y / 2; 
        const horizontalThickness = wallDim.y / 2;

        this.wallMin = new Vector3(wallLeftPos.x + horizontalThickness, verticalThickness, -(groundDim.z / 2));
        this.wallMax = new Vector3(wallRightPos.x - horizontalThickness, ceilingPos.y - verticalThickness, (groundDim.z / 2));
    }
}