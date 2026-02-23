import MorpionRoom from "./morpionRoom.js";
import Room from "./Room.js";

class ManagerRoom {
    constructor(){
        this._count = (Date.now() % 50001) + 57;
        this._rooms = new Map();
    }

    incrementCount(){
        if (this._count > 2000000000)
            this._count = (Date.now() % 50001) + 57;

        let increment = this._count;
        increment = ((increment % 31) + 1) * ((increment % 7) + 1);

        this._count += increment;

        return this._count.toString(36);
    }

    createRoom(type) {
        let newRoom;
        if (type === "Morpion")
            newRoom = new MorpionRoom(this.incrementCount());
        else
            newRoom = new Room(this.incrementCount());
        this._rooms.set(newRoom.getId(), newRoom);
        return newRoom;
    }

    getRoom(id) {
        return this._rooms.get(id);
    }

    removeRoom(id, mess = null) {
        const room = this._rooms.get(id);

        if (!room) return;

        room.remove(mess);
        this._rooms.delete(id);
    }

    isInRoom(playerId) {
        for (const room of this._rooms.values()) {
            if (room.isInRoom(playerId)) {
                return room;
            }
        }
        return null;
    }

    findOnePlace(socket, playerId, type = null) {
        for (const room of this._rooms.values()) {
            if (room.isType(type)
                    && !room.isFull()
                    && !room.getlock()) {
                room.addPlayer(playerId, socket);
                return room;
            }
        }
        const newRoom = this.createRoom(type);
        newRoom.addPlayer(playerId, socket);
        return newRoom;
    }

    removeplayer(playerId, mess = "bye bye") {
        for (const room of this._rooms.values()) {
            if (room.removePlayer(playerId, mess) === 0) {
                this.removeRoom(room.getId());
            }
        }
    }

    removeAll(mess = null) {
        this._rooms.forEach(r => {r.remove(mess);})
        this._rooms.clear();
    }

    sendAll(mess) {
        this._rooms.forEach(
            room => room.sendAll(mess))
    }

    startOutTimer(game) {
        game.clearOutTimer();

        game.outTimer = setTimeout(() => {
            game.remove("* TIME OUT *");
        }, game.limitTime);
    }
}

export const managerRoom = new ManagerRoom();