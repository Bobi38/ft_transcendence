/* Css */
import "../../../index.css"
import "./HomeMessage.css";

/* Components */
import { useEffect, useState } from "react";
import {SocketM} from '../../../../SocketManag.js';

export default function HomeMessage({message, grid_style}) {
    
  const [input, setInput] = useState("");
  const [displayedMessages, setDisplayedMessages] = useState([]);


    // useEffect(() => {
    //     fetchMsg();
    //     if (SocketM.nb() === 0){
    //         SocketM.connect();
    //     }
    //     SocketM.socket.onmessage = (event) => {
    //         const data = JSON.parse(event.data);
    //         if (data.type === "message") {
    //             setDisplayedMessages((prev) => [...prev, data.id + ": " + data.mess]);
    //         }
    //     };
    // }, []);
    
    

    const handleSubmit = (e) => {
        e.preventDefault();
        setDisplayedMessages(prev => [...prev, input]);
        addmess();
        SocketM.sendd(input);
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
