import sequelize from '../models/index.js';
import { Player } from "./player.js";

class Room {
    constructor (id) {
        this._type = "default";
        this._id = id;
        this._players = new Map();
        this._min_players = 0;
        this._max_players = null;
        this._date_game = new Date();
        this._locked = false;
        this._winner = null;
        this.out_timer = null;
        this.limit_time = 3600 * 1000;
    }

    toString(){
        return `${this._type} :${this._id}`;
    }

    addPlayer(playerId, socket) {
        if (this._locked) return false;
        if (this.isFull()) return false;

        this._players.set(playerId, new Player(socket, playerId));
        return true;
    }

    removePlayer(playerId, mess = null) {
        const player = this._players.get(playerId);
        
        if (!player) return -1;

        player.disconnect(mess);
        this._players.delete(playerId);
        return this._players.size
    }

    isType(type){
        return (type === this._type)
    }

    isFull() {
        if (this._max_players === null) return false;

        return this._players.size >= this._max_players;
    }
    
    isInRoom(id){
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
            throw new Error("Nombre de joueurs minimum non atteint");
        }

        this._locked = state;
    }

    sendAll(mess) {
        if (!mess) return;

        this._players.forEach(player => {player.send(mess);});
    }

    remove(mess = null) {
        this.clearOutTimer();

        this._players.forEach(p => {p.disconnect(mess)});
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