import { Axis, Mesh, PhysicsAggregate, PhysicsBody, PhysicsMotionType, PhysicsShapeBox, PhysicsShapeType, PhysicsViewer, Plane, Quaternion, Scalar, Scene, ShadowGenerator, TransformNode, UniversalCamera, Vector2, Vector3 } from "@babylonjs/core";
import { PlayerInput } from "./playerInput";

export class Player extends TransformNode {
    PLAYER_SPEED: number;
    public camera;
    public scene: Scene;
    private _input;
    private _moveDirection: Vector3;

    public mouseSpeedBuffer = [];
    public mouseBufferSize: number = 5;
    public prevMousePos = Vector2.Zero();

    public mesh: Mesh;
    public racket: TransformNode;
    public racketAggregate: PhysicsAggregate;
    public hand_node: TransformNode;

    constructor(assets, scene: Scene, shadowGenerator: ShadowGenerator, input? : PlayerInput) {
        super("player", scene);
        this.scene = scene;
        this.mesh = assets.mesh;
        this.mesh.parent = this;
        this._setupPlayerCamera();

        this.racket = (scene.getNodeByName("racketRoot") as TransformNode);
        this.hand_node = (scene.getNodeByName("hand_node") as TransformNode);
        shadowGenerator.addShadowCaster(assets.mesh, true);
        this._input = input;

        const colRacketShape = new PhysicsShapeBox(Vector3.Zero(), Quaternion.Identity(),
            new Vector3(1.5, 2.5, 0.5), scene);
        const colRacketBody = new PhysicsBody(this.racket, PhysicsMotionType.ANIMATED, false, scene);
        colRacketBody.shape = colRacketShape;
        colRacketBody.setMassProperties({mass: 1});
        colRacketBody.disablePreStep = false;
        colRacketBody.setCollisionCallbackEnabled(true);

        colRacketBody.getCollisionObservable().add((event) => {
            console.log("impulse added");
            const ballBody = event.collidedAgainst;
            const hitDirection = event.normal.scale(-1);
            const mouseAvgSpeed = this.mouseSpeedBuffer.reduce((acc, curr) => acc + curr, 0) / this.mouseBufferSize;
            const power = Scalar.SmoothStep(0, 200, mouseAvgSpeed) / 20;
            console.log(power);

            ballBody.applyImpulse(hitDirection.scale(power), event.point);
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
        this.mouseSpeedBuffer.push(mouseSpeed);
        if (this.mouseSpeedBuffer.length > this.mouseBufferSize) {
            this.mouseSpeedBuffer.shift();
        }
        this.prevMousePos = mousePos;

        const plane = Plane.FromPositionAndNormal(new Vector3(0,0,5), new Vector3(0,0,1));
        const ray = this.scene.createPickingRay(this.scene.pointerX, this.scene.pointerY,
            null, this.camera);
        const distance = ray.intersectsPlane(plane);
        if (distance) {
            const worldPointerPos : Vector3 = ray.origin.add(ray.direction.scale(distance));
            const relativePos : Vector3 = worldPointerPos.subtract(this.hand_node.absolutePosition);
            if (relativePos.length() > 3.5) {
                relativePos.normalize().multiplyInPlace(new Vector3(3.5,3.5,3.5));
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

            if (!this.racket.rotationQuaternion) {
                this.racket.rotationQuaternion = targetRotation;
            } else {
                Quaternion.SlerpToRef(this.racket.rotationQuaternion, targetRotation, 0.3, this.racket.rotationQuaternion);
            }
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