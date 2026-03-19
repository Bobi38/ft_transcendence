import m from "./PlayMorpion.js"

export class Bot {
    static count = 0;

    constructor(id) {
        this._nick_name = `Bot_${id}`;
        this._turn_timer = null;
        this._nb_turn = 0;
        this._play_time = 0;
        this._game = null;
        this._obs_game = null;
        this._sockets = null;
        this._id = id * 1024 * 1024;
        this._prev_data = {};
        this._chrono = null;
        this.first_alert = 0;
        this._time_refresh_name = 0;
        this._time_last_active = 0;
        this.list = null;
    }

    static create(){
        const id = Bot.count++; 
        const bot = new Bot(id);
        const time = Date.now()
        
        bot._time_last_active = time;

        return bot;
    }

    getRandomEmptyIndex() {
        const board = this._game.getboard();

        const empty_indexes = [];

        for (let i = 0; i < board.length; i++) {
            if (board[i] === " ") {
                empty_indexes.push(i);
            }
        }

        if (empty_indexes.length > 0) {
            const randomIndex = Math.floor(Math.random() * empty_indexes.length);
            return empty_indexes[randomIndex];
        }

        return null;
    }
    
    send(data) {
        if (data.message === undefined
            || (data.message != m.msgs.my_turn
            && data.message != m.msgs.badMove))
            return ;

        this._nb_turn++;
        
        const nb = this._nb_turn > 15
            ? this.getRandomEmptyIndex()
            : Math.floor(Math.random() * this._game.getboard().length);
        
        console.log("bot doit jouer : ", nb);
        setTimeout(() => {m.move(this, nb)}, 2000);
    }
    
    isInactived(){
        console.log(`pour verif timeOOOut player`);
        if (this._time_last_active + 120000 < Date.now())
            return false;
        console.log("time out 30s for eval");
        
        return true;
    }

    addSocket(){
        return ;
    }
    
    disconnect() {
        this._game = null;
    }

    toString(){
        return `${this._nick_name} play ${this._game?.getId()}`;
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
        return ;
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

    refreshName(time){
        this._time_refresh_name = time;    
    }

    getName(){
        return this._nick_name;
    }

    async majdb() {
        return ;
    }

}