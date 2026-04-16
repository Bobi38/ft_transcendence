import {
    defineServer,
    defineRoom,
    monitor,
    playground,
    createRouter,
    createEndpoint,
} from "colyseus";
import cors from "cors";

/**
 * Import your Room files
 */
import { MyRoom } from "./rooms/MyRoom.js";
import Pongroute from "./routes/Pong.controller.js";
import cookieParser from "cookie-parser";


const server = defineServer({
    /**
     * Define your room handlers:
     */
    rooms: {
        my_room: defineRoom(MyRoom)
    },

    /**
     * Experimental: Define API routes. Built-in integration with the "playground" and SDK.
     * 
     * Usage from SDK: 
     *   client.http.get("/api/hello").then((response) => {})
     * 
     */

    /**
     * Bind your custom express routes here:
     * Read more: https://expressjs.com/en/starter/basic-routing.html
     */
    express: (app) => {
        app.use(cors(
            {origin: true,
            credentials: true}
        ));

        app.use((req, res, next) => {
            console.log(`[PONG SERVICE] ${req.method} ${req.path}`);
            next();
        });

        app.use(cookieParser());
        app.use("/", Pongroute);
    }

});

export default server;