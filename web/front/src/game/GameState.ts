import { Quaternion, Vector3 } from "@babylonjs/core";
import { RoomStatus } from "./App"

export interface PlayerState {
    isPlayer: boolean;
    pos: Vector3;
    rackPos: Vector3;
    rackRot: Quaternion;
    sideNear: boolean;
    connected: boolean;
}

export class GameState {
    public ballPos: Vector3;
    public ballVel: Vector3;
    public ballTickStamp: number;
    public gameStatus: RoomStatus = RoomStatus.WAITING;
    public teamNear: number = 0;
    public teamFar: number = 0;
    public players: Map<string, PlayerState> = new Map();

    constructor () {}
}