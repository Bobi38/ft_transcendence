/* Css */
import "../../../index.css"
import "./HomeMessage.css";

/* Components */
import { useEffect, useState } from "react";
import {SocketM} from '../../../../SocketManag.js';

export default function HomeMessage({message, grid_style}) {
    
    const [input, setInput] = useState("");
    const [displayedMessages, setDisplayedMessages] = useState([]);

    async function  fetchMsg(){
        console.log("fetch message from db");
        try {
        const reponse = await fetch('/api/getchat', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: "include"
            });

        const rep = await reponse.json();
        if (rep.success){
            console.log("message get from db" , rep.message);
            setDisplayedMessages(rep.message);
        }
        else{
            alerte("message get from db failed");
        }
        } catch (error) {
            console.error("Error fetching messages:", error);
        }

    }

    async function addmess(){
        console.log("add mess to db : " + input);
        const reponse = await fetch('/api/addchat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",
                body: JSON.stringify({ message: input }),
            });

        const rep = await reponse.json();
        if (rep.success){
            console.log("message add to db")
        }
    }

    useEffect(() => {
        (async () => {await fetchMsg();})();
        console.log("use effect home message");
        console.log("nb co = " + SocketM.nb());
        if (SocketM.nb() === 0) {
            SocketM.connect();
        }
        const handleChat = (data) => {
            console.log("Message reçu via SocketM.onChat:", data.message);
            const time = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
            setDisplayedMessages((prev) => [...prev, data.name + " " + time + ": " + data.mess + "\n"]);
        };
        SocketM.onChat(handleChat);
        return () => {
            console.log("out of chat useEffect");
            SocketM.offChat(handleChat);
        };
    }, []);
    
    

    const handleSubmit = (e) => {
        e.preventDefault();
        const time = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
        console.log("submit message : " + input);
        setDisplayedMessages(prev => [...prev, "me " + time + " : " + input + "\n"]);
        addmess();
        const data = {type: "mess", mess: input};
        console.log("data to send via WebSocket:", input);
        SocketM.sendd(data);
        setInput(""); 
    };
    

    return (
        <>
            <div className={`${grid_style} message center`}>

                    {/* <div className="display-message ">
                        {displayedMessages.map((msg, index) => (
                            <div key={index}>{msg}</div>
                        ))}
                    </div> */}

                    <div style={{ whiteSpace: "pre-line" }}>
                    {displayedMessages}
                    </div>
                    <form id="HomeMessageform" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <input id="HomeMessagesubmit" type="submit"></input>
                    </form>
           
            </div>
        </>
    )
}
