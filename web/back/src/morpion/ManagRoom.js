import MorpionRoom from "./morpionRoom.js";
import Room from "./Room.js";

const roomTypes = {
    Morpion: MorpionRoom,
    default: Room,
};

class ManagerRoom {
    constructor(){
        this._roomId = (Date.now() % 50001) + 57;
        this._rooms = new Map();
    }

    newRoomId(){
        if (this._roomId > 2000000000)
            this._roomId = (Date.now() % 50001) + 57;

        let increment = this._roomId;
        increment = ((increment % 31) + 1) * ((increment % 7) + 1);

        this._roomId += increment;

        return this._roomId.toString(36);
    }

    createRoom(type = "default") {
        const RoomClass = roomTypes[type] || roomTypes.default;
        const new_room = new RoomClass(this.newRoomId());

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
                room.addPlayer(socket, currentId);
                return room;
            }
        }
        const newRoom = this.createRoom(type);
        newRoom.addPlayer(socket, currentId);
        return newRoom;
    }

    removePlayer(playerId, message = "bye bye") {
        for (const room of this._rooms.values()) {
            if (room.isInRoom(playerId)) {
                room.removePlayer(playerId, message);

                if (room.length() === 0) {
                    this.removeRoom(room.getId());
                }

                return;
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