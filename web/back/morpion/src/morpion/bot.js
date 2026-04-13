import m from "./PlayMorpion.js"
import checkBestMove from "./BestMove.js";
import { Player } from "./player.js";

export class Bot {
    static count = 0;

    constructor(id) {
        this._nickName = `Bot_${id}`;
        this._turnTimer = null;
        this._nbTurn = 0;
        this._playTime = 0;
        this._game = null;
        this._obsGame = null;
        this._sockets = null;
        this._id = id * 1024 * 1024;
        this._prevData = {};
        this._chrono = null;
        this.firstAlert = 0;
        this._timeRefreshName = 0;
        this._timeLastActive = 0;
        this.list = null;
        this._playHuman = 0;
    }

    static create(){
        const id = Bot.count++; 
        const bot = new Bot(id);
        const time = Date.now()
        
        bot._timeLastActive = time;

        return bot;
    }

    getRandomEmptyIndex() {
        const board = this._game.getboard();

        const emptyIndexes = [];

        for (let i = 0; i < board.length; i++) {
            if (board[i] === " ") {
                emptyIndexes.push(i);
            }
        }

        if (emptyIndexes.length > 0) {
            const randomIndex = Math.floor(Math.random() * emptyIndexes.length);
            return emptyIndexes[randomIndex];
        }

        return null;
    }
    
    send(data) {
        if (this._game._turn !== this) return;

        if (data.message === undefined) return ;

        if (data.message != m.msgs.my_turn && data.message != m.msgs.badMove) return ;
        
        if (this._playHuman === 0) {
            this._playHuman++;
            if(this._game.getOther(this) instanceof Player)
                this._playHuman++;
        }

        if (this._playHuman === 2)
            return m.move(this, checkBestMove(this._game.getboard()));

        this._nbTurn++;
        
        const nb = this._nbTurn > 15
            ? checkBestMove(this._game.getboard())
            : Math.floor(Math.random() * this._game.getboard().length);
        
        setTimeout(() => {
            m.move(this, nb)}, 1000);
    }
    
    sendList() {
    }

    IAmActif(){
    }

    isInactived(){
        return true;
    }

    addSocket(){
        return ;
    }
    
    disconnect(message , game = null) {
        if (game === this._obsGame) {
            this._obsGame
        }
        
        if (game && game !== this._game) return;

        if (message)
            this.send(message);

        this.clearTurnTimer();
        this._chrono = null;
        this._nbTurn = 0;
        this._playTime = 0;
        this._game = null;
        this.firstAlert = 0;
    }


    toString(){
        return `${this._nickName} play ${this._game?.getId()}`;
    }

    setGame(game){
        this._game = game;
    }

    setObs(){
        return ;
    }

    removeObs(){
        return ;
    }

    getGame(){
        return this._game;
    }

    save() {
        return ;
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
        return ;
    }


    startTurnTimer() {
        return ;
    }

    firstAlert() {
        return ;
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

    refreshName(time){
        this._timeRefreshName = time;    
    }

    getName(){
        return this._nickName;
    }

    async majdb() {
        return ;
    }

}