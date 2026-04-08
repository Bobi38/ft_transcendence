import { AbstractMesh, Matrix, Quaternion, Scene, ShadowGenerator, TransformNode, Vector3 } from "@babylonjs/core";
import { GameState } from "./GameState";
import { CharacterAssets } from "./App";
import { Character } from "./Character";

export class Enemy extends TransformNode implements Character {
    private _mesh : AbstractMesh;
    private _racketNode : TransformNode;
    private _gameState: GameState;
    private _sessionId: string;
    
    constructor(scene: Scene, assets: CharacterAssets, shadows: ShadowGenerator[], isNearSide: boolean, gameState: GameState, sessionId: string) {
        super("enemy", scene);
        this._gameState = gameState;
        this._sessionId = sessionId;
        this._mesh = assets.mesh;
        this._mesh.parent = this;
        this._racketNode = assets.racketNode;
        this._racketNode.rotationQuaternion = Quaternion.FromEulerAngles(this._racketNode.rotation.x, this._racketNode.rotation.y, this._racketNode.rotation.z);
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
        const newPos = this._gameState.players.get(this._sessionId).pos;
        //const oldPos = this._mesh.position.clone();
        //const moveDirection = newPos.subtract(oldPos);
        //this._mesh.moveWithCollisions(moveDirection);
        this._mesh.position = Vector3.Lerp(this._mesh.position, newPos, 0.4);
    }

    public updateRacket() {
        const newPos = this._gameState.players.get(this._sessionId).rackPos;
        const newRot = this._gameState.players.get(this._sessionId).rackRot;
        this._racketNode.position = Vector3.Lerp(this._racketNode.position, newPos, 0.4);
        this._racketNode.rotationQuaternion = Quaternion.Slerp(this._racketNode.rotationQuaternion, newRot, 0.4);
    }

    public getRacketHit(): Vector3 {
        const hitForward = new Vector3(0,0,-1).scale(2);
        const hitDirection = this._gameState.players.get(this._sessionId).rackSwing;
        return new Vector3(hitDirection.x, hitDirection.y, 0).add(hitForward).normalize().scale(20);
    }

    public getRacketWorldMatrix(): Matrix {
        this._racketNode.computeWorldMatrix(true);
        return this._racketNode.getWorldMatrix().clone();
    }
}