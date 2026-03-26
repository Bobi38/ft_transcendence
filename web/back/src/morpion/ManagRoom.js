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

        this.list = {};
    }

    createRoom(type = "default") {
        const RoomClass = roomTypes[type] || roomTypes.default;
        const new_room = new RoomClass(this.newRoomId());

        this._rooms.set(new_room.getId(), new_room);
        return new_room;
    }

    dltRoomInlist(room_id) {
        delete this.list[room_id];
    }

    refreshList() {
        const currentIds = new Set(Object.keys(this.list));

        for (const [id, room] of this._rooms) {
            if (room.getLock()){
                this.list[id] = room.getPlayers();
                currentIds.delete(String(id));
            }
        }

        for (const id of currentIds) {
            delete this.list[id];
        }
        console.log(this.list);
    }

    refreshRoomList() {
        const newList = Object.fromEntries(
            [...this._rooms].map(([id, room]) => [id, room.getPlayers()])
        );

        for (const key in this.list) {
            delete this.list[key];
        }

        Object.assign(this.list, newList);
        console.log(this.list);
    }

    getRoom(id) {
        return this._rooms.get(id);
    }

    removeRoom(room, message) {
        // console.log(`cherche ${id}  - quel  room ? ${room}`)
        if (!room) return ;

        room.remove(message);
        room.clearOutTimer();
        this._rooms.delete(room.getId())
        this.refreshRoomList();
    }

    abortedRoom(player){
        const game = player.getRoom();

        if (!game || !game.setLock(false)) return ;

        console.log(`time out     by  time out`);
        this.refreshRoomList();
        const loser = player;
        let winner = game.getTurn();
        if (winner === loser){
            winner = game.getOther();
        }

        game.handleEndGame('abort', game.getTurn());
        winner.send({ message: msgs.w_abort, turn: false }); // message: "end"
        loser.send({ message: msgs.l_abort, turn: false });


        setTimeout(() => {manager_room.removeRoom(game, null);}, 10000);

        console.log("      game     aborted    TIME OUT");          
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
            // console.log("Checking room ->", room.toString());
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