import MorpionRoom from "./morpionRoom.js";
import WaitRoom from "./waitRoom.js";
import Room from "./Room.js";

const roomTypes = {
    Morpion: MorpionRoom,
    default: Room,
};

class ManagerRoom {
    constructor(){
        this._roomId = (Date.now() % 50001) + 57;
        this.lobby = new WaitRoom;
        this._rooms = new Map();
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

    removeRoom(room) {
        // console.log(`cherche ${id}  - quel  room ? ${room}`)
        if (!room) return;

        room.remove();
        this._rooms.delete(room.getId());
    }

    isInRoom(playerId) {
        for (const room of this._rooms.values()) {
            if (room.isInRoom(playerId)) {
                // console.log("IsInRoom : deja present");
                return room;
            }
        }
        // console.log("IsInRoom : joueur inconnu");

        return null;
    }

    findOnePlace(type = null, player) {
        for (const room of this._rooms.values()) {
            console.log("Checking room ->", room.toString());
            if (room.isType(type)
                    && !room.isFull()
                    && !room.getLock()) {
                room.addPlayer(player);
                player.setGame(room);
                return room;
            }
        }
        
        const newRoom = this.createRoom(type);
        newRoom.addPlayer(player);
        player.setGame(newRoom);
        return newRoom;
    }

    removePlayer(player, message = "bye bye") { //inutile
        for (const room of this._rooms.values()) {
            if (room.isInRoom(player)) {
                room.removePlayer(player, message);
                console.log(`tu vois 0 ? lenght = ${room.length()}`);
                if (room.length() === 0) {
                    console.log("oui j ai vu 0");
                    this.removeRoom(room.getId());
                }

                return;
            }
        }
    }

    removeAll() {
        this._rooms.forEach(r => {r.remove();})
        this._rooms.clear();
    }

    sendAll(mess) { //inutile
        this._rooms.forEach(
            room => room.sendAll(mess))
    }

    startOutTimer(game) {
        game.clearOutTimer();

        game.outTimer = setTimeout(() => {
            game.remove("* TIME OUT *");
        }, game.limit_time);
    }

    newRoomId(){
        if (this._roomId > 2000000000)
            this._roomId = (Date.now() % 50001) + 57;

        let increment = this._roomId;
        increment = ((increment % 31) + 1) * ((increment % 7) + 1);

        this._roomId += increment;

        return this._roomId.toString(36);
    }
}

export const manager_room = new ManagerRoom();