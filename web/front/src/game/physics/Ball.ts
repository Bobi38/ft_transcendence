import { Color3, Engine, Mesh, MeshBuilder, Scene, ShadowGenerator, StandardMaterial, Texture, TransformNode, Vector3 } from "@babylonjs/core";
import { BallSnapshot, SnapshotBuffer } from "../utils/Snapshots";
import { SynchronizedClock } from "../utils/SynchronizedClock";
import { PhysicsEngine } from "./PhysicsEngine";

export class Ball {
    public _mesh: Mesh;
    private _velocity: Vector3 = Vector3.Zero();
    private _node: TransformNode;
    public  radius: number;
    private _scene: Scene;
    private _shadows: ShadowGenerator[];
    private _physicsObserver;
    private _clock: SynchronizedClock;
    private _engine: Engine;
    private _physicsEngine: PhysicsEngine;
    public snapshots : SnapshotBuffer = new SnapshotBuffer();
    public positionError: Vector3 = Vector3.Zero();
    public visualOffset: Vector3 = Vector3.Zero();
    public serverPatch : BallSnapshot = null;
    public recentImpact : boolean = false;
    public ignoreServerAfter : number = null;
    public ignoreServerUntil : number = 0;
    

    constructor(position: Vector3, velocity: Vector3, diameter: number, shadows: ShadowGenerator[], scene: Scene, clock: SynchronizedClock, engine: Engine, physicsEngine: PhysicsEngine) {
        this._scene = scene;
        this._clock = clock;
        this._engine = engine;
        this._physicsEngine = physicsEngine;

        this._mesh = MeshBuilder.CreateSphere("ball", {diameter: diameter}, this._scene);
        this.radius = diameter / 2;
        const ballMaterial = new StandardMaterial("ballTexture", scene);
        ballMaterial.diffuseTexture = new Texture("media/ballTexture.jpg", this._scene);
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

    public correctPosAndVel() {
        if (!this.serverPatch) return ;
        if (this.recentImpact || this._clock.tick < this.ignoreServerUntil || (this.ignoreServerAfter != null && this._clock.tick >= this.ignoreServerAfter)) {
            this.serverPatch = null;
            return;
        }

        this._clock.updateAccumulatorSlew(this.serverPatch.tick);
        const pastSnapshot = this.snapshots.getSnapshotAtTick(this.serverPatch.tick);
        if (!pastSnapshot) {
            this.serverPatch = null; 
            return ;
        }

        const positionError = this.serverPatch.position.subtract(pastSnapshot.snapshot.position);
        const velocityError = this.serverPatch.velocity.subtract(pastSnapshot.snapshot.velocity);
        if (positionError.lengthSquared() < 1e-10 && velocityError.lengthSquared() < 1e-10) {
            this.serverPatch = null;
            return;
        }
        if (positionError.lengthSquared() < 0.05 && velocityError.lengthSquared() < 0.01) {
            this._correctSmallErrors(positionError, velocityError, pastSnapshot);
            this.serverPatch = null; 
            return ;
        }

        this._correctLargeErrors();
        this.serverPatch = null; 
    }

    private _correctSmallErrors(positionError: Vector3, velocityError: Vector3, pastSnapshot: {snapshot: BallSnapshot, index: number}) {
        this.setPhysicsBodyPosition(this.getPhysicsBodyPosition().add(positionError));
        this.snapshots.correctFollowingSnapshotsPos(positionError, pastSnapshot.index);
        this.setVelocity(this.getVelocity().add(velocityError));
        this.snapshots.correctFollowingSnapshotsVel(velocityError, pastSnapshot.index);
        this.visualOffset.subtractInPlace(positionError);
    }

    private _correctLargeErrors() {
        const preRollbackPos = this.getPhysicsBodyPosition();
        this._physicsEngine.resimulatePhysicTicks(this.serverPatch);
        const postRollbackPos = this.getPhysicsBodyPosition();
        const teleportDelta = preRollbackPos.subtract(postRollbackPos);
        this.visualOffset.addInPlace(teleportDelta);
    }

    public smoothPosition(){
        if (this.visualOffset.lengthSquared() < 0.0001) return;
        const dt = this._engine.getDeltaTime() / 1000; 
        const smoothingSpeed = 15; // higher = faster snap, lower = looser glide
        const correctionFactor = Math.exp(-smoothingSpeed * dt);
        this.setMeshPosition(this.visualOffset);
        this.visualOffset.scaleInPlace(correctionFactor);
    }

    public setVelocity(velocity : Vector3) {
        this._velocity = velocity.clone();
    }

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
        this.snapshots?.dispose();
        this.snapshots = null;

        this._shadows[0]?.removeShadowCaster(this._mesh);
        this._shadows[1]?.removeShadowCaster(this._mesh);
        this._shadows = null;

        this._scene?.onBeforePhysicsObservable.remove(this._physicsObserver);

        this._node?.dispose();
        this._node = null;

        this._mesh?.dispose();
        this._mesh = null;

        this._physicsObserver = null;
        this._scene = null;

        this._clock = null;
        this._physicsEngine = null;
        this.serverPatch = null;
    }
}