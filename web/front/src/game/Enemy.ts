import { AbstractMesh, Axis, Mesh, Quaternion, Scene, ShadowGenerator, TransformNode, Vector3 } from "@babylonjs/core";
import { NetworkManager } from "./NetworkManager";
import { GameState } from "./GameState";
import { CharacterAssets } from "./App";

export class Enemy extends TransformNode {
    private _mesh : AbstractMesh;
    private _racketNode : TransformNode;
    // private _newPos : Vector3;
    // private _newRackPos : Vector3;
    // private _newRackRot : Quaternion;
    private _gameState: GameState;
    private _sessionId: string;
    
    constructor(scene: Scene, assets: CharacterAssets, shadows: ShadowGenerator[], isNearSide: boolean, gameState: GameState, sessionId: string) {
        super("enemy", scene);
        this._gameState = gameState;
        this._sessionId = sessionId;
        this._mesh = assets.mesh;
        this._mesh.parent = this;
        this._racketNode = assets.racketNode;
        // this._newPos = this._mesh.position;
        // this._newRackPos = this._racketNode.position;
        this._racketNode.rotationQuaternion = Quaternion.FromEulerAngles(this._racketNode.rotation.x, this._racketNode.rotation.y, this._racketNode.rotation.z);
        // this._newRackRot = this._racketNode.rotationQuaternion;
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

    // public registerBody(newPos: Vector3) {
    //     this._newPos = newPos;
    // }

    public updateBody() {
        const newPos = this._gameState.players.get(this._sessionId).pos;
        this._mesh.position = Vector3.Lerp(this._mesh.position, newPos, 0.4);
    }

    // public registerRacket(newPos: Vector3, newRot: Quaternion) {
    //     this._newRackPos = newPos;
    //     this._newRackRot = newRot;
    // }

    public updateRacket() {
        const newPos = this._gameState.players.get(this._sessionId).rackPos;
        const newRot = this._gameState.players.get(this._sessionId).rackRot;
        this._racketNode.position = Vector3.Lerp(this._racketNode.position, newPos, 0.4);
        this._racketNode.rotationQuaternion = Quaternion.Slerp(this._racketNode.rotationQuaternion, newRot, 0.4);
    }
}