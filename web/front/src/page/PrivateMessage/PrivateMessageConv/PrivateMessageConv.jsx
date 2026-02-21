/* extern */
import { useEffect, useState } from "react";

/* back */
import { SocketM } from "/app/back/src/SocketManag.js";

/* Css */
import "./PrivateMessageConv.scss"; 

/* Components */

// navConv lui contient le login user
export default function PrivateMessageConv({navConv, displayedMessages, setDisplayedMessages}) {    


// const [input, setInput] = useState("");

// async function add_message_private(timer, navConv){
//     console.log("add_message_private(1) called")
//     const data={
//         time: timer,
//         id: navConv,
//         mess: input,
//     }
//     try{
//         const rep = await fetch('/api/addpriv',{
//             method: "POST",
//             headers: {'Content-Type': 'application/json'},
//             credentials: "include",
//             body: JSON.stringify(data),
//         });

//         const repp = await rep.json();
//         if(repp.success)
//             console.log("add_message_private(2) success")
//         else
//             console.log("add_message_private(3) fail", repp.message)
//     }catch(err){
//         console.log("add_message_private(4) error", err)
//     }
// }

// async function fetch_private_message({navConv}){
//     console.log("fetch_private_message(1) called: ", navConv);

//     const tok2 = navConv;

//     try{
//         const rep = await fetch('/api/getpriv', {
//             method: "POST",
//             headers: {'Content-Type': 'application/json'},
//             credentials: "include",
//             body: JSON.stringify({tok2}),
//         });
//         const repp = await rep.json();
//         if (repp.success)
//             setDisplayedMessages(message)
//         else
//             console.log("fetch_private_message(2) fail: ", repp.message);
//     }catch(err){
//         console.log("fetch_private_message(3) error: ", err);
//     }
// }
    
    // useEffect(() => {
    //     async () => { fetch_private_message({navConv}) }
    //     if (SocketM.nb() === 0 && SocketM.getState() !== WebSocket.OPEN) {
    //         SocketM.connect();
    //     }

    //     const handlePrivMessage = (data) => {
    //         console.log("Message privé reçu via WebSocket:", data);
    //         if (data.login === navConv)
    //             setDisplayedMessages(prevMessages => [...prevMessages, data]);
    //         // else
    //         //     setDisplayedConv
    //     }
    //     SocketM.onPriv(navConv, handlePrivMessage);

    //     return () => {
    //         SocketM.offPriv(handlePrivMessage);
    //     };
    // }, [navConv]);

    
    // const handler_private = (e) => {
    //     console.log("handler_private(1) called");
    //     e.preventDefault();
    //     const message = e.target[0].value;
    //     console.log("handler_private(2) : ", message);
    //     const time = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    //     const data = {monMsg: true, type: 'priv_mess', message: input, timer: time, to: navConv}
    //     add_message_private(time, navConv);
    //     SocketM.sendd(data);
    //     setDisplayedMessages(prev => [...prev, data]);
    //     setInput("");
    // }

    return (
        <>
            <div className={`PrivateMessageConv-root`}>


                    {/* <div><h5 className="center">{navConv}</h5></div>

                    <div className="PrivateMessageConv-flex2">
                        <div>

                            {displayedMessages && displayedMessages.map((msg, index) => { return ( 

                                <div key={index} style={{border: "1px solid", padding: "0.5rem"}}>

                                    <h3>{msg.login}</h3>
                                    <p>{msg.message}</p>

                                </div>

                            );})}

                        </div>

                    </div>

                    <div>
                        <form onSubmit={handler_private}>
                            <input type="text"
                            value = {input}
                            onChange={(e) => setInput(e.target.value)}
                            />
                            <button type="submit">button</button>
                        </form>
                    </div> */}

            </div>
        </>
    )
}

