/* extern */
import { useEffect, useState } from "react";

/* back */
import checkCo from "BACK/fct1.js";
import  SocketM  from "/app/front/tool/SocketManag.js";

/* Css */
import "./HomeChat.scss";

/* Components */
import useFetch from "HOOKS/useFetch";

export default function HomeChat() {

    // const SocketM = useSocket();
    const [input, setInput] = useState("");
    const [displayedMessages, setDisplayedMessages] = useState([]);

    async function fetch_global_message(){

        console.log("/api/chatG/get_chat_global",)

        const repjson = await useFetch('/api/chatG/get_chat_global', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: "include"
        });
        if (!repjson)
            return;

        setDisplayedMessages(repjson.message);
    }

    async function add_message_global(time){
        if (!time) return
        
        console.log("/api/chatG/get_chat_global time:", time)


        const repjson = await useFetch('/api/chatG/get_chat_global',{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: "include",
            body: JSON.stringify({ message: input, time: time }),
        });
        if (!repjson)
            return;

        setDisplayedMessages(repjson.message);
    }


    useEffect(() => {
        let handle_global_message;

        const init = async () => {


            await fetch_global_message();

            // if (SocketM.getState() && SocketM.getState() === "closed") {
            //     SocketM.connect();
            // }

            handle_global_message = (data) => {
                console.log("handle_global_message(1) Message global reçu via WebSocket:", data);
                setDisplayedMessages((prev) => [...prev, data]);
            };

            SocketM.onChat(handle_global_message, "ChatG");
        };

        init();

        return () => {
            if (handle_global_message) {
                SocketM.offChat("ChatG");
            }
        };
    }, []);

    const handle_submit = (e) => {
        e.preventDefault();
        console.log("handler_submit(1) called: ", e.target[0].value);
        if (input === "") return;

        const time = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
        const data = {type: "mess", message: input, timer: time};
        
        console.log("handle_submit(2): " ,data);

        const data2 = {...data, monMsg: false};

        add_message_global(time);
        
        console.log("handle_submit(3) send via WebSocket data2:", data2);
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
