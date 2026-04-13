/* extern */
import { useState }             from    "react";

/* Css */
import "./PrivateMessageConv.scss";

/* Components */
import  SocketM                 from    "TOOL/SocketManag.js";
import {showAlert}              from    "TOOL/fonction_usefull.js";
import useFetch                 from    "TOOL/useFetch.jsx";

export default function PrivateMessageConv({ login, displayedMessages }) {

    const [input, setInput] = useState("");

    async function add_private_message(time, login){
        if (!time || !login)
            return;

        const url = `/api/chatP`;
        const repjson = await useFetch(`${url}`, {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            credentials: "include",
            body: JSON.stringify({ message: input, time: time, id: login }),
        }, null , function(repjson) {
            if (repjson.message === "exist") {
                console.log("dlt_friend callbackfail(info) people not exist");
            } else if (repjson.message === "relation") {
                console,log("dlt_friend callbackfail(info) people are not friend");
            } else {
                console.log("dlt_friend callbackfail(info) error back ", repjson.message);
            }
        });
        if (!repjson || (repjson &&  !repjson.success))
            return false;
        return true;
    }

    async function is_friend(login){
        if (!login)
            return;

        const url = `/api/friend/${login}/status`;
        const repjson = await useFetch(`${url}`, {
            method: "GET",
            headers: {'Content-Type': 'application/json'},
            credentials: "include",
        }, null , function(repjson) {
            if (repjson.status >= 400 && repjson.status < 500) {
                return false;
            }
        });
        if (!repjson || (repjson &&  !repjson.success))
            return false;
        return true;
    }

    const handler_submit = async (e) => {
        e.preventDefault();
        if (input === "") return;
        if (input.length > 511) {
            setInput("");
            showAlert("Message too long", "danger");
            return;
        }

        const time = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
        const data = {monMsg: true, type: 'priv_mess', message: input, timer: time, to: login}


        const data2 = {...data, monMsg: false};

        const isFriend = await is_friend(login);
        if (!isFriend) {
            showAlert("You are not, or are no longer, friends with this user.", "danger");
            return;
        }
        if (!await add_private_message(time, login)){
            setInput("");
            return;
        }
        
        setInput("");
        SocketM.sendd('priv', data2);
    }
    return (
		<div className={`PrivateMessageConv-root`}>

			<h1>{login}</h1>
			<hr />

			<div className="content">
                <p id={`alert-container`}></p>

				<div className="message">
                    {displayedMessages && displayedMessages.map((msg, index) => { return (

                        <div key={index} className={`${msg.monMsg ? "me" : "other"}`}>

                            {msg.monMsg ? (
                                <div>
                                    <div id="timerP"><span>{msg.timer}</span></div>
                                    <p>{msg.message}</p>
                                </div>
                            ) : (
                                <div>
                                    <div id="timerP"><strong>{msg.login}</strong><span> {msg.timer}</span></div>
                                    <p>{msg.message}</p>
                                </div>
                            )}
                        </div>
                    );})}
				</div>

				<hr />

				<form onSubmit={handler_submit}>
					<input type="text"
					value = {input}
					onChange={(e) => setInput(e.target.value)}
					/>
					<button className="button" type="submit">Send</button>
				</form>

			</div>
		</div>
    );
}