// import sequelize from './index.js';

class Room {
    constructor (id) {
        this.id = id;
        this.playersid = new Map();
        this.maxPlayers = null;
        this.locked = false;
        this.timer = null;
        this.winner = null;
        this.looser = null;
    }

    // abort(playerId) {
    //     if (!this.playersid.has(playerId)) return;

    //     const aborterSocket = this.playersid.playerid.socket;
    //     this.send(aborterSocket, "bye bye");
    //     this.removePlayer(playerId);

    //     if (!this.getlock() && this.playersid.length() >= 1)
    // }
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
        return this.playersid.size >= this.maxPlayers;
    }

    getlock(){
        return this.locked;
    }

    setlock(stat){
        if (stat !== true) return ;

        this.autoclose(5)
        this.locked = stat;
    }

    close(mess = null) {
        this.clearTimer();

        if (mess)
            this.playersid.forEach(p => {send(p.socket, mess)});
    }

    clearTimer() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.Timer = null;
        }
    }

    autoclose(minute){
        this.clearTimer();
        
        this.timer = setTimeout(close("time out"), +minute * 60000);
    }

    send(socket, mess) {
        if (!socket || socket.readyState !== WebSocket.OPEN) return;
    
        socket.send(JSON.stringify({
            type: "room",
            mess,
            board,
        }));
    }

    sendAll(mess) {
        if (!mess) return;

        this.playersid.forEach(e => {
            this.send(e.socket, mess);
        });
    }

    remove(mess) {
        this.clearTimer();

        if (mess)
            this.sendAll(mess);
    }
}

export default Room;