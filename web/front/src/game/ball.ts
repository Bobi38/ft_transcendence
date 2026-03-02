import { Mesh, MeshBuilder, Observable, PhysicsAggregate, PhysicsMotionType, PhysicsShapeType, Scalar, Scene, ShadowGenerator, Vector3 } from "@babylonjs/core";

export class Ball {
    private _mesh: Mesh;
    private _aggregate: PhysicsAggregate;
    private _maxSpeed: number;
    private _scene: Scene;
    private _shadow: ShadowGenerator;
    private _physicsObserver;

    constructor(position: Vector3, diameter: number, maxSpeed: number, shadow: ShadowGenerator, scene: Scene) {
        this._scene = scene;
        this._maxSpeed = maxSpeed;

        this._mesh = MeshBuilder.CreateSphere("ball", {diameter: diameter}, this._scene);
        this._mesh.position = position;
        this._shadow = shadow;
        this._shadow.addShadowCaster(this._mesh);

        this._aggregate = new PhysicsAggregate(this._mesh, PhysicsShapeType.SPHERE, 
            {mass: 1, restitution: 1, friction: 0}, this._scene);
        this._aggregate.body.setMotionType(PhysicsMotionType.DYNAMIC);

        this._physicsObserver = scene.onBeforePhysicsObservable.add(() => {
            const ballVelocity = this._aggregate.body.getLinearVelocity();
            const ballSpeed = ballVelocity.length();
            const smoothingFactor = 0.95;
            if (ballSpeed > this._maxSpeed) {
                const target = ballSpeed / this._maxSpeed;
                const scale = Scalar.Lerp(1, target, 1 - smoothingFactor);
                ballVelocity.scaleInPlace(scale);
                this._aggregate.body.setLinearVelocity(ballVelocity);
            }
        });
    }

    public getMeshPosition() : Vector3 {
        return this._mesh.position.clone();
    }

    public dispose() {
        this._shadow.removeShadowCaster(this._mesh);
        this._scene.onBeforePhysicsObservable.remove(this._physicsObserver);
        this._aggregate.dispose();
        this._mesh.dispose();
        this._physicsObserver = null;
        this._mesh = null;
        this._aggregate = null;
        this._scene = null;
    }
}