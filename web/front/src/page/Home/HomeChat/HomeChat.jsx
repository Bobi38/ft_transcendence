/* extern */
import { useEffect, useState }      from    "react";

/* Css */
import "./HomeChat.scss";

/* Components */
import { showAlert }                from    "TOOL/fonction_usefull.js";
import SocketM                      from    "TOOL/SocketManag.js";
import useFetch                     from    "TOOL/useFetch";
import {useAuth, AUTH}              from    "HOOKS/useAuth.jsx"

export default function HomeChat() {

    const {showLog} = useAuth()
    const [input, setInput] = useState("");
    const [displayedMessages, setDisplayedMessages] = useState([]);

    async function fetch_global_message(){

        const url = `/api/chatG`;

        const repjson = await useFetch(`${url}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: "include"
        });
        if (!repjson || (repjson &&  !repjson.success))
            return;
        setDisplayedMessages([...repjson.message].reverse());//reverse for front display
    }

    async function add_message_global(){

        const url = `/api/chatG`;

        const repjson = await useFetch(`${url}`,{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: "include",
            body: JSON.stringify({ message: input }),
        });
        if (!repjson || (repjson &&  !repjson.success))
            return false;
        return true
    }

    useEffect(() =>{
        if (showLog !== AUTH.NONE)
            return ;
        fetch_global_message()

    }, [showLog])

    useEffect( () => {

        if (showLog !== AUTH.NONE)
            return ;
        fetch_global_message()

        const init = async () => {
            const handle_global_message = (data) => {
                if (data.type === "auth_good" || data.type === "ping") return
                if (data.type === "updateName_good"){
                    fetch_global_message();
                    return;
                }

                setDisplayedMessages((prev) => [data, ...prev]);//reverse for front display
            };
            SocketM.on("chat", handle_global_message, "ChatG");
        };

        init();

        return () => {
            SocketM.off("chat", "ChatG");
        };
    }, [showLog]);

    const handle_submit = async (e) => {
        e.preventDefault();
        if (input === "") return;
        if (input.length > 511) {
            setInput("");
            showAlert("Message Too Long", "danger");
            return;
        }

        const data = {type: "mess", message: input};

        if (!await add_message_global()){
            setInput("");
            return
        }
        setInput("");
        SocketM.sendd('chat', data);
    };

    return (
		<section className={`HomeChat-root`}>

			<h2>Global Chat</h2>

			<div className={`message-container`}>

				{displayedMessages && displayedMessages.map((msg, index) => (
					<div key={index} className={`message ${msg.monMsg ? "me" : "other"}`}>
						{msg.monMsg ? (
							<p className="time">{msg.timer}</p>
						) : (
							<p className="time"><span>{msg.login}</span>{msg.timer}</p>
						)}
						<p>{msg.message}</p>
					</div>
				))}
			</div>

			<form onSubmit={handle_submit}>
				<p id={`alert-container`}></p>

				<div>
					<input required
						type="text"
						value={input}
						onChange={(e) => setInput(e.target.value)}
						/>
					<button type="submit" className="send-btn">Send</button>
				</div>
			</form>
		</section>
    )
}
