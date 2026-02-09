/* Css */
import "../../../index.css"
import "./HomeMessage.css";

/* Components */
import { useEffect, useState } from "react";
import {SocketM} from '../../../../SocketManag.js';

export default function HomeMessage({message, grid_style}) {
    
    const [input, setInput] = useState("");
    const [displayedMessages, setDisplayedMessages] = useState([]);


    useEffect(() => {
        fetchMsg();
        console.log("use effect home message");
        console.log("nb co = " + SocketM.nb());
        if (SocketM.nb() === 0) {
            SocketM.connect();
        }
        // const handleChat = (data) => {
        //     console.log("Message reçu via SocketM.onChat:", data.message);
        //     setDisplayedMessages((prev) => [...prev,data.id + ": " + data.mess]);
        // };
        // SocketM.onChat(handleChat);
        return () => {
            console.log("out of chat useEffect");
            // SocketM.offChat(handleChat);
        };
    }, []);
    
    

    const handleSubmit = (e) => {
        e.preventDefault();
        setDisplayedMessages(prev => [...prev, input]);
        addmess();
        const data = {type: "mess", mess: input};
        console.log("data to send via WebSocket:", input);
        SocketM.sendd(data);
        setInput(""); 
    };
    

    async function  fetchMsg(){
        const reponse = await fetch('/api/getchat', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: "include"
            });

        const rep = await reponse.json();
        if (rep.succes){
            const chat = rep.ret;
            setDisplayedMessages(chat);
        }

    }

    async function addmess(){
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
    return (
        <>
            <div className={`${grid_style} message center`}>

                    <div className="display-message ">
                        {displayedMessages.map((msg, index) => (
                            <div key={index}>{msg}</div>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <input type="submit"></input>
                    </form>
           
            </div>
        </>
    )
}
