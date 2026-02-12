import Room from "./WaitRoom.js";

class MaanagRoom {
    constructor(){
        this.rooms = new Map();
    }

    createRoom() {
        const newRoom = new Room(this.rooms.size + 1);
        this.rooms.set(newRoom.id, newRoom);
        return newRoom;
    }

    getRoom(id) {
        return this.rooms.get(id);
    }

    removeRoom(id) {
        this.rooms.delete(id);
    }

    isInRoom(playerId) {
        for (const room of this.rooms.values()) {
            for (const player of room.playersid.values()){
                if (player.socket.userId === playerId) {
                    return room;
                }
            }
        }
        return null;
    }

    findoneplace(socket, playerId) {
        for (const room of this.rooms.values()) {
            if (!room.isFull() && !room.getlock()) {
                room.addPlayer(playerId, socket);
                return room;
            }
        }
        const newRoom = this.createRoom();
        newRoom.addPlayer(playerId, socket);
        return newRoom;
    }

    removeplayer(playerId) {
        for (const room of this.rooms.values()) {
            if (room.playersid.has(playerId)) {
                room.removePlayer(playerId);
                if (room.playersid.size === 0) {
                    this.removeRoom(room.id);
                }
                return;
            }
        }
    }
}

export const ManagRoom = new MaanagRoom();