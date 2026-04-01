/* extern */
import { useEffect, useState } from "react";

/* back */
import { showAlert } from "TOOL/fonction_usefull.js";
import SocketM  from "TOOL/SocketManag.js";
import {useAuth} from "TOOL/AuthContext.jsx"

/* Css */
import "./HomeChat.scss";

/* Components */
import useFetch from "HOOKS/useFetch";

export default function HomeChat() {

    // const SocketM = useSocket();
    const {showLog} = useAuth()
    const [input, setInput] = useState("");
    const [displayedMessages, setDisplayedMessages] = useState([]);

    async function fetch_global_message(){

        const url = `/api/chatG/get_chat_global`;

        console.log(`${url}`)

        const repjson = await useFetch(`${url}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: "include"
        });
        if (!repjson || (repjson &&  !repjson.success))
            return;
        setDisplayedMessages(repjson.message);
    }

    async function add_message_global(time){
        if (!time) return
        

        const url = `/api/chatG/add_message_global`;

        console.log(`${url}`)

        const repjson = await useFetch(`${url}`,{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: "include",
            body: JSON.stringify({ message: input, time: time }),
        });
        if (!repjson || (repjson &&  !repjson.success))
            return;
    }

    useEffect(() =>{fetch_global_message()}, [showLog])

    useEffect( () => {
        fetch_global_message()
		
        const init = async () => {
            const handle_global_message = (data) => {
                if (data.type === "auth_good") return
                if (data.type === "updateName_good"){
                    fetch_global_message();
                    return;
                }
                console.log("handle_global_message(1) Message global reçu via WebSocket:", data);

                setDisplayedMessages((prev) => [...prev, data]);
            };
            SocketM.on("chat", handle_global_message, "ChatG");
        };

        init();

        return () => {
            SocketM.off("chat", "ChatG");

        };
    }, []);

    const handle_submit = async (e) => {
        e.preventDefault();
        console.log("handler_submit(1) called: ", e.target[0].value);
        if (input === "") return;
        if (input.length > 511) {
            setInput("");
            showAlert("Message trop long (511 caractères max)", "danger");
            return;
        }

        const time = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
        const data = {type: "mess", message: input, timer: time};

        console.log("handle_submit(2): " ,data);
        await add_message_global(time);
        SocketM.sendd('chat', data);
        setInput("");
    };
    
    return (
		<section className={`HomeChat-root`}>

			<h3>Global Chat</h3>

            <div id={`alert-container`}></div>

			<div className={`message-container`}>

				{displayedMessages && displayedMessages.map((msg, index) => (

					<div  key={index} className={`${msg.monMsg ? "me" : "other"}`}>
						{/* {() => {console.log("displayedMessages", displayedMessages)}} */}
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
				<button type="submit">Send</button>
			</form>
		</section>
    )
}
