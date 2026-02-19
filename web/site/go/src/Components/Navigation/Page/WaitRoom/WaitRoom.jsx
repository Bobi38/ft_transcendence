import "./waitRoom.scss";
import { SocketM } from "../../../../../SocketManag";
import { use, useEffect, useState } from "react";
import { useNavigate} from "react-router-dom";
    
export default function WaitRoom() {

    const [input, setInput] = useState("");


        const handltest = async (e) => {
        e.preventDefault();
        console.log("in handltest ", input);
        try{
            // const key = "b26266decd6341248ef151027261902";
            // const location = input;
            // const api = "http://api.weatherapi.com/v1/current.json?key=" + key + "&q=" + location;
            // console.log("look api " , api);
        //     const rep = await fetch('/api/fetchConv' ,{
        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/json",
        //         },
        //         credentials: "include",
        //         body: JSON.stringify({input}),
        //     });
        //     const repp = await rep.json();
        //     if (repp.success){
        //         const chats = repp.message;
        //         console.log("chattt 1 ", chats[0].PrivMesses[0].contenu)
        //         console.log("chattt 2 ", chats[1].PrivMesses[0].contenu)
        //         console.log("test join ", chats[0].user1.name);
        //     }
        //     else
        //         console.log("errrr back ", repp.message)
        }catch(err){
            console.log("errrr front " ,err);
        }
    }
    // const handltest = async (e) => {
    //     e.preventDefault();
    //     console.log("in handltest ", input);
    //     try{
    //         const rep = await fetch('/api/fetchConv' ,{
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             credentials: "include",
    //             body: JSON.stringify({input}),
    //         });
    //         const repp = await rep.json();
    //         if (repp.success){
    //             const chats = repp.message;
    //             console.log("chattt 1 ", chats[0].PrivMesses[0].contenu)
    //             console.log("chattt 2 ", chats[1].PrivMesses[0].contenu)
    //             console.log("test join ", chats[0].user1.name);
    //         }
    //         else
    //             console.log("errrr back ", repp.message)
    //     }catch(err){
    //         console.log("errrr front " ,err);
    //     }
    // }
    // const navigate = useNavigate();
    // console.log("render wait room");
    // useEffect(() => {
    //     console.log("use effect wait room");
    //     console.log("nb co = " + SocketM.nb());
    //     if (SocketM.nb() === 0) {
    //         SocketM.connect();
    //     }
    //     const toto = {
    //         type: "waitRoom",
    //         mess: "je suis dans wait room",
    //     }



    //     const handleRoom = (data) => {
    //         console.log("Message reçu via SocketM.onRoom:" + data.mess);
    //         if (data.mess === "yes"){
    //             alert("la partie va commencer");
    //             navigate("/Morpion");
    //         }
    //     };
    //     SocketM.onRoom(handleRoom);        
    //     const sendWhenReady = () => {
    //         if (SocketM.socket && SocketM.socket.readyState === WebSocket.OPEN) {
    //             SocketM.sendd(toto);
    //         } else {
    //             setTimeout(sendWhenReady, 50);
    //         }
    //     };
    //     sendWhenReady();
    //     return () => {
    //         console.log("cleanup wait room");
    //         SocketM.offRoom(handleRoom);
    //     };
    // }, []);

    return (
        <>
        <p>test Room</p>
        <form onSubmit={handltest}>
            <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">Modifier mes informations</button>
        </form>
        </>
    )
}
