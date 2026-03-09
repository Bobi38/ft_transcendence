import { ActionManager, Axis, ExecuteCodeAction, Plane, Quaternion, Scalar, Scene, TransformNode, UniversalCamera, Vector2, Vector3} from "@babylonjs/core";
import { PlayerCamera } from "./PlayerCamera";

export class PlayerInput {
    private _moveDirection : Vector3;
    private _newRacketPos : Vector3;
    private _newRacketRot : Quaternion;

    private _inputMap;
    private _scene: Scene;
    private _camera: PlayerCamera;
    private _handNode: TransformNode;
    private _racket: TransformNode;

    public mouseSpeedBuffer : number[] = [];
    public mouseBufferSize: number = 5;
    public prevMousePos = Vector2.Zero();
    public mouseDirBuffer : Vector2[] = [];

    constructor(scene: Scene, camera: PlayerCamera, handNode: TransformNode, racket: TransformNode) {
        this._scene = scene;
        this._camera = camera;
        this._handNode = handNode;
        this._racket = racket;

        scene.actionManager = new ActionManager(scene);
        this._inputMap = {};
        scene.actionManager.registerAction
            (new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, (evt) => {
            this._inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
        }));
        scene.actionManager.registerAction
            (new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, (evt) => {
            this._inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
        }));
        scene.onBeforeRenderObservable.add(() => {
            this._inputBody();
            this._inputRacket();
        })
    }

    private _inputBody() {
        let vertical = 0;
        let horizontal = 0;

        if (this._inputMap["ArrowUp"]) {
            vertical = Scalar.Lerp(vertical, 1, 0.2);
        } else if (this._inputMap["ArrowDown"]) {
            vertical = Scalar.Lerp(vertical, -1, 0.2);
        } else {
            vertical = 0;
        }

        if (this._inputMap["ArrowLeft"]) {
            horizontal = Scalar.Lerp(horizontal, -1, 0.2);
        } else if (this._inputMap["ArrowRight"]) {
            horizontal = Scalar.Lerp(horizontal, 1, 0.2);
        } else {
            horizontal = 0;
        }
        this._moveDirection = new Vector3(horizontal, 0, vertical).normalize();
    }

    private _inputRacket() {
        const mousePos = new Vector2(this._scene.pointerX, this._scene.pointerY);
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
        const ray = this._scene.createPickingRay(this._scene.pointerX, this._scene.pointerY,
            null, this._camera.getUniversalCamera());
        const distance = ray.intersectsPlane(plane);
        if (distance) {
            const worldPointerPos : Vector3 = ray.origin.add(ray.direction.scale(distance));
            const relativePos : Vector3 = worldPointerPos.subtract(this._handNode.absolutePosition);

            const maxRadius = 5;
            if (relativePos.length() > maxRadius) {
                relativePos.normalize().scaleInPlace(maxRadius);
                //relativePos.normalize().multiplyInPlace(new Vector3(3.5,3.5,3.5));
            }
            else {
                relativePos.normalize().scaleInPlace(maxRadius);
            }
            const oldPos = this._racket.position;
            this._newRacketPos = relativePos;

            const localAxisY = relativePos.clone().normalize(); 
            let movementDir = relativePos.subtract(oldPos);
            let localAxisX : Vector3;
            if (movementDir.length() < 0.01)
            {
                const oldZ = this._racket.getDirection(Axis.Z);
                localAxisX = Vector3.Cross(localAxisY, oldZ).normalize();
            }
            else {
                localAxisX = Vector3.Cross(localAxisY, movementDir).normalize();
            }
            const localAxisZ = Vector3.Cross(localAxisX, localAxisY).normalize();
            const targetRotation = Quaternion.RotationQuaternionFromAxis(localAxisX, localAxisY, localAxisZ);

            if (!this._racket.rotationQuaternion) {
                this._newRacketRot = targetRotation;
            } else {
                this._newRacketRot = Quaternion.Slerp(this._racket.rotationQuaternion, targetRotation, 0.3);
            }
        }
    }

    public getMoveDirection() : Vector3 {
        return this._moveDirection.clone();
    }

    public getNewRacketPos() : Vector3 {
        return this._newRacketPos.clone();
    }

    public getNewRacketRot() : Quaternion {
        return this._newRacketRot.clone();
    } 
}