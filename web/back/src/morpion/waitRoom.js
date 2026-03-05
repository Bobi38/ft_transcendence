import Room from "./Room.js";

class WaitRoom extends Room {
    constructor(RoomId) {
        super(RoomId);
        this._type = "waiting";
        this._players = new Map();
        this._min_players = 0;
        this._max_players = 10000;
        this._locked = false;
        this._winner = null;
        this.out_timer = null;
        this.limit_time = 24 * 3600 * 1000;
    }
}

export default WaitRoom;