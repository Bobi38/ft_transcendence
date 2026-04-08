import { Vector3, Quaternion, TransformNode, Scene, AbstractMesh } from "@babylonjs/core";
import { EventEmitter } from "./EventEmitter";
import { BallSnapshot } from "./Snapshots";
import { Ball } from "./Ball";
import { Environment } from "./Environment";

export interface GameSession extends EventEmitter {
    initialize() : Promise<void>;
    sendRacketImpact(ballState: BallSnapshot) : void;
    sendUpdateBody(pos: Vector3) : void;
    sendUpdateRacket(rackPos: Vector3, rackRot: Quaternion) : void;
    emitGoalScored(teamNearScored: boolean) : void;
    setupEnemy(scene: Scene, ball: Ball, body: AbstractMesh, handNode: TransformNode, racketNode: TransformNode, env: Environment): void;
    update(): void;
    leave(): Promise<void>;
    dispose() : void;
}