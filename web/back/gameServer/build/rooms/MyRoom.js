import { Room } from "colyseus";
import { MyRoomState } from "./schema/MyRoomState.js";
export class MyRoom extends Room {
    constructor() {
        super(...arguments);
        this.maxClients = 4;
        this.state = new MyRoomState();
        this.messages = {
            yourMessageType: (client, message) => {
                /**
                 * Handle "yourMessageType" message.
                 */
                console.log(client.sessionId, "sent a message:", message);
            }
        };
    }
    onCreate(options) {
        /**
         * Called when a new room is created.
         */
    }
    onJoin(client, options) {
        /**
         * Called when a client joins the room.
         */
        console.log(client.sessionId, "joined!");
    }
    onLeave(client, code) {
        /**
         * Called when a client leaves the room.
         */
        console.log(client.sessionId, "left!", code);
    }
    onDispose() {
        /**
         * Called when the room is disposed.
         */
        console.log("room", this.roomId, "disposing...");
    }
}
