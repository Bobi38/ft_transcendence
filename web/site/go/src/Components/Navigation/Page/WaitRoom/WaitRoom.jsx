import "./waitRoom.css";
import { SocketM } from "../../../../../SocketManag";
import { use, useEffect, useState } from "react";
import { useNavigate} from "react-router-dom";
    
export default function WaitRoom() {

    const navigate = useNavigate();
    console.log("render wait room");
    useEffect(() => {
        console.log("use effect wait room");
        console.log("nb co = " + SocketM.nb());
        if (SocketM.nb() === 0) {
            SocketM.connect();
        }
        const toto = {
            type: "waitRoom",
            mess: "je suis dans wait room",
        }



        const handleRoom = (data) => {
            console.log("Message reçu via SocketM.onRoom:" + data.mess);
            if (data.mess === "yes"){
                alert("la partie va commencer");
                navigate("/Morpion");
            }
        };
        SocketM.onRoom(handleRoom);        
        const sendWhenReady = () => {
            if (SocketM.socket && SocketM.socket.readyState === WebSocket.OPEN) {
                SocketM.sendd(toto);
            } else {
                setTimeout(sendWhenReady, 50);
            }
        };
        sendWhenReady();
        return () => {
            console.log("cleanup wait room");
            SocketM.offRoom(handleRoom);
        };
    }, []);

    return (
        <>
        <p>Wait Room</p>
        </>
    )
}
