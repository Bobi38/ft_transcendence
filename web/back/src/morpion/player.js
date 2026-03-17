
import StatMorp from "../models/StatMorp.js";

export class Player {
    constructor(socket) {
        this._nick_name = null;
        this._turn_timer = null;
        this._nb_turn = 0;
        this._play_time = 0;
        this._game = null;
        this._obs_game = null;
        this._sockets = new Map([[socket.id, socket]]);
        this._id = socket.userId;
        this._prev_data = {};
        this._chrono = null;
        this.first_alert = 0;
        this._time_refresh_name = 0;
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

        this._nick_name = this._id === 5 ? "gros batard" : "toto";// attention dev devops devel

        console.log(`player register in ${game.getId()}`);
        this.clearTurnTimer();
        this._game = game;
        this._chrono = null;
        this._nb_turn = 0;
        this._play_time = 0;
        this.first_alert = 0;
    }

    setObs(game){
        if (this._obs_game === game) return;
        
        if (this._obs_game)
            this._obs_game.removeObs(this);

        this._obs_game = game;
    }

    removeObs(obs){
        this._players.delete(obs);

        obs.setObs(null)
        if (this._type === "Morpion")
            obs.send({
                players: "",
                other_board: Array(9).fill(" ")
            })
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
        console.log(data);
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
        // console.log(`definition de player`);
        return `${this._id} : ${this._nick_name} play ${this._game?.getId()}`;
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

    getName(){
        return this._nick_name;
    }

    oldgetName(){
        const time = Date.now();

        if (time - 20000 < this._time_refresh_name)
            return this._nick_name;

        console.log(`faire le fecth ici`);
        return this._nick_name;
    }

    async majdb(how_win, type_player , type_winner = null) {
        
        const how_win_check = ["draw", "abort", "horizontal", "vertical", "diagonal"];
        const type_player_check = ["X", "O"];

        if (how_win === "diagonal_rl" || how_win === "diagonal_lr")
            how_win = "diagonal"

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