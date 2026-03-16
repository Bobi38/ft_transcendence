import StatMorp from "../models/StatMorp.js";

export class Player {
    constructor(socket) {
        this._nick_name = null;
        this._turn_timer = null;
        this._nb_turn = 0;
        this._play_time = 0;
        this._game = null;
        this._sockets = new Map([[socket.id, socket]]);
        this._id = socket.userId;
        this._prev_data = {};
        this._chrono = null;
        this.first_alert = 0;
    }

    // isAlive() { // non utiliser
    //     return this._socket && this._socket.readyState === 1;
    // }

    // refreshSocket(socket){ // a changer (probalbement remplacer par addSocket)
    //     this._socket = socket;
    //     this.send();
    // }

    addSocket(socket){
        this._sockets.set(socket.id, socket);

        console.log(`player are ${this._sockets.size} sockets`)
        for (const [id, s] of this._sockets) {
            if (!s.isAlive){
                this._sockets.delete(id);
            }
        }
        console.log(`player are ${this._sockets.size} sockets`)
        this.send();
    }

    setGame(game){
        if (!game?.getId()) return;
        console.log(`player register in ${game.getId()}`);
        this._game = game;
    }

    getGame(){
        return this._game;
    }

    send(data) {

        if (data === undefined) {
            data = this._prev_data;
            if (!data) return;
        } else {
            this._prev_data = structuredClone(data);
        }

        const payload =
            typeof data === "string"
                ? { message: data }
                : data;

        const all  = JSON.stringify({
                type: "game",
                ...payload
            });

        // console.log("JSON envoyé au client:", all);

        for (const socket of this._sockets.values()){
            try {
                // console.log(`ready state = ${socket?.readyState}`);
                if (socket?.readyState === 1)
                    socket.send(all);
            } catch (err) {
                console.error("WebSocket player.send error:", err);
            }
        }
    }

    disconnect(message) {
        if (message)
            this.send(message);

        this.clearTurnTimer();
        this._chrono = null;
        this._nb_turn = 0;
        this._play_time = 0;
        this._game = null;
        this.first_alert = 0;
    }

    toString(){
        console.log(`definition de player`);
        // return `${this._id} : ${this._nick_name} play ${this._game?.getId()}`;
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

    stopChrono(){
        const now = Date.now();

        if (this._chrono !== null) {
            const timeTour = now - this._chrono;
            this.setPlayTime(timeTour);
        }

        this._chrono = now;
    }


    startTurnTimer(alertAction, millisec) {
        this.clearTurnTimer();
        this._turn_timer = setTimeout(alertAction, millisec);
    }

    firstAlert() {
        if (!this.firstAlert) return;

        const delay = Math.max(0, Date.now() + this.firstAlert - this._chrono);

        this.startTurnTimer(
            () => this.send({ message: "dépêche toi" }),
            delay
        );
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


    async majdb(how_win, type_player , type_winner = null) {
        
        const how_win_check = ["draw", "abort", "horizontal", "vertical", "diagonal"];
        const type_player_check = ["X", "O"];

        if (!how_win_check.includes(how_win) || !type_player_check.includes(type_player)) {
            throw new Error("Invalid params");
        }

        const data = {total_game: 1, time_played: this._play_time, nb_turn_played: this._nb_turn};

        if (how_win === 'draw'){
            data[`type_${type_player}_draw`] = 1;
        } else {
            data[`type_${type_player}_${how_win}_${type_winner}`] = 1;
        }

        const userstat = await StatMorp.findOne({where: {idUser: this._id}});
        await userstat.increment(data);

    }
}