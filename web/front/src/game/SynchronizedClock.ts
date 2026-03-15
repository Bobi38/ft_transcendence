export class SynchronizedClock {
    public tick : number = 0;
    public tickOffset : number = 0;
    private _offsets : number[] = [];
    private _MAX_OFFSETS : number = 20;

    constructor() {}

    public synchronizeClientWithServerClock(serverTick: number, t0: number) {
        const t1 = Date.now();
        //const latency = (t1 - t0) / 2;
        const latency = (t1 - t0);
        const serverTickNow = serverTick + Math.round(latency * 60 / 1000);
        const offset = serverTickNow - this.tick;
        this._offsets.push(offset);
        if (this._offsets.length > this._MAX_OFFSETS) {
            this._offsets.shift();
        }
        this.tickOffset = this._offsets.reduce((acc, curr) => acc + curr, 0) / this._offsets.length;
        // this.tickOffset = Math.round(this._offsets.reduce((acc, curr) => acc + curr, 0) / this._offsets.length);
        //console.log("latency:", latency.toString(), "offset:", offset.toString(), "average offset:", this.tickOffset.toString());
    }
}