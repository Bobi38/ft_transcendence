import { Color3, Material, Mesh, MeshBuilder, Observable, PhysicsAggregate, PhysicsBody, PhysicsMotionType, PhysicsShapeSphere, PhysicsShapeType, PhysicsViewer, Scalar, Scene, ShadowGenerator, StandardMaterial, Texture, TransformNode, Vector3 } from "@babylonjs/core";
import { BallSnapshot, SnapshotBuffer } from "./snapshots";
import { SynchronizedClock } from "./SynchronizedClock";
import { App } from "./app";

export class Ball {
    public _mesh: Mesh;
    // public _body: PhysicsBody;
    private _velocity: Vector3 = Vector3.Zero();
    private _node: TransformNode;
    public  radius: number;
    private _maxSpeed: number;
    private _scene: Scene;
    private _shadows: ShadowGenerator[];
    private _physicsObserver;
    private _clock: SynchronizedClock;
    private _app: App;
    public snapshots : SnapshotBuffer = new SnapshotBuffer();
    public positionError: Vector3 = Vector3.Zero();
    public visualOffset: Vector3 = Vector3.Zero();
    public serverPatch : BallSnapshot = null;
    public recentImpact : boolean = false;
    public ignoreServerUntil : number = 0;
    public  isResimming : boolean = false;
    

    constructor(position: Vector3, velocity: Vector3, diameter: number, maxSpeed: number, shadows: ShadowGenerator[], scene: Scene, clock: SynchronizedClock, app: App) {
        this._app = app;
        this._scene = scene;
        this._maxSpeed = maxSpeed;
        this._clock = clock;

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
        // const ballShape = new PhysicsShapeSphere(Vector3.Zero(), 0.5, this._scene);
        // const ball = new PhysicsBody(ballNode, PhysicsMotionType.DYNAMIC, false, this._scene);
        // ball.shape = ballShape;
        // const material = {friction: 0, restitution: 1};
        // ballShape.material = material;
        // ball.setMassProperties({mass: 1});
        // ball.setLinearDamping(0);
        // ball.setAngularDamping(0);
        this._mesh.parent = ballNode;
        // this._body = ball;
        // this._body.disablePreStep = false;
        this._mesh.position = Vector3.Zero();
        this._velocity = velocity;
        //this._body.setLinearVelocity(velocity);

        // this._physicsObserver = scene.onBeforePhysicsObservable.add(() => {
        //     const ballVelocity = this._body.getLinearVelocity();
        //     const ballSpeed = ballVelocity.length();
        //     const smoothingFactor = 0.95;
        //     if (ballSpeed > this._maxSpeed) {
        //         const target = ballSpeed / this._maxSpeed;
        //         const scale = Scalar.Lerp(1, target, 1 - smoothingFactor);
        //         ballVelocity.scaleInPlace(scale);
        //         this._body.setLinearVelocity(ballVelocity);
        //     }
        // });
        // const physicsViewer = new PhysicsViewer(this._scene);
        // physicsViewer.showBody(ball);
    }

    public correctPosAndVel() {
        if (!this.serverPatch) return ;
        //console.log(this.recentImpact, this.ignoreServerUntil);
        if (this.recentImpact || this._clock.tick < this.ignoreServerUntil) {
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
        if (positionError.lengthSquared() < 1e-10 && velocityError.lengthSquared() < 1e-10) return;
        console.log("tick:", this._clock.tick, "server tick:", this.serverPatch.tick,"pos error:", positionError.lengthSquared(), "vel error:", velocityError.lengthSquared());
        console.log("server vel:", this.serverPatch.velocity, "past vel:", pastSnapshot.snapshot.velocity);
        console.log("server pos:", this.serverPatch.position, "past pos:", pastSnapshot.snapshot.position);
        if (positionError.lengthSquared() < 0.05 && velocityError.lengthSquared() < 0.01) {
            this._correctSmallErrors(positionError, velocityError, pastSnapshot);
            return ;
        }

        this._correctLargeErrors();
    }

    // public setupCorrections() {
    //     this._scene.onBeforePhysicsObservable.add(() => {
    //         if (!this.serverPatch) return ;
    //         //console.log(this.recentImpact, this.ignoreServerUntil);
    //         if (this.recentImpact || this._clock.tick < this.ignoreServerUntil) {
    //             this.serverPatch = null;
    //             return;
    //         }

    //         this._clock.updateAccumulatorSlew(this.serverPatch.tick);
    //         const pastSnapshot = this.snapshots.getSnapshotAtTick(this.serverPatch.tick);
    //         if (!pastSnapshot) {
    //             this.serverPatch = null; 
    //             return ;
    //         }

    //         const positionError = this.serverPatch.position.subtract(pastSnapshot.snapshot.position);
    //         const velocityError = this.serverPatch.velocity.subtract(pastSnapshot.snapshot.velocity);
    //         console.log("tick:", this._clock.tick, "server tick:", this.serverPatch.tick,"pos error:", positionError.lengthSquared(), "vel error:", velocityError.lengthSquared());
    //         console.log("server vel:", this.serverPatch.velocity, "past vel:", pastSnapshot.snapshot.velocity);
    //         console.log("server pos:", this.serverPatch.position, "past pos:", pastSnapshot.snapshot.position);
    //         if (positionError.lengthSquared() < 0.05 && velocityError.lengthSquared() < 0.01) {
    //             this._correctSmallErrors(positionError, velocityError, pastSnapshot);
    //             return ;
    //         }

    //         this._correctLargeErrors();
    //     });            
    // }

    private _correctSmallErrors(positionError: Vector3, velocityError: Vector3, pastSnapshot: {snapshot: BallSnapshot, index: number}) {
        this.setPhysicsBodyPosition(this.getPhysicsBodyPosition().add(positionError));
        this.snapshots.correctFollowingSnapshotsPos(positionError, pastSnapshot.index);
        this.setVelocity(this.getVelocity().add(velocityError));
        this.snapshots.correctFollowingSnapshotsVel(velocityError, pastSnapshot.index);
        this.visualOffset.subtractInPlace(positionError);
        this.serverPatch = null;
    }

    private _correctLargeErrors() {
        const patchTick = this.serverPatch.tick;
        const ticksToResimulate = this._clock.tick - patchTick;
        const preRollbackPos = this.getPhysicsBodyPosition();
        this.setPhysicsBodyPosition(this.serverPatch.position);
        this.setVelocity(this.serverPatch.velocity);
        //console.log("patch vel:", this.serverPatch.velocity, "setVel:", this.getVelocity());
        //this._body.transformNode.computeWorldMatrix(true);
        //this._body.disablePreStep = false;
        this.snapshots.clearAfterTickIncluded(patchTick);
        this.snapshots.saveSnapshot(patchTick, this.serverPatch.position, this.serverPatch.velocity);
        this.isResimming = true;

        const racketHistory = this._app.getPlayerRacketHistory();
        const impactSnapshots = this._app.getPlayerImpactSnapshots();
        const player = this._app.getPlayer();
        //const HavokPlugin = this._app.getHavokPlugin();
        //const bodies = this._app.getBodies();
        for (let i = 1; i < ticksToResimulate; i++) {
            const simulatingTick = patchTick + i;
            const historicalRacket = racketHistory.get(simulatingTick);
            if (historicalRacket) {
                player.setRacketPos(historicalRacket.position);
                player.setRacketRot(historicalRacket.rotation);
            }
           //this._body.disablePreStep = false;
            this._app._executeStep();
            // const impactSnapshot = impactSnapshots.getSnapshotAtTick(simulatingTick);
            // if (impactSnapshot && impactSnapshot.snapshot && impactSnapshot.snapshot.tick === simulatingTick) {
            //     console.log("found impact snapshot at tick:", simulatingTick);
            //     this.setVelocity(impactSnapshot.snapshot.velocity);
            //     this.setPhysicsBodyPosition(impactSnapshot.snapshot.position);
            // }
            this._app._checkRacketCollision();
            this._app._checkWallCollision();
            //HavokPlugin.executeStep(FIXED_TIME_STEP, bodies);
            //this._body.transformNode.computeWorldMatrix(true);
            //console.log(this.getPhysicsBodyPosition());
            //console.log(this.getVelocity());
            this.snapshots.saveSnapshot(simulatingTick, this.getPhysicsBodyPosition(), this.getVelocity());
        }
        this.isResimming = false;
        const postRollbackPos = this.getPhysicsBodyPosition();
        const teleportDelta = preRollbackPos.subtract(postRollbackPos);
        this.visualOffset.addInPlace(teleportDelta);
    
        this.serverPatch = null;
    }

    public smoothPosition(){
        if (this.visualOffset.lengthSquared() < 0.0001) return;
        const dt = this._app.getEngine().getDeltaTime() / 1000; 
        const smoothingSpeed = 15; // higher = faster snap, lower = looser glide
        const correctionFactor = Math.exp(-smoothingSpeed * dt);
        //this.setMeshPosition(this.visualOffset);
        this.visualOffset.scaleInPlace(correctionFactor);
    }

    // public setupSmoothing() {
    //     this._scene.onBeforeRenderObservable.add(() => {
    //         if (this.visualOffset.lengthSquared() < 0.0001) return;
    //         const dt = this._app.getEngine().getDeltaTime() / 1000; 
    //         const smoothingSpeed = 15; // higher = faster snap, lower = looser glide
    //         const correctionFactor = Math.exp(-smoothingSpeed * dt);
    //         this.setMeshPosition(this.visualOffset);
    //         this.visualOffset.scaleInPlace(correctionFactor);
    //     });
    // }



    public setVelocity(velocity : Vector3) {
        this._velocity = velocity.clone();
        //this._body.setLinearVelocity(velocity);
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
        // this._app.getEngine().getPosi
        return this._node.position.clone();
    }

    public getVelocity() : Vector3 {
        return this._velocity.clone();
        //return this._body.getLinearVelocity();
    }

    public dispose() {
        this._shadows[0].removeShadowCaster(this._mesh);
        this._shadows[1].removeShadowCaster(this._mesh);
        this._scene.onBeforePhysicsObservable.remove(this._physicsObserver);
        //this._body.shape.dispose();
        //this._body.dispose();
        this._mesh.dispose();
        this._physicsObserver = null;
        this._mesh = null;
        //this._body = null;
        this._scene = null;
    }

    // public addToBodies(bodies: PhysicsBody[]) {
    //     bodies.push(this._body);
    // }

    // public forceBodyUpdateFromPhysicsEngine() {
    //     this._body.transformNode.computeWorldMatrix(true);
    // }
}