/* Css */
import "./HomeChat.scss";

/* Components */
import { useEffect, useState } from "react";


import { SocketM } from "/app/front/tool/SocketManag.js";
import checkCo from "/app/back/src/fct1.js";

export default function HomeChat() {

    const [input, setInput] = useState("");
    const [displayedMessages, setDisplayedMessages] = useState([]);


    async function  fetch_message(){

        console.log("fetch_message(1) called");
        try {
            const reponse = await fetch('/api/getchat', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: "include"
            });

            const rep = await reponse.json();
            if (rep.success){
                console.log("fetch_message(2)" , rep.message);

                setDisplayedMessages(rep.message);

            } else {
                alerte("fetch_message(3) message get from db failed");
            }

        } catch (error) {
            console.error("fetch_message(4) Error fetching messages:", error);
        }
    }

    async function add_message(time){
        console.log("add_message(1): " + input);
        const reponse = await fetch('/api/addchat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",
                body: JSON.stringify({ message: input, timer: time }),
            });

        const rep = await reponse.json();
        if (rep.success){
            console.log("add_message(2) message added in db")
        }
    }

    const init = async () => {

        const repco = await checkCo();
        console.log("init(1) checkCo() in HomeChat useEffect:", repco);

        if (!repco) {
            console.log("init(2) User not connected, aborting useEffect");
            return;
        }

        await fetch_message();

        if (SocketM.getState() === "closed") {
            SocketM.connect();
        }

        const handleChat = (data) => {
            console.log("init(3) Message reçu via SocketM.onChat:", data);
            setDisplayedMessages((prev) => [...prev, data]);
        };

        SocketM.onChat(handleChat);

        return () => {
            SocketM.offChat(handleChat);
        };
    };

    useEffect(() => {
        init();
	}, []);

    const handle_submit = (e) => {
        e.preventDefault();
        if (input === "") return;
        const time = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
        console.log("handle_submit(1): " + input);
        //message 2 moi

        const data = {monMsg: true, type: "mess", message: input, timer: time};
        setDisplayedMessages(prev => [...prev, data]);

        const data2 = {...data, monMsg: false};

        add_message(time);
        console.log("handle_submit(2) send via WebSocket data2:", data2);
        SocketM.sendd(data2);
        setInput("");
    };











    return (
        <>
            <div id={`HomeChat-root`}>

                    <h3>Global Chat</h3>
                <div className={`message-container`}>

                    {displayedMessages && displayedMessages.map((msg, index) => (

                        <div  key={index} className={`${msg.monMsg ? "me" : "other"}`}>

                            {msg.monMsg ? (
                                <div className={`message`}>
                                    <div>{msg.timer}</div>
                                    <p>{msg.message}</p>
                                </div>
                            ) : (
                                <div className={`message`}>
                                    <div><strong>{msg.login}</strong>{msg.timer}</div>
                                    <p>{msg.message}</p>
                                </div>
                            )}

                        </div>
                    ))}
                </div>










                <form onSubmit={handle_submit}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        />
                    <button type="submit">Envoyer</button>
                </form>


            </div>
        </>
    )
}
