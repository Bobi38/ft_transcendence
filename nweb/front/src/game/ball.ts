import { Mesh, MeshBuilder, Observable, PhysicsAggregate, PhysicsBody, PhysicsMotionType, PhysicsShapeSphere, PhysicsShapeType, Scalar, Scene, ShadowGenerator, TransformNode, Vector3 } from "@babylonjs/core";

export class Ball {
    private _mesh: Mesh;
    private _body: PhysicsBody;
    private _maxSpeed: number;
    private _scene: Scene;
    private _shadow: ShadowGenerator;
    private _physicsObserver;

    constructor(position: Vector3, diameter: number, maxSpeed: number, shadow: ShadowGenerator, scene: Scene) {
        this._scene = scene;
        this._maxSpeed = maxSpeed;

        this._mesh = MeshBuilder.CreateSphere("ball", {diameter: diameter}, this._scene);
        //this._mesh.position = position;
        this._shadow = shadow;
        this._shadow.addShadowCaster(this._mesh);

        //const ballPos = new Vector3(this.state.ball.position.x, this.state.ball.position.y, this.state.ball.position.z);
        const ballNode = new TransformNode("ballNode", this._scene);
        ballNode.position = position;
        const ballShape = new PhysicsShapeSphere(Vector3.Zero(), 0.5, this._scene);
        const ball = new PhysicsBody(ballNode, PhysicsMotionType.DYNAMIC, false, this._scene);
        ball.shape = ballShape;
        const material = {friction: 0, restitution: 1};
        ballShape.material = material;
        ball.setMassProperties({mass: 1});
        ball.setLinearDamping(0);
        ball.setAngularDamping(0);
        this._mesh.parent = ballNode;
        this._body = ball;
        this._body.disablePreStep = false;


        this._physicsObserver = scene.onBeforePhysicsObservable.add(() => {
            const ballVelocity = this._body.getLinearVelocity();
            const ballSpeed = ballVelocity.length();
            const smoothingFactor = 0.95;
            if (ballSpeed > this._maxSpeed) {
                const target = ballSpeed / this._maxSpeed;
                const scale = Scalar.Lerp(1, target, 1 - smoothingFactor);
                ballVelocity.scaleInPlace(scale);
                this._body.setLinearVelocity(ballVelocity);
            }
        });
    }

    public setVelocity(velocity : Vector3) {
        this._body.setLinearVelocity(velocity);
    }

    public setMeshPosition(position: Vector3) {
        //this._mesh.position = position;
        this._body.transformNode.position = position;
        //this._aggregate.body.setTargetTransform(position, this._mesh.rotationQuaternion);
    } 

    public getMeshPosition() : Vector3 {
        return this._body.transformNode.position.clone();
    }

    public getVelocity() : Vector3 {
        return this._body.getLinearVelocity();
    }

    public dispose() {
        this._shadow.removeShadowCaster(this._mesh);
        this._scene.onBeforePhysicsObservable.remove(this._physicsObserver);
        this._body.shape.dispose();
        this._body.dispose();
        this._mesh.dispose();
        this._physicsObserver = null;
        this._mesh = null;
        this._body = null;
        this._scene = null;
    }
}