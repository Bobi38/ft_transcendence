import sequelize from './index.js';
import { Player } from "./player.js";

class Room {
    constructor (id) {
        this._type = "default";
        this._id = id;
        this._players = new Map();
        this._minPlayers = 0;
        this._maxPlayers = null;
        this._dateGame = new Date();
        this._locked = false;
        this._winner = null;
        this.outTimer = null;
        this._limitTime = 3600 * 1000;
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
        if (this._maxPlayers === null) return false;

        return this._players.size >= this._maxPlayers;
    }
    
    isInRoom(id){
        return this._players.has(id);
    }

    getId() {
        return this._id;
    }

    getlock(){
        return this._locked;
    }

    setLock(state) {
        if (state === true && this._players.size < this._minPlayers) {
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
        if (this.outTimer) {
            clearTimeout(this.outTimer);
            this.outTimer = null;
        }
    }

    startOutTimer(Action, millisec) {
        this.clearOutTimer();

        this.outTimer = setTimeout(Action, millisec);
    }
}

export default Room;