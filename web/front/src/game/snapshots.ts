import { Vector3 } from "@babylonjs/core";

export interface BallSnapshot {
  tick: number;
  position: Vector3;
  velocity: Vector3; //TODO: remove saving of velocity
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

    public getSnapshotAtTick(targetTick: number) : {snapshot: BallSnapshot, index: number} {
        let left = 0;
        let right = this._snapshots.length - 1;

        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            const tick = this._snapshots[mid].tick;
            if (tick === targetTick) {
                //console.log("targetTick:", targetTick, "result:", this._snapshots[mid].tick, " found");
                return {snapshot: this._snapshots[mid], index: mid};
            }
            if (tick < targetTick) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        //console.log("targetTick:", targetTick, "result:", this._snapshots[right].tick, " not found");
        return ({snapshot: this._snapshots[right], index: right});
    }

    public correctFollowingSnapshotsPos(error: Vector3, index: number) {
        for (let i = index; i < this._snapshots.length; i++) {
            this._snapshots[i].position.addInPlace(error);
        }
    }

    public correctFollowingSnapshotsVel(newVel: Vector3, index: number) {
        for (let i = index; i < this._snapshots.length; i++) {
            this._snapshots[i].velocity = newVel;
        }
    }
}