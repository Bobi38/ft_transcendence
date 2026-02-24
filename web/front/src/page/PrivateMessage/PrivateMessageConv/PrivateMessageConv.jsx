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

    // async function fetch_private_message({navConv}) {
    //     console.log("fetch_private_message(1) called: ", navConv);

    //     const tok2 = navConv;

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

    //     async () => { fetch_private_message({navConv}) }


    //     if (SocketM.getState() === "closed") {
    //         SocketM.connect();
    //     }

    //     const handle_private_message = (data) => {

    //         console.log("handle_private_message(1) Message privé reçu via WebSocket:", data);
    //         if (data.login === navConv)
    //             setDisplayedMessages(prevMessages => [...prevMessages, data]);
    //     }
    //     SocketM.onPriv(navConv, handle_private_message);

    //     return () => {
    //         SocketM.offPriv(handle_private_message);
    //     };
    // }, [navConv]);




    async function add_private_message(time, navConv){
        console.log("add_private_message(1) called: ", input)
        const data = {
            message: input,
            time: time,
            id: navConv,
        }

        try{
            const reponse = await fetch('/api/add_message_private',{
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
        const data = {monMsg: true, type: 'priv_mess', message: input, timer: time, to: navConv}

        console.log("handle_submit(2): ", data);

        const data2 = {...data, monMsg: false};

        add_private_message(time, navConv);

        console.log("handle_submit(3) send via WebSocket data2:", data2);
        SocketM.sendd(data2);
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

