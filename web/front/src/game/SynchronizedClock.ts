export class SynchronizedClock {
    public tick : number = 0;
    public tickOffset : number = 0;
    private _offsets : number[] = [];
    private _MAX_OFFSETS : number = 20;

    private _accumulator : number = 0;
    private _accumulatorSlew : number = 0;
    private _ADAPTIVE_RATE : number = 8;
    private _TARGET_TICK_OFFSET : number = 6;
    public tickSkipped : boolean = false;

    constructor() {}

    public setInitialClientClock(serverTick: number) {
        this.tick = serverTick + this._TARGET_TICK_OFFSET + 10;
        console.log("server tick:", serverTick, "client tick:", this.tick);
    }

    public updateAccumulator(dt: number) {
        // console.log("dt:", dt);
        //this._accumulator += (dt - 1000/60 + this._accumulatorSlew);
        this._accumulator += (dt + this._accumulatorSlew);
        this._accumulatorSlew = 0;
    }

    public getAccumulator() : number {
        return this._accumulator;
    }

    public setbackAccumulator() {
        this._accumulator -= 1000/60;
    }

    public addbackAccumulator() {
        this._accumulator += 1000/60;
    }

    public updateAccumulatorSlew(patchTick : number) {
        const tickError = this.tick - patchTick - this._TARGET_TICK_OFFSET;
        this._accumulatorSlew -= tickError * this._ADAPTIVE_RATE;
        // console.log("tick:", this.tick, "patch tick:", patchTick, "tickError:", tickError, "slew:", this._accumulatorSlew);
    }
}