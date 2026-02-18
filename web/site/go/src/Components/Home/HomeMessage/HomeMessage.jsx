/* Css */
import "../../../index.scss"
import "./HomeMessage.scss";

/* Components */
import { useEffect, useState } from "react";
import {SocketM} from '../../../../SocketManag.js';
import checkCo from "../../../../../fct1.js";

export default function HomeMessage({grid_style}) {

    const [input, setInput] = useState("");
    const [displayedMessages, setDisplayedMessages] = useState([]);

    async function  fetchMsg(){
        console.log("fetchMsg(1) called");
        try {
        const reponse = await fetch('/api/getchat', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: "include"
            });

        const rep = await reponse.json();
        if (rep.success){
            console.log("fetchMsg(2)" , rep.message);

            setDisplayedMessages(rep.message);

        }else{
            alerte("message get from db failed");
        }
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    }

    async function addmess(time){
        console.log("addmess(): " + input);
        const reponse = await fetch('/api/addchat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",
                body: JSON.stringify({ message: input, timer: time }),
            });

        const rep = await reponse.json();
        if (rep.success){
            console.log("message add to db")
        }
    }

    // useEffect(() => {
    //     (async () => {const toto = await checkCo();
    //         console.log("checkCo() in HomeMessage useEffect:", toto);
    //         if (!toto) {
    //             console.log("User not connected, redirecting to home page");
    //             return;
    //         }
    //     })();
    //     (async () => {await fetchMsg();})();

    //     // console.log("use effect home message");
    //     // console.log("nb co = " + SocketM.nb());
    //     if (SocketM.nb() === 0) {
    //         SocketM.connect();
    //     }
    //     const handleChat = (data) => {
    //         console.log("Message reçu via SocketM.onChat:", data);
    //         // const time = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    //         //message 2 externe

    //         setDisplayedMessages((prev) => [...prev, data]);

    //     };
    //     SocketM.onChat(handleChat);
    //     return () => {
    //         // console.log("out of chat useEffect");
    //         SocketM.offChat(handleChat);
    //     };
    // }, []);

    useEffect(() => {
    const init = async () => {
        const toto = await checkCo();
        console.log("checkCo() in HomeMessage useEffect:", toto);

        if (!toto) {
            console.log("User not connected, aborting useEffect");
            return;
        }

        await fetchMsg();

        if (SocketM.nb() === 0) {
            SocketM.connect();
        }

        const handleChat = (data) => {
            console.log("Message reçu via SocketM.onChat:", data);
            setDisplayedMessages((prev) => [...prev, data]);
        };

        SocketM.onChat(handleChat);

        return () => {
            SocketM.offChat(handleChat);
        };
    };

    init();
	}, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input === "") return;
        const time = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
        console.log("handleSubmit(): " + input);
        //message 2 moi

        const data = {monMsg: true, type: "mess", message: input, timer: time};
        setDisplayedMessages(prev => [...prev, data]);

        const data2 = {...data, monMsg: false};

        addmess(time);
        console.log("send via WebSocket data2:", data2);
        SocketM.sendd(data2);
        setInput("");
    };

    return (
        <>
            <div className={`${grid_style} HomeMessage-box`}>

                    <div className="HomeMessage-message">
                        <h3>Chat</h3>

                    {displayedMessages && displayedMessages.map((msg, index) => (

                        <div  key={index} className={`full ${msg.monMsg ? "HomeMessage-message-me" : "HomeMessage-message-other"}`}>

                            {msg.monMsg ? (
                                <>
                                    <div><span>{msg.timer}</span></div>
                                    <p>{msg.message}</p>
                                </>
                            ) : (
                                <>
                                    <div><strong>{msg.login}</strong> <span>{msg.timer}</span></div>
                                    <p>{msg.message}</p>
                                </>
                            )}

                        </div>
                    ))}

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
