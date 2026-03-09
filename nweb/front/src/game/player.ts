import { AbstractMesh, Axis, Mesh, PhysicsAggregate, PhysicsBody, PhysicsEventType, PhysicsMotionType, PhysicsShapeBox, PhysicsShapeType, PhysicsViewer, Plane, Quaternion, Scalar, Scene, ShadowGenerator, TransformNode, UniversalCamera, Vector2, Vector3 } from "@babylonjs/core";
import { PlayerInput } from "./playerInput";
import { Room } from "@colyseus/sdk";

export class Player extends TransformNode {
    PLAYER_SPEED: number;
    public camera;
    public scene: Scene;
    public room: Room;
    private _input;
    private _moveDirection: Vector3;

    public mouseSpeedBuffer = [];
    public mouseBufferSize: number = 5;
    public prevMousePos = Vector2.Zero();
    public mouseDirBuffer = [];

    public mesh: Mesh;
    public racket: TransformNode;
    public racketBody: PhysicsBody;
    public hand_node: TransformNode;

    constructor(assets, scene: Scene, shadowGenerator: ShadowGenerator, input : PlayerInput, room: Room) {
        super("player", scene);
        this.scene = scene;
        this.room = room;
        this.mesh = assets.mesh;
        this.mesh.parent = this;
        this._setupPlayerCamera();

        this.racket = (scene.getNodeByName("racketRoot") as TransformNode);
        this.hand_node = (scene.getNodeByName("hand_node") as TransformNode);
        shadowGenerator.addShadowCaster(this.mesh, false);
        shadowGenerator.addShadowCaster(scene.getMeshByName("racket"), false);
        shadowGenerator.addShadowCaster(scene.getMeshByName("hand"), false);
        shadowGenerator.addShadowCaster(scene.getMeshByName("stick"), false);
    
        this._input = input;

        const colRacketShape = new PhysicsShapeBox(Vector3.Zero(), Quaternion.Identity(),
            new Vector3(1.5, 2.5, 0.5), scene);
        const colRacketBody = new PhysicsBody(this.racket, PhysicsMotionType.ANIMATED, false, scene);
        colRacketBody.shape = colRacketShape;
        colRacketBody.setMassProperties({mass: 1});
        colRacketBody.disablePreStep = false;
        colRacketBody.setCollisionCallbackEnabled(true);
        this.racketBody = colRacketBody;

        colRacketBody.getCollisionObservable().add((event) => {
            if (event.type != PhysicsEventType.COLLISION_STARTED)
                return ;
            console.log("impulse added");
            const ballBody = event.collidedAgainst;
            const hitForward = 0.5;
            const mouseDirAvg = (this.mouseDirBuffer.reduce((acc: Vector2, curr: Vector2) => curr.add(acc), Vector2.Zero()) as Vector2);
            mouseDirAvg.scaleInPlace(1/this.mouseBufferSize).normalize();
            const hitDirection = new Vector3(mouseDirAvg.x, -mouseDirAvg.y, hitForward).normalize();
            console.log(hitDirection);
            const mouseAvgSpeed = this.mouseSpeedBuffer.reduce((acc, curr) => acc + curr, 0) / this.mouseBufferSize;
            const power = Scalar.SmoothStep(0, 200, mouseAvgSpeed) / 10;
            console.log(mouseAvgSpeed, power);

            ballBody.applyImpulse(hitDirection.scale(power), event.point);

            const ballPos = ballBody.transformNode.position.clone();
            const ballVel = ballBody.getLinearVelocity(); 
            this.room.send("racketImpact", {position: ballPos.asArray(), velocity: ballVel.asArray()});
        });

        // this.racketAggregate = new PhysicsAggregate(scene.getNodeByName("rocketRoot") as TransformNode,
        //     PhysicsShapeType.BOX,
        //     {extents: new Vector3(1.5, 2.5, 1), 
        //     mass: 0, restitution: 1.2, friction: 0.5}, this.scene);
        // this.racketAggregate.body.setMotionType(PhysicsMotionType.ANIMATED);
        // this.racketAggregate.body.disablePreStep = false;

        const physicsViewer = new PhysicsViewer(this.scene);
        physicsViewer.showBody(colRacketBody);
    }

    private _updateFromControls() {
        this._moveDirection = new Vector3(this._input.horizontal, 0, this._input.vertical).normalize();
    }

    private _updateFromMouse() {
        const mousePos = new Vector2(this.scene.pointerX, this.scene.pointerY);
        const mouseSpeed = Vector2.Distance(mousePos, this.prevMousePos);
        const mouseDir = mousePos.subtract(this.prevMousePos);
        this.mouseDirBuffer.push(mouseDir);
        this.mouseSpeedBuffer.push(mouseSpeed);
        if (this.mouseSpeedBuffer.length > this.mouseBufferSize) {
            this.mouseSpeedBuffer.shift();
        }
        if (this.mouseDirBuffer.length > this.mouseBufferSize) {
            this.mouseDirBuffer.shift();
        }
        this.prevMousePos = mousePos;

        const plane = Plane.FromPositionAndNormal(new Vector3(0,0,3), new Vector3(0,0,1));
        const ray = this.scene.createPickingRay(this.scene.pointerX, this.scene.pointerY,
            null, this.camera);
        const distance = ray.intersectsPlane(plane);
        if (distance) {
            const worldPointerPos : Vector3 = ray.origin.add(ray.direction.scale(distance));
            const relativePos : Vector3 = worldPointerPos.subtract(this.hand_node.absolutePosition);

            const maxRadius = 5;
            if (relativePos.length() > maxRadius) {
                relativePos.normalize().scaleInPlace(maxRadius);
                //relativePos.normalize().multiplyInPlace(new Vector3(3.5,3.5,3.5));
            }
            else {
                relativePos.normalize().scaleInPlace(maxRadius);
            }
            const oldPos = this.racket.position;
            this.racket.position = relativePos;

            const localAxisY = relativePos.clone().normalize(); 
            let movementDir = relativePos.subtract(oldPos);
            let localAxisX : Vector3;
            if (movementDir.length() < 0.01)
            {
                const oldZ = this.racket.getDirection(Axis.Z);
                localAxisX = Vector3.Cross(localAxisY, oldZ).normalize();
            }
            else {
                localAxisX = Vector3.Cross(localAxisY, movementDir).normalize();
            }
            const localAxisZ = Vector3.Cross(localAxisX, localAxisY).normalize();
            const targetRotation = Quaternion.RotationQuaternionFromAxis(localAxisX, localAxisY, localAxisZ);

            let lerpedRotation : Quaternion;
            if (!this.racket.rotationQuaternion) {
                lerpedRotation = targetRotation;
            } else {
                Quaternion.SlerpToRef(this.racket.rotationQuaternion, targetRotation, 0.3, this.racket.rotationQuaternion);
                //lerpedRotation = Quaternion.Slerp(this.racket.rotationQuaternion, targetRotation, 0.3);
            }
            //this.racketBody.setTargetTransform(relativePos, lerpedRotation);
        }
    }

    private _setupPlayerCamera() {
        this.camera = new UniversalCamera("cam", new Vector3(0,3,-23), this.scene);
        this.camera.fov = 0.47;
        this.scene.activeCamera = this.camera;
        this.activatePlayerCamera();
    }

    public activatePlayerCamera() {
        this.scene.registerBeforeRender(() => {
            this._updateFromControls();
            this._updateFromMouse();
            this.mesh.moveWithCollisions(this._moveDirection);
            this._updateCamera();
        })
    }

    private _updateCamera() {
        let cameraOffset = new Vector3(0,3,-23);
        let newPos = this.mesh.position.add(cameraOffset);
        this.camera.position = Vector3.Lerp(this.camera.position, newPos, 0.4);
    }
}