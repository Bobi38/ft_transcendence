import MorpionRoom from "./morpionRoom.js";
import Room from "./Room.js";
import m from "./PlayMorpion.js"

const roomTypes = {
    Morpion: MorpionRoom,
    default: Room,
};

class ManagerRoom {
    constructor(){
        this._roomId = (Date.now() % 50001) + 57;
        this._rooms = new Map();

        this.list = {};
    }

    createRoom(type = "default") {
        const RoomClass = roomTypes[type] || roomTypes.default;
        const newRoom = new RoomClass(this.newRoomId());

        this._rooms.set(newRoom.getId(), newRoom);
        return newRoom;
    }

    dltRoomInlist(roomId) {
        delete this.list[roomId];
    }

    refreshList() {
        const currentIds = new Set(Object.keys(this.list));

        for (const [id, room] of this._rooms) {

            if (room.isState("play")){
                this.list[id] = room.getPlayers();
                currentIds.delete(String(id));
            }
        }

        for (const id of currentIds) {
            delete this.list[id];
        }
        
        this.sendList();
    }

    refreshRoomList() {
        const newList = Object.fromEntries(
            [...this._rooms].map(([id, room]) => [id, room.getPlayers()])
        );

        for (const key in this.list) {
            delete this.list[key];
        }

        Object.assign(this.list, newList);
    }

    getRoom(id) {
        return this._rooms.get(id);
    }

    removeRoom(room, message) {
        if (!room) return ;

        room.remove(message);
        room.clearOutTimer();
        this._rooms.delete(room.getId())
        this.refreshRoomList();
        this.sendList();
    }

    abortedRoom(player){
        const game = player?.getGame();

        if (!game || !game.setEnd()) return ;

        this.refreshRoomList();

        const loser = player;
        let winner = game.getTurn();
        if (winner === loser){
            winner = game.getOther(player);
        }

        winner.send({ message: m.msgs.w_abort, turn: false });
        loser.send({ message: m.msgs.l_abort, turn: false });

        game.handleEndGame('abort', game.getTurn());

        setTimeout(() => {manager_room.removeRoom(game, null);}, 3000);        
    }

    isInRoom(playerId) {
        for (const room of this._rooms.values()) {
            if (room.isInRoom(playerId)) {
                return room;
            }
        }

        return null;
    }

    findOnePlace(type = null, player) {
        for (const room of this._rooms.values()) {
            if (room.isType(type)
                    && !room.isFull()
                    && room.isState("init")) {
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
                if (room.length() === 0) {
                    this.removeRoom(room);
                }
                return;
            }
        }
    }

    removeAll() {
        this._rooms.forEach(r => {r.remove();})
        this._rooms.clear();
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
        increment = ((increment % 31) + 1) * ((increment % 53) + 1);

        this._roomId += increment;

        return this._roomId.toString(36);
    }
}

export const manager_room = new ManagerRoom();