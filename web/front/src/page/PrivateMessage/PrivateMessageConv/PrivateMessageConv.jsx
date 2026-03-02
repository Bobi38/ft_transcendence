/* extern */
import { useEffect, useState } from "react";

/* back */
import  SocketM  from "/app/front/tool/SocketManag.js";

/* Css */
import "./PrivateMessageConv.scss"; 

/* Components */

// login lui contient le login user
export default function PrivateMessageConv({login, displayedMessages, setDisplayedMessages}) {    

    const [input, setInput] = useState("");

    // async function fetch_private_message({login}) {
    //     console.log("fetch_private_message(1) called: ", login);

    //     const tok2 = login;

    //     try{
    //         const reponse = await fetch('/api/get_chat_private', {
    //             method: "POST",
    //             headers: {'Content-Type': 'application/json'},
    //             credentials: "include",
    //             body: JSON.stringify({tok2}),
    //         });
    //         const repjson = await reponse.json();
    //         if (repjson.success){

    //             setDisplayedMessages(message);
                
    //             console.log("fetch_private_message(2) success: " , repjson.message);
    //         } else
    //             console.error("fetch_private_message(3) Error back");
    //     }catch(error){
    //         console.error("fetch_private_message(4) Error front: ", err);
    //     }
    // }
    




    // useEffect(() => {

    //     async () => { fetch_private_message({login}) }


    //     if (SocketM.getState() === "closed") {
    //         SocketM.connect();
    //     }

    //     const handle_private_message = (data) => {

    //         console.log("handle_private_message(1) Message privé reçu via WebSocket:", data);
    //         if (data.login === login)
    //             setDisplayedMessages(prevMessages => [...prevMessages, data]);
    //     }
    //     SocketM.onPriv(login, handle_private_message);

    //     return () => {
    //         SocketM.offPriv(handle_private_message);
    //     };
    // }, [login]);




    async function add_private_message(time, login){
        console.log("add_private_message(1) called: ", input)
        const data = {
            message: input,
            time: time,
            id: login,
        }

        try{
            const reponse = await fetch('/api/chatP/add_message_private',{
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                credentials: "include",
                body: JSON.stringify(data),
            });

            const repjson = await reponse.json();
            if(repjson.success){
                console.log("add_private_message(2) success")
            } else
                console.error("add_private_message(3) Error back", repjson.message)
        }catch(err){
            console.error("add_private_message(4) Error front", err)
        }
    }


    
    const handler_submit = (e) => {
        e.preventDefault();
        console.log("handler_submit(1) called: ", e.target[0].value);
        if (input === "") return;
        
        const time = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
        const data = {monMsg: true, type: 'priv_mess', message: input, timer: time, to: login}

        console.log("handle_submit(2): ", data);

        const data2 = {...data, monMsg: false};

        add_private_message(time, login);

        console.log("handle_submit(3) send via WebSocket data2:", data2);
        SocketM.sendd(data2);
        setInput("");
    }

    return (
        <>
            <div className={`PrivateMessageConv-root border-0`}>

                    <h5>{login}</h5>

                    <div className="message border-1">
                        <div>

                            {displayedMessages && displayedMessages.map((msg, index) => { return ( 

                                <div key={index} className={`border-2`}>

                                    {index != 0 && <hr/>}
                                    <h3>{msg.login}</h3>
                                    <p>{msg.message}</p>

                                </div>

                            );})}

                        </div>

                    </div>

                    <form onSubmit={handler_submit}>
                        <input type="text"
                        value = {input}
                        onChange={(e) => setInput(e.target.value)}
                        />
                        <button type="submit">button</button>
                    </form>

            </div>
        </>
    )
}

