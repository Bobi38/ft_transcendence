import { Axis, Mesh, Quaternion, Scene, ShadowGenerator, TransformNode, Vector3 } from "@babylonjs/core";

export class Enemy extends TransformNode {
    private _mesh : Mesh;
    private _racketNode : TransformNode;
    private _newPos : Vector3;
    private _newRackPos : Vector3;
    private _newRackRot : Quaternion;
    private _isNearSide : boolean;
    
    constructor(scene: Scene, assets, shadow: ShadowGenerator, isNearSide: boolean) {
        super("enemy", scene);
        this._mesh = assets.mesh;
        this._racketNode = assets.racketNode;
        this._newPos = this._mesh.position;
        this._newRackPos = this._racketNode.position;
        this._racketNode.rotationQuaternion = Quaternion.FromEulerAngles(this._racketNode.rotation.x, this._racketNode.rotation.y, this._racketNode.rotation.z);
        this._newRackRot = this._racketNode.rotationQuaternion;
        this._isNearSide = isNearSide;
        shadow.addShadowCaster(this._mesh, true);
    }

    public registerBody(newPos: Vector3) {
        this._newPos = newPos;
    }

    public updateBody() {
        this._mesh.position = Vector3.Lerp(this._mesh.position, this._newPos, 0.4);
    }

    public registerRacket(newPos: Vector3, newRot: Quaternion) {
        //body.rotation = new Vector3(0,Math.PI,0);
        this._newRackPos = newPos;
        this._newRackRot = newRot;
    }

    public updateRacket() {
        this._racketNode.position = Vector3.Lerp(this._racketNode.position, this._newRackPos, 0.4);
        this._racketNode.rotationQuaternion = Quaternion.Slerp(this._racketNode.rotationQuaternion, this._newRackRot, 0.4);
        // if (!this._isNearSide) {
        //     this._racketNode.position.multiplyInPlace(new Vector3(1,-1,1));
        //     this._racketNode.rotationQuaternion._x *= -1;
        //     this._racketNode.rotationQuaternion._z *= -1;
        // }
    }
}