export class Player{
    constructor(socket, id) {
        this._nick_name = null;
        this._turn_timer = null;
        this._nb_turn = 0;
        this._play_time = 0;
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
        return this._nick_name;
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
        if (this._turn_timer) {
            clearTimeout(this._turn_timer);
            this._turn_timer = null;
        }
    }

    startTurnTimer(alertAction, millisec) {
        this.clearTurnTimer();
        this._turn_timer = setTimeout(alertAction, millisec);
    }

    setPlayTime(millisec){
        if (millisec > 0){
            this._play_time += millisec;
            this._nb_turn++;
        }
    }

    getPlayTime(){
        return this._play_time;
    }

    getData(){
        return ({
            id: this._id,
            time: this._play_time,
            nbTurn: this._nb_turn
         });
    }
}