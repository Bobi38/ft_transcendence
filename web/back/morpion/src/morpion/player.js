import User from '../models/user.js'; 
import StatMorp from "../models/StatMorp.js";

export class Player {
    constructor(socket) {
        this._nickName = null;
        this._turnTimer = null;
        this._nbTurn = 0;
        this._playTime = 0;
        this._game = null;
        this._obsGame = null;
        this._sockets = new Map([[socket.id, socket]]);
        this._id = socket.userId;
        this._prevData = {};
        this._lastMessage = "";
        this._chrono = null;
        this.firstAlert = 0;
        this._timeRefreshName = 0;
        this._timeLastActive = 0;
        this.list = null;
    }

    sendGame(data = {}) {
        let payload = {}

        if (data !== undefined) {
            payload.message = this._lastMessage;
        }
        else if (typeof data === "string") {
            this.message = data;
            payload.message = data;
        }
        else {
            payload.message = data.message;
        }

        if (this._game) {
            payload.board = structuredClone(this._game._board);
        }

        if (this._obsGame) {
            payload.other_board = structuredClone(this._obsGame._board);
            payload.players = this._obsGame.getPlayers();
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
            this._lastMessage = msg;
        }

        const payload = {
            type: "message",
            message: this._lastMessage
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

        if (!payload.message && this._lastMessage) {
            payload.message = this._lastMessage;
        }

        if (this.list) {
            payload.list = structuredClone(this.list);
        }

        if (this._game) {
            payload.board = structuredClone(this._game._board);
        }

        if (this._obsGame) {
            payload.other_board = structuredClone(this._obsGame._board);
            payload.players = this._obsGame.players;
        }

        return payload;
    }

    addSocket(socket){
        this._sockets.set(socket.id, socket);
        this._timeLastActive = Date.now();

        for (const [id, s] of this._sockets) {
            if (!s.isAlive){
                this._sockets.delete(id);
            }
        }
        this.sendGame();
    }

    IAmActif(){
        this._timeLastActive = Date.now();
    }

    isInactived(){
        if (this._timeLastActive + 13000 < Date.now())
            return false;
        return true;
    }

    setGame(game){
        if (!game?.getId()) return;

        this.clearTurnTimer();
        this._game = game;
        this._chrono = null;
        this._nbTurn = 0;
        this._playTime = 0;
        this.firstAlert = 0;
    }

    setObs(game){
        if (this._obsGame === game) return;
        
        this.removeObs();

        this._obsGame = game;

        this.sendObs();
    }

    removeObs(){
        setTimeout(() => {
                if (this._obsGame) return ;
                this.send({
                    players: null,
                    other_board: Array(9).fill(" ")
                });
            }, 5000)

        if (!this._obsGame) return ;

        const obs_game = this._obsGame;
        this._obsGame = null;

        obs_game?.removeObs(this);        
    }

    sendObs() {
        if (!this._obsGame) {
            return ;
        }

        
        const all = JSON.stringify({
                players: this._obsGame.getPlayers(),
                other_board: this._obsGame._board,
            });


        for (const socket of this._sockets.values()){
            try {
                if (socket?.readyState === 1)
                    socket.send(all);
            } catch (err) {
                console.error("WebSocket player.send error:", err);
            }
        }
    }

    sendList() {

        const all = JSON.stringify({
            list: structuredClone(this.list),
        });

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
        Object.assign(this._prevData, payload);
    }

    send(data) {
        if (data === undefined){
            return ;
        }
        
        const new_message =
            typeof data === "string"
                ? data
                : data?.message;

        if (new_message !== undefined) {
            this._lastMessage = new_message;
        }

        const all = JSON.stringify({
                ...data,
                message: this._lastMessage,
        });

        for (const socket of this._sockets.values()){
            try {
  
                if (socket?.readyState === 1)
                    socket.send(all);
            } catch (err) {
                console.error("WebSocket player.send error:", err);
            }
        }
    }

    disconnect(message, game_id = null) {
        if (this._obsGame && game_id === this._obsGame.getId()) {
            this.removeObs();
            return ;
        }
        if (this._game && game_id !== this._game.getId()) return;

        this.sendMessage(message);

        this.clearTurnTimer();
        this._chrono = null;
        this._lastMessage = "";
        this._nbTurn = 0;
        this._playTime = 0;
        this._game = null;
        this.firstAlert = 0;
        this.removeObs();
    }

    toString(){
        return `${this._nickName} play ${this._game?.getId()}`;
    }

    getId(){
        return this._id;
    }

    clearTurnTimer() {
        if (this._turnTimer) {
            clearTimeout(this._turnTimer);
            this._turnTimer = null;
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
        this._turnTimer = setTimeout(alertAction, millisec);
    }

    firstAlert() {
        if (!this.firstAlert) return;

        const delay = Math.max(0, Date.now() + this.firstAlert - this._chrono);

        this.startTurnTimer(
            () => this.send({ message: "Hurry up and Play  !" }),
            delay
        );
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
            nb_turn: this._nbTurn
         });
    }

    static async create(socket){
        const player = new Player(socket);
        const time = Date.now()
        
        player.refreshName(time);
        player._timeLastActive = time;

        return player;
    }

    async refreshName(time){
        const ll = await User.findByPk(this._id);
        this._timeRefreshName = time;
        this._nickName = ll.name        
    }

    getName(){
        return this._nickName;
        const time = Date.now();

        if (this._nickName && time - 5000 < this._timeRefreshName)
            return this._nickName;

        this.refreshName(time);

        return this._nickName;
    }

    async majdb(game_id, how_win, type_player , type_winner = null) {
        
        const how_win_check = ["draw", "abort", "horizontal", "vertical", "diagonal"];
        const type_player_check = ["X", "O"];

        if (how_win === "diagonal_rl" || how_win === "diagonal_lr")
            how_win = "diagonal"

        if (!how_win_check.includes(how_win) || !type_player_check.includes(type_player)) {
            throw new Error("Invalid params");
        }

        const data = {total_game: 1, time_played: this._playTime, nb_turn_played: this._nbTurn};

        if (how_win === 'draw'){
            data[`type_${type_player}_draw`] = 1;
        } else {
            data[`type_${type_player}_${how_win}_${type_winner}`] = 1;
        }

        const userstat = await StatMorp.findOne({where: {idUser: this._id}});
        await userstat.increment(data);
        this.disconnect(null, game_id);
    }
}