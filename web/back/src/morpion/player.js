import User from '../models/user.js'; 
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
        this._last_message = "";
        this._chrono = null;
        this.first_alert = 0;
        this._time_refresh_name = 0;
        this._time_last_active = 0;
        this.list = null;
    }

    sendGame(data = {}) {
        const payload = {
            type: "game",
            ...data
        };

        if (this._game) {
            payload.board = structuredClone(this._game._board);
        }

        if (this._obs_game) {
            payload.other_board = structuredClone(this._obs_game._board);
            payload.players = this._obs_game.players;
        }

        const json = JSON.stringify(payload);

        for (const socket of this._sockets.values()) {
            if (socket?.readyState === 1) {
                socket.send(json);
            }
        }
    }

    sendMessage(msg) {
        if (msg !== undefined) {
            this._last_message = msg;
        }

        const payload = {
            type: "message",
            message: this._last_message
        };

        const json = JSON.stringify(payload);

        for (const socket of this._sockets.values()) {
            if (socket?.readyState === 1) {
                socket.send(json);
            }
        }
    }

    buildPayload(data) {
        let payload = {};

        if (typeof data === "string") {
            this.message = data;
            payload.message = data;
        }

        else if (data) {
            if (data.message) {
                this.message = data.message;
            }
            payload = { ...data };
        }

        if (!payload.message && this._message) {
            payload.message = this._message;
        }

        if (this.list) {
            payload.list = structuredClone(this.list);
        }

        if (this._game) {
            payload.board = structuredClone(this._game._board);
        }

        if (this._obs_game) {
            payload.other_board = structuredClone(this._obs_game._board);
            payload.players = this._obs_game.players;
        }

        return payload;
    }

    addSocket(socket){
        this._sockets.set(socket.id, socket);
        this._time_last_active = Date.now();

        console.log(`player are ${this._sockets.size} sockets`)
        for (const [id, s] of this._sockets) {
            if (!s.isAlive){
                this._sockets.delete(id);
            }
        }
        console.log(`add socket player are ${this._sockets.size} sockets`)
        this.send();
    }

    isInactived(){
        console.log(`pour verif timeOOOut player`);
        if (this._time_last_active + 30000 < Date.now())
            return false;
        console.log("time out 30s for eval");

        return true;
    }

    setGame(game){
        if (!game?.getId()) return;

        console.log(`start ${game.getId()}`);
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
                players: null,
                other_board: Array(9).fill(" ")
            })
    }

    sendObs() {
        console.log("observation de ", this.getName());
        if (!this._obs_game) {
            // this._obs_game = this._game;
            return ;
        }
        console.log("observation .....");
        
        const all = JSON.stringify({
                players: this._obs_game.getPlayers(),
                other_board: this._obs_game._board,
            });

        console.log(all)

        for (const socket of this._sockets.values()){
            try {
                // console.log(`ready state = ${socket?.readyState}`);
                if (socket?.readyState === 1)
                    socket.send(all);
            } catch (err) {
                console.error("WebSocket player.send error:", err);
            }
        }
        // console.log(all);
    }

    sendList() {
        const all = JSON.stringify({
            list: structuredClone(this.list),
        });
        console.log(`list recu`, all);

        for (const socket of this._sockets.values()){
            try {

                if (socket?.readyState === 1)
                    socket.send(all);
            } catch (err) {
                console.error("WebSocket player.send error:", err);
            }
        }
    }

    getGame(){
        return this._game;
    }

    saveMessage(data) {
        const payload =
            typeof data === "string"
                ? { message: data }
                : data;
        Object.assign(this._prev_data, payload);
    }

    send(data) {
        console.log(`${this.getName()} doit recevoir data :${JSON.stringify(data)}`);
        if (data === undefined){
            console.log(`data indefini`);
            this.sendObs();
            return ; //plus tard je referais cette partie
        }
        
        const new_message =
            typeof data === "string"
                ? data
                : data?.message;

        if (new_message !== undefined) {
            this._last_message = new_message;
        }
        const all = JSON.stringify({
                ...data,
                message: this._last_message,
        });

        for (const socket of this._sockets.values()){
            try {
  
                if (socket?.readyState === 1)
                    socket.send(all);
            } catch (err) {
                console.error("WebSocket player.send error:", err);
            }
        }
        // console.log(all);
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
        return `${this._nick_name} play ${this._game?.getId()}`;
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

    static async create(socket){
        const player = new Player(socket);
        const time = Date.now()
        
        player.refreshName(time);
        player._time_last_active = time;

        return player;
    }

    async refreshName(time){
        const ll = await User.findByPk(this._id);
        this._time_refresh_name = time;
        this._nick_name = ll.name        
    }

    getName(){
        return this._nick_name;
        const time = Date.now();

        if (this._nick_name && time - 5000 < this._time_refresh_name)
            return this._nick_name;

        this.refreshName(time);

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
        this.disconnect();
    }
}