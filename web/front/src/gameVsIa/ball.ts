import { Color3, Mesh, MeshBuilder, Scene, ShadowGenerator, StandardMaterial, Texture, TransformNode, Vector3 } from "@babylonjs/core";

export class Ball {
    public _mesh: Mesh;
    private _velocity: Vector3 = Vector3.Zero();
    private _node: TransformNode;
    public  radius: number;
    private _scene: Scene;
    private _shadows: ShadowGenerator[];
    private _physicsObserver;
    

    constructor(position: Vector3, velocity: Vector3, diameter: number, shadows: ShadowGenerator[], scene: Scene) {
        this._scene = scene;

        this._mesh = MeshBuilder.CreateSphere("ball", {diameter: diameter}, this._scene);
        this.radius = diameter / 2;
        const ballMaterial = new StandardMaterial("ballTexture", scene);
        ballMaterial.diffuseTexture = new Texture("/media/ballTexture.jpg", this._scene);
        ballMaterial.specularColor = new Color3(0.3, 0.3, 0.2);
        ballMaterial.specularPower = 10;
        this._mesh.material = ballMaterial;
        this._mesh.position = Vector3.Zero();
        this._shadows = shadows;
        this._shadows[0].addShadowCaster(this._mesh);
        this._shadows[1].addShadowCaster(this._mesh);
        this._shadows[0].usePercentageCloserFiltering = true;
        this._shadows[1].usePercentageCloserFiltering = true;
        this._shadows[0].filteringQuality = ShadowGenerator.QUALITY_MEDIUM;
        this._shadows[1].filteringQuality = ShadowGenerator.QUALITY_MEDIUM;
        this._shadows[0].useContactHardeningShadow = true;
        this._shadows[1].useContactHardeningShadow = true;
        this._shadows[0].contactHardeningLightSizeUVRatio = 0.05;
        this._shadows[1].contactHardeningLightSizeUVRatio = 0.05;

        const ballNode = new TransformNode("ballNode", this._scene);
        ballNode.position = position;
        this._node = ballNode;
        this._mesh.parent = ballNode;
        this._mesh.position = Vector3.Zero();
        this._velocity = velocity;
    }


    public setVelocity(velocity : Vector3) {
        this._velocity = velocity.clone();
    }

    // public setAngularVelocity(velocity : Vector3) {
    //     this._body.setAngularVelocity(velocity);
    // }

    public setPhysicsBodyPosition(position: Vector3) {
        this._node.position = position.clone();
    }

    public setMeshPosition(position: Vector3) {
        this._mesh.position = position.clone();
    }

    public getMeshPosition() :Vector3 {
        return(this._mesh.position.clone());
    }

    public getPhysicsBodyPosition() : Vector3 {
        return this._node.position.clone();
    }

    public getVelocity() : Vector3 {
        return this._velocity.clone();
    }

    public dispose() {
        this._shadows[0].removeShadowCaster(this._mesh);
        this._shadows[1].removeShadowCaster(this._mesh);
        this._scene.onBeforePhysicsObservable.remove(this._physicsObserver);
        this._node.dispose();
        this._node = null;
        this._mesh.dispose();
        this._physicsObserver = null;
        this._mesh = null;
        this._scene = null;
    }
}