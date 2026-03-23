import sequelize from '../models/index.js';
import { Player } from "./player.js";

class Room {
    constructor (id) {
        this._type = "default";
        this._id = id;
        this._players = new Set();
        this._obs = new Set();
        this._min_players = 1000;
        this._max_players = null;
        this._date_game = new Date(); // _date of first player
        this._start_time = null; // timestamp start game
        this._locked = false;
        this._winner = null;
        this.out_timer = null; //setTimeout fin
        this.limit_time = 60 * 1000;
        this._time_refresh_name = 0  ;
        this._players_names = {};
    }

    getPlayers() {
        let time = Date.now()

        if (time - 20000 < this._time_refresh)
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
        if (!this._locked) return ;

        this._players.add(obs);
        obs.setObs(this);
        if (this._type === "Morpion")
            obs.send({
                players: this._players_names,
                other_board: this._board,
            })
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

    addPlayer(player) {

        if (this._players.has(player)) return false;
        if (this._locked) return false;
        if (this.isFull()) return false;

        this._players.add(player);
 
        return true;
    }

    removePlayer(player) {
        console.log("Players dans la room (avant suppression):", Array.from(this._players.keys()));
        if (!this._players.has(player))
            return this._players.size;

        player.disconnect();
        this._players.delete(player);
        return this._players.size
    }

    toString(){
        return `${this._type} :${this._id} | Locked: ${this._locked} | Players: ${Array.from(this._players.keys()).join(", ")}`;
    }

    length(){
        return this._players.size;
    }

    isType(type){
        return (type === this._type)
    }

    isFull() {
        if (this._max_players === null) return false;

        return this._players.size >= this._max_players;
    }
    
    isInRoom(id){
        // console.log([...this._players.keys()], "on cherche ", id);
        return this._players.has(id);
    }

    getId() {
        return this._id;
    }

    getLock(){
        return this._locked;
    }

    setLock(state) {
        if (state === true && this._players.size < this._min_players) {
            throw new Error("need more player");
        }

        this._locked = state;
        this._start_time = Date.now();
    }

    sendAll(message) {
        if (!message) return;

        this._players.forEach(player => {player.send(message);});
    }

    remove() {
        this.clearOutTimer();
        this._obs.forEach(o => o.send({other_board: Array(9).fill(" ")}))
        this._players.forEach(p => {p.disconnect()})
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

        this.out_timer = setTimeout(Action, millisec);
    }
}

export default Room;