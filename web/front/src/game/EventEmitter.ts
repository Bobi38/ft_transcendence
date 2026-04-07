type Callback = (...args: any[]) => void;

export class EventEmitter {
    private _events: Record<string, Callback[]> = {};

    public on(event: string, callback: Callback): void {
        if (!this._events[event]) {
            this._events[event] = [];
        }
        this._events[event].push(callback);
    }

    public off(event: string, callback: Callback): void {
        if (!this._events[event]) return;
        this._events[event] = this._events[event].filter(cb => cb !== callback);
    }

    public emit(event: string, ...args: any[]): void {
        if (!this._events[event]) return;
        this._events[event].forEach(callback => callback(...args));
    }
}