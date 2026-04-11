import { Vector3, Quaternion, TransformNode, Scene, AbstractMesh } from "@babylonjs/core";
import { EventEmitter } from "./EventEmitter";
import { BallSnapshot } from "../utils/Snapshots";
import { Ball } from "../physics/Ball";
import { Environment } from "../physics/Environment";
import { RoomStatus } from "../App";

export interface GameSession extends EventEmitter {
    initialize() : Promise<void>;
    sendRacketImpact(ballState: BallSnapshot) : void;
    sendUpdateBody(pos: Vector3) : void;
    sendUpdateRacket(rackPos: Vector3, rackRot: Quaternion) : void;
    emitGoalScored(teamNearScored: boolean) : void;
    setupEnemy(scene: Scene, ball: Ball, body: AbstractMesh, handNode: TransformNode, racketNode: TransformNode, env: Environment): void;
    setVoluntaryLeave() : void;
    refreshGameState() : void;
    setGameState(state: RoomStatus) : void;
    update(): void;
    leave(): Promise<void>;
    dispose() : void;
}