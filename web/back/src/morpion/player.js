export class Player{
    constructor(socket, id) {
        this._nickName = null;
        this._turnTimer = null;
        this._nbTurn = 0;
        this._playTime = 0;
        this._socket = socket;
        this._id = id;
    }


    isConnected() {
        return this._socket && this._socket.readyState === 1;
    }

    send(data = {}) {
        if (!this._socket || this._socket.readyState !== 1) return;

        try {
            this._socket.send(JSON.stringify({
                type: "room",
                ...data
            }));
        } catch (err) {
            console.error("WebSocket send error:", err);
        }
    }

    toString(){
        return this._nickName;
    }

    getId(){
        return this._id;
    }

    disconnect(message) {
        this.clearTimeout();

        if (message)
            this.send(message);
    }

    clearTurnTimer() {
        if (this._turnTimer) {
            clearTimeout(this._turnTimer);
            this._turnTimer = null;
        }
    }

    startTurnTimer(alertAction, millisec) {
        this.clearTurnTimer();
        this._turnTimer = setTimeout(alertAction, millisec);
    }

    setPlayTime(millisec){
        if (millisec > 0){
            this._playTime += millisec;
            this._nbTurn++;
        }
    }

    getPlayTime(){
        return this._playTime;
    }

    getData(){
        return ({
            id: this._id,
            time: this._playTime,
            nbTurn: this._nbTurn
         });
    }
}