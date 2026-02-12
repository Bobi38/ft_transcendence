

class Room {
    constructor (id) {
        this.id = id;
        this.playersid = new Map();
        this.maxPlayers = 2;
        this.locked = false;
        this.finish = false;
    }

    addPlayer(playerId, socket) {
        if (this.playersid.size < this.maxPlayers) {
            this.playersid.set(playerId, {socket, playerId});
            return true;
        }
        return false;
    }

    removePlayer(playerId) {
        return this.playersid.delete(playerId);
    }


    isFull(){
        if (this.playersid.size >= this.maxPlayers){
            return true;
        }
        return false;
    }

    getlock(){
        return this.locked;
    }

    setlocked(stat){
        if (stat === false)
            this.locked = false;
        else
            this.locked = true;

    }
}

export default Room;