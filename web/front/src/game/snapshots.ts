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

    // public getSnapshotAtTick(targetTick: number) : {snapshot: BallSnapshot, index: number} {
    //     let left = 0;
    //     let right = this._snapshots.length - 1;

    //     while (left <= right) {
    //         const mid = Math.floor((left + right) / 2);
    //         const tick = this._snapshots[mid].tick;
    //         if (tick === targetTick) {
    //             //console.log("targetTick:", targetTick, "result:", this._snapshots[mid].tick, " found");
    //             return {snapshot: this._snapshots[mid], index: mid};
    //         }
    //         if (tick < targetTick) {
    //             left = mid + 1;
    //         } else {
    //             right = mid - 1;
    //         }
    //     }
    //     //console.log("targetTick:", targetTick, "result:", this._snapshots[right].tick, " not found");
    //     return ({snapshot: this._snapshots[right], index: right});
    // }

    public getSnapshotAtTickInterpolated(targetTick: number) : {snapshot: {tick: number, position: Vector3, velocity: Vector3}, index: number} {
        let left = 0;
        let right = this._snapshots.length - 1;

        if (this._snapshots.length === 0)
            return null;
        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            if (this._snapshots[mid].tick === targetTick) {
                return { snapshot: this._snapshots[mid], index: mid };
            }
            if (this._snapshots[mid].tick < targetTick) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        const leftIndex = right; //right has the highest value strictly inferior to targetTick
        const rightIndex = leftIndex + 1;
        if (leftIndex < 0) {
            return { snapshot: this._snapshots[0], index: 0 };
        }
        if (rightIndex >= this._snapshots.length) {
            return { snapshot: this._snapshots[this._snapshots.length - 1], index: this._snapshots.length - 1 };
        }
        const snapLeft = this._snapshots[leftIndex];
        const snapRight = this._snapshots[rightIndex];
        const tickRange = snapRight.tick - snapLeft.tick;
        const alpha = tickRange === 0 ? 0 : (targetTick - snapLeft.tick) / tickRange;
        const compositeSnapshot = {
            tick: targetTick,
            position: Vector3.Lerp(snapLeft.position, snapRight.position, alpha),
            velocity: Vector3.Lerp(snapLeft.velocity, snapRight.velocity, alpha)
        };
        return { snapshot: compositeSnapshot, index: rightIndex }; //we start correcting only at rightIndex
    }

    public getSnapshotAtTick(targetTick: number) : {snapshot: {tick: number, position: Vector3, velocity: Vector3}, index: number} {
        let left = 0;
        let right = this._snapshots.length - 1;

        if (this._snapshots.length === 0)
            return null;
        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            if (this._snapshots[mid].tick === targetTick) {
                return { snapshot: this._snapshots[mid], index: mid };
            }
            if (this._snapshots[mid].tick < targetTick) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        if (right == -1) {
            console.log("Snapshot of", targetTick, "is not stored");
            return null;
        }
        return { snapshot: this._snapshots[right], index: right };
    }

    public correctFollowingSnapshotsPos(error: Vector3, index: number) {
        for (let i = index; i < this._snapshots.length; i++) {
            this._snapshots[i].position.addInPlace(error);
        }
    }

    public correctFollowingSnapshotsVel(error: Vector3, index: number) {
        for (let i = index; i < this._snapshots.length; i++) {
            this._snapshots[i].velocity.addInPlace(error);
        }
    }

    public clearAfterTickIncluded(tick: number) {
        const snapshot = this.getSnapshotAtTick(tick);
        if (!snapshot)
            return ;
        const index = snapshot.index;
        this._snapshots.splice(index);
    }

    public dispose() {
        this._snapshots = [];
    }
}