import { ActionManager, Axis, ExecuteCodeAction, Plane, Quaternion, Scalar, Scene, TransformNode, UniversalCamera, Vector2, Vector3} from "@babylonjs/core";
import { PlayerCamera } from "./PlayerCamera";

export class PlayerInput {
    private _moveDirection : Vector3 = Vector3.Zero();
    private _newRacketPos : Vector3 = Vector3.Zero();
    private _newRacketRot : Quaternion = Quaternion.Identity();

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
        let horizontal = Vector3.Zero();

        if (this._inputMap["ArrowLeft"]) {
            horizontal = Vector3.Lerp(horizontal, new Vector3(1,0,0), 0.2);
        } else if (this._inputMap["ArrowRight"]) {
            horizontal = Vector3.Lerp(horizontal, new Vector3(-1,0,0), 0.2);
        } else {
            horizontal = Vector3.Zero();
        }

        if (this._camera.getUniversalCamera().getForwardRay().direction._z > 0) {
            horizontal.scaleInPlace(-1);
        }
        this._moveDirection = horizontal;//.normalize();
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

        const normal = this._camera.getUniversalCamera().getForwardRay().direction;
        // const normal = this._handNode.forward;
        const position = this._handNode.getAbsolutePosition().add(normal.scale(3));
        //console.log(this._handNode.getAbsolutePosition(), position, normal);
        const plane = Plane.FromPositionAndNormal(position, normal);
        const ray = this._scene.createPickingRay(this._scene.pointerX, this._scene.pointerY,
            null, this._camera.getUniversalCamera());
        const distance = ray.intersectsPlane(plane);
        if (distance) {
            const worldPointerPos : Vector3 = ray.origin.add(ray.direction.scale(distance));
            const invertedWorldMatrix = this._handNode.computeWorldMatrix(true).clone().invert();
            const localPointerPos = Vector3.TransformCoordinates(worldPointerPos, invertedWorldMatrix);
            const localHandPos = Vector3.TransformCoordinates(this._handNode.absolutePosition, invertedWorldMatrix);
            const relativePos : Vector3 = localPointerPos.subtract(localHandPos);

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
            if (movementDir.lengthSquared() < 0.001)
            {
                const oldZ = Vector3.Forward;
                localAxisX = Vector3.Cross(localAxisY, Vector3.RightHandedForwardReadOnly);
            }
            else {
                localAxisX = Vector3.Cross(localAxisY, movementDir);
            }
            if (localAxisX.lengthSquared() < 0.001) {
                localAxisX = Vector3.Cross(localAxisY, new Vector3(0,1,0));
                if (localAxisX.lengthSquared() < 0.001) {
                    localAxisX = Vector3.Cross(localAxisY, new Vector3(1,0,0));
                }
            }
            localAxisX.normalize();
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