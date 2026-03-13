import { Vector3 } from "@babylonjs/core";

export interface BallSnapshot {
  tick: number;
  position: Vector3;
  velocity: Vector3;
}

export class SnapshotBuffer {
    private _snapshots : BallSnapshot[] = [];
    private _MAX_SNAPSHOTS : number = 300;

    constructor() {}

    public saveSnapshot(tick: number, position: Vector3, velocity: Vector3) {
        this._snapshots.push({tick: tick, position: position, velocity: velocity});
        if (this._snapshots.length > this._MAX_SNAPSHOTS) {
            this._snapshots.shift();
        }
    }

    public getSnapshotAtTick(targetTick: number) : {snapshot: BallSnapshot, tick: number} {
        let left = 0;
        let right = this._snapshots.length - 1;

        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            const tick = this._snapshots[mid].tick;
            if (tick === targetTick) {
                //console.log(targetTick, this._snapshots[mid].tick, left, right, " found");
                return {snapshot: this._snapshots[mid], tick: mid};
            }
            if (tick < targetTick) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        //console.log(targetTick, this._snapshots[right].tick, left, right, " not found");
        return ({snapshot: this._snapshots[right], tick: right});
    }

    public correctFollowingSnapshotsPos(error: Vector3, tick: number) {
        for (let i = tick; i < this._snapshots.length; i++) {
            this._snapshots[i].position.addInPlace(error);
        }
    }

    public correctFollowingSnapshotsVel(newVel: Vector3, tick: number) {
        for (let i = tick; i < this._snapshots.length; i++) {
            this._snapshots[i].velocity = newVel;
        }
    }
}