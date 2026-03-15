import { Vector3, Quaternion } from "@babylonjs/core";

export interface RacketState {
    position: Vector3;
    rotation: Quaternion;
}

export class RacketHistory {
    private _states: Map<number, RacketState> = new Map();
    private _maxHistory: number = 200;

    public record(tick: number, position: Vector3, rotation: Quaternion) {
        this._states.set(tick, {
            position: position.clone(),
            rotation: rotation.clone()
        });
        if (this._states.size > this._maxHistory) {
            const oldestTick = tick - this._maxHistory;
            this._states.delete(oldestTick);
        }
    }

    public get(tick: number): RacketState | undefined {
        return this._states.get(tick);
    }
}