import { Mesh, Quaternion, Scene, ShadowGenerator, TransformNode, Vector3 } from "@babylonjs/core";
import { Bot } from "./Bot";
import { Ball } from "./ball";

export class Enemy extends TransformNode {
    private _mesh : Mesh;
    private _input : Bot;
    private _racketNode : TransformNode;
    private _newPos : Vector3;
    private _newRackPos : Vector3;
    private _newRackRot : Quaternion;
    
    constructor(scene: Scene, assets, shadows: ShadowGenerator[], ball: Ball) {
        super("enemy", scene);
        this._mesh = assets.mesh;
        this._mesh.parent = this;
        this._racketNode = assets.racketNode;
        this._newPos = this._mesh.position;
        this._newRackPos = this._racketNode.position;
        this._racketNode.rotationQuaternion = Quaternion.FromEulerAngles(this._racketNode.rotation.x, this._racketNode.rotation.y, this._racketNode.rotation.z);
        this._newRackRot = this._racketNode.rotationQuaternion;
        this._input = new Bot(scene, ball, assets.handNode, this._racketNode);
        shadows[0].addShadowCaster(this._mesh, true);
        shadows[1].addShadowCaster(this._mesh, true);
        shadows[0].usePercentageCloserFiltering = true;
        shadows[1].usePercentageCloserFiltering = true;
        shadows[0].filteringQuality = ShadowGenerator.QUALITY_MEDIUM;
        shadows[1].filteringQuality = ShadowGenerator.QUALITY_MEDIUM;
        shadows[0].useContactHardeningShadow = true;
        shadows[1].useContactHardeningShadow = true;
        shadows[0].contactHardeningLightSizeUVRatio = 0.05;
        shadows[1].contactHardeningLightSizeUVRatio = 0.05;
    }

    public updateBody() {
        this._mesh.moveWithCollisions(this._input.getMoveDirection());
        //this._mesh.position = ;
    }

    public updateRacket() {
        this._racketNode.position = this._input.getNewRacketPos();
        this._racketNode.rotationQuaternion = this._input.getNewRacketRot();
    }
}