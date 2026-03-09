export class Player{
    constructor(socket, id) {
        this._nick_name = null;
        this._turn_timer = null;
        this._nb_turn = 0;
        this._play_time = 0;
        this._socket = socket;
        this._id = id;
        this._prev_data = {};
    }

    isConnected() {
        return this._socket && this._socket.readyState === 1;
    }

    refreshSocket(socket){
        this._socket = socket;
        this.send();
    }

    send(data) {
        if (!this._socket || this._socket.readyState !== 1) return;

        if (data === undefined) {
            data = this._prev_data;
            if (!data) return;
        } else {
            this._prev_data = structuredClone(data);
        }

        try {
            const payload =
                typeof data === "string"
                    ? { message: data }
                    : data;

            this._socket.send(JSON.stringify({
                type: "game",
                ...payload
            }));
        } catch (err) {
            console.error("WebSocket player.send error:", err);
        }
    }

    disconnect(message) {
        this.clearTurnTimer();

        if (message)
            this.send(message);
    }

    toString(){
        return this._nick_name;
    }

    getId(){
        return this._id;
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
            nb_turn: this._nb_turn
         });
    }
}