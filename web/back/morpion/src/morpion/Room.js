// import sequelize from '../models/index.js';
// import { Player } from "./player.js";

class Room {
    constructor (id) {
        this._type = "default";
        this._id = id;
        this._players = new Set();
        this._obs = new Set();
        this._minPlayers = 1000;
        this._maxPlayers = null;
        this._date_game = new Date(); // _date of first player
        this._start_time = null; // timestamp start game
        this._locked = false; // soon unuse
        this._state = "init"; // init, play, end
        this._winner = null;
        this.out_timer = null; //setTimeout fin
        this.limit_time = 60 * 1000;
        this._time_refresh_name = 0  ;
        this._players_names = {};
    }

    getPlayers() {
        let time = Date.now()

        if (time - 5000 < this._time_refresh)
            return this._players_names;

        this._time_refresh_name = time;
        this._players_names = {};

        let numero = 1;
        this._players.forEach(p => {
            this._players_names[`player_${numero}`] = p.getName();
            numero++;
        })
        return this._players_names;
    }

    addObs(obs){
        if (!this.isState("play")) {
            obs.sendObs()
            return ;
        }

        this._obs.add(obs);

        obs.setObs(this);
    }

    removeObs(obs){
        if (! this._obs.has(obs)) return ;

        this._obs.delete(obs);

        obs.removeObs();
    }

    addPlayer(player) {

        if (this._players.has(player)) return false;
        if (!this.isState("init")) return false;
        if (this.isFull()) return false;

        this._players.add(player);
 
        return true;
    }

    removePlayer(player) {
        console.log("Players dans la room (avant suppression):", Array.from(this._players.keys()));
        if (!this._players.has(player))
            return this._players.size;

        player.disconnect(null, this._id);
        this._players.delete(player);
        return this._players.size
    }

    toString(){
        return `${this._type} :${this._id} | State: ${this._state}}`;
    }

    length(){
        return this._players.size;
    }

    isType(type){
        return (type === this._type)
    }

    isFull() {
        if (this._maxPlayers === null) return false;

        return this._players.size >= this._maxPlayers;
    }
    
    isInRoom(id){
        // console.log([...this._players.keys()], "on cherche ", id);
        return this._players.has(id);
    }

    getId() {
        return this._id;
    }

    getLock(){ //soon unuse
        return this._locked;
    }

    isState(state) {
        return state === this._state;
    }

    setLock(){
        if (this._state === "init" && this._players.size < this._minPlayers) {
            console.log(`need more player`);
            return false;
        }
        console.log("etat lock  = play");
        this._state = "play";
        this._start_time = Date.now();
        return true;  
    }

    setEnd() {
        const base = this._state === "play";
        this._state = "end";
        console.log(`set return : ${base} et _state = ${this._state}`);
        return base;
    }

    sendAll(message) {
        if (!message) return;

        this._players.forEach(player => {player.send(message);});
    }

    remove(message) {
        this.clearOutTimer();

        this._obs.forEach(o => {o.removeObs();});

        this._players.forEach(p => p.disconnect(message, this._id));

        this._players.clear();
        
        this._obs.clear();
    }

    clearOutTimer() {
        if (this.out_timer) {
            clearTimeout(this.out_timer);
            this.out_timer = null;
        }
    }

    startOutTimer(Action, millisec) {
        this.clearOutTimer();

        this.out_timer = setTimeout(() => Action, millisec);
    }
}

export default Room;