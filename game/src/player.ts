import { Axis, Mesh, PhysicsAggregate, PhysicsMotionType, PhysicsShapeType, Plane, Quaternion, Scene, ShadowGenerator, TransformNode, UniversalCamera, Vector3 } from "@babylonjs/core";
import { PlayerInput } from "./playerInput";

export class Player extends TransformNode {
    PLAYER_SPEED: number;
    public camera;
    public scene: Scene;
    private _input;
    private _moveDirection: Vector3;

    public mesh: Mesh;
    public racket: Mesh;
    public hand_node: TransformNode;

    constructor(assets, scene: Scene, shadowGenerator: ShadowGenerator, input? : PlayerInput) {
        super("player", scene);
        this.scene = scene;
        this.mesh = assets.mesh;
        this.mesh.parent = this;
        this._setupPlayerCamera();

        this.racket = (scene.getMeshByName("hand") as Mesh);
        this.hand_node = (scene.getNodeByName("hand_node") as TransformNode);
        shadowGenerator.addShadowCaster(assets.mesh, true);
        this._input = input;

        //const racketAggregate = new PhysicsAggregate(this.racket,
        //    PhysicsShapeType.BOX,
        //    {mass: 0, restitution: 1.2, friction: 0.5}, this.scene);
        //racketAggregate.body.setMotionType(PhysicsMotionType.ANIMATED);
    }

    private _updateFromControls() {
        this._moveDirection = new Vector3(this._input.horizontal, 0, this._input.vertical).normalize();
    }

    private _updateFromMouse() {
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