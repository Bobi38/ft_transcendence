import MorpionRoom from "./morpionRoom.js";
import Room from "./Room.js";

const roomTypes = {
    Morpion: MorpionRoom,
    default: Room,
};

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

    createRoom(type = "default") {
        const RoomClass = roomTypes[type] || roomTypes.default;
        const new_room = new RoomClass(this.incrementCount());


        this._rooms.set(new_room.getId(), new_room);
        return new_room;
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
                console.log("IsInRoom : deja present");
                return room;
            }
        }
        console.log("IsInRoom : joueur inconnu");
        return null;
    }

    findOnePlace(socket, type = null, currentId) {
        for (const room of this._rooms.values()) {
            if (room.isType(type)
                    && !room.isFull()
                    && !room.getLock()) {
                room.addPlayer(currentId, socket);
                return room;
            }
        }
        const newRoom = this.createRoom(type);
        newRoom.addPlayer(currentId, socket);
        return newRoom;
    }

    removePlayer(playerId, mess = "bye bye") {
        for (const room of this._rooms.values()) {
            room.removePlayer(playerId, mess)
            if (room.length() === 0) {
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
        }, game.limit_time);
    }
}

export const manager_room = new ManagerRoom();