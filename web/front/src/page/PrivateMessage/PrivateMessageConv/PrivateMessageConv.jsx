/* extern */
import { useEffect, useState } from "react";

/* back */
import  SocketM  from "TOOL/SocketManag.js";
import {showAlert} from "TOOL/fonction_usefull.js";

/* Css */
import "./PrivateMessageConv.scss";

/* Components */
import useFetch from "HOOKS/useFetch.jsx";

// login lui contient le login user
export default function PrivateMessageConv({login, displayedMessages, setDisplayedMessages}) {    

    const [input, setInput] = useState("");

    async function add_private_message(time, login){
        if (!time || !login)
            return;

        const url = `/api/chatP/add_message_private`;
        console.log(`${url}`)
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
            return;
        console.log("good");
    }

    const handler_submit = async (e) => {
        e.preventDefault();
        console.log("handler_submit(1) called: ", e.target[0].value);
        if (input === "") return;
        if (input.length > 511) {
            setInput("");
            showAlert("Message trop long (511 caractères max)", "danger");
            return;
        }

        const time = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
        const data = {monMsg: true, type: 'priv_mess', message: input, timer: time, to: login}

        console.log("handle_submit(2): ", data);

        const data2 = {...data, monMsg: false};

        await add_private_message(time, login);

        console.log("handle_submit(3) send via WebSocket data2:", data2);
        SocketM.sendd('priv', data2);
        setInput("");
    }
    console.log("displayedMessages:",displayedMessages);
    return (
		<div className={`PrivateMessageConv-root border-0`}>

			<h1>{login}</h1>
			<hr />

			<div className="content">
				<div className="message border-1">
						{displayedMessages && displayedMessages.map((msg, index) => { return (

							<div key={index} className={`${msg.monMsg ? "me" : "other"} border-2`}>

								{/* {index != 0 && <hr/>} */}
								{msg.monMsg ? (
									<div>
										<div><span>{msg.timer}</span></div>
										<p>{msg.message}</p>
									</div>
								) : (
									<div >
										<div><strong>{msg.login}</strong><span> {msg.timer}</span></div>
										<p>{msg.message}</p>
									</div>
								)}
								{/* <h3>{msg.login}</h3>
								<p>{msg.message}</p> */}

							</div>

						);})}


				</div>

				<form onSubmit={handler_submit}>
					<input type="text"
					value = {input}
					onChange={(e) => setInput(e.target.value)}
					/>
					<button className="button" type="submit">Send</button>
				</form>
			</div>
		</div>
    )
}

