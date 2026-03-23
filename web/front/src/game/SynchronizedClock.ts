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

    // public synchronizeClientWithServerClock(serverTick: number, t0: number) {
    //     const t1 = Date.now();
    //     //const latency = (t1 - t0) / 2;
    //     const latency = (t1 - t0);
    //     const serverTickNow = serverTick + Math.round(latency * 60 / 1000);
    //     const offset = serverTickNow - this.tick;
    //     this._offsets.push(offset);
    //     if (this._offsets.length > this._MAX_OFFSETS) {
    //         this._offsets.shift();
    //     }
    //     this.tickOffset = this._offsets.reduce((acc, curr) => acc + curr, 0) / this._offsets.length;
    //     // this.tickOffset = Math.round(this._offsets.reduce((acc, curr) => acc + curr, 0) / this._offsets.length);
    //     //console.log("latency:", latency.toString(), "offset:", offset.toString(), "average offset:", this.tickOffset.toString());
    // }
    public setInitialClientClock(serverTick: number) {
        this.tick = serverTick + this._TARGET_TICK_OFFSET + 10;
        console.log("server tick:", serverTick, "client tick:", this.tick);
    }

    public updateAccumulator(dt: number) {
        // console.log("dt:", dt);
        this._accumulator += (dt - 1000/60 + this._accumulatorSlew);
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
        console.log("tick:", this.tick, "patch tick:", patchTick, "tickError:", tickError, "slew:", this._accumulatorSlew);
    }
}