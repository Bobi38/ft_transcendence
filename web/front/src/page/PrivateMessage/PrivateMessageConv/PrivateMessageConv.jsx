/* extern */
import { useEffect, useState } from "react";

/* back */
import { SocketM } from "/app/front/tool/SocketManag.js";

/* Css */
import "./PrivateMessageConv.scss"; 

/* Components */

// navConv lui contient le login user
export default function PrivateMessageConv({navConv, displayedMessages, setDisplayedMessages}) {    

    const [input, setInput] = useState("");

    async function fetch_private_message({navConv}) {
        console.log("fetch_private_message(1) called: ", navConv);

        const tok2 = navConv;

        try{
            const rep = await fetch('/api/getpriv', {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                credentials: "include",
                body: JSON.stringify({tok2}),
            });
            const repjson = await rep.json();
            if (repjson.success)
                setDisplayedMessages(message)
            else
                console.log("fetch_private_message(2) error back: ", repjson.message);
        }catch(err){
            console.log("fetch_private_message(3) error front: ", err);
        }
    }
    
    useEffect(() => {

        async () => { fetch_private_message({navConv}) }

        if (SocketM.nb() === 0 && SocketM.getState() !== WebSocket.OPEN) {
            SocketM.connect();
        }

        const handle_private_message = (data) => {
            console.log("handle_private_message(1) Message privé reçu via WebSocket:", data);
            if (data.login === navConv)
                setDisplayedMessages(prevMessages => [...prevMessages, data]);
        }
        SocketM.onPriv(navConv, handle_private_message);

        return () => {
            SocketM.offPriv(handle_private_message);
        };
    }, [navConv]);


    async function add_message_private(timer, navConv){

        console.log("add_message_private(1) called")
        const data = {
            time: timer,
            id: navConv,
            mess: input,
        }
        try{
            const rep = await fetch('/api/addpriv',{
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                credentials: "include",
                body: JSON.stringify(data),
            });

            const repjson = await rep.json();
            if(repjson.success)
                console.log("add_message_private(2) success")
            else
                console.log("add_message_private(3) fail", repjson.message)
        }catch(err){
            console.log("add_message_private(4) error", err)
        }
    }



    
    const handler_private = (e) => {
        console.log("handler_private(1) called: ", e.target[0].value);
        e.preventDefault();
        

        const time = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
        add_message_private(time, navConv);
        
        const data = {monMsg: true, type: 'priv_mess', message: input, timer: time, to: navConv}
        SocketM.sendd(data);
        setDisplayedMessages(prev => [...prev, data]);
        setInput("");
    }

    return (
        <>
            <div className={`PrivateMessageConv-root`}>

                    <h5>{navConv}</h5>

                    <div className="message">
                        <div>

                            {displayedMessages && displayedMessages.map((msg, index) => { return ( 

                                <div key={index} style={{border: "1px solid", padding: "0.5rem"}}>

                                    <h3>{msg.login}</h3>
                                    <p>{msg.message}</p>

                                </div>

                            );})}

                        </div>

                    </div>

                    <form onSubmit={handler_private}>
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

