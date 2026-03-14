/* extern */
import { useEffect, useState } from "react";

/* back */
// import { useSocket } from "../../../tool/SocketContext";
import  SocketM  from "/app/tool/SocketManag.js";

/* Css */
import "./PrivateMessage.scss";

/* Components */
import useFetch from "HOOKS/useFetch";
import PrivateMessageConv from "./PrivateMessageConv/PrivateMessageConv.jsx"
import AjouterAmis from "./AjouterAmis/AjouterAmis.jsx"
import Amis from "./Amis/Amis.jsx"
import Hr from    "FRONT/Component/Hr/Hr.jsx";


export default function PrivateMessage() {
    
    const [goToAction, setGoToAction] = useState(2)                                                     // info  Amis / Ajouter un Amis
    const [goToConv, setGoToConv] = useState(null)                                                      // changer de conv private

    const [displayedInfoConv, setDisplayedInfoConv] = useState([]);                                     // la liste des conv private
    /* {UserId: 1, login: 'tata', isOnline: false, lastMessage: 'e', time: '09:05:07'} */

    const [displayedMessages, setDisplayedMessages] = useState([]);
    const [input, setInput] = useState("");
    

    async function fetch_go_to_conv_private(){

        const repjson = await useFetch('/api/chatP/fetch_conv', {
            method: "GET",
            headers: {'Content-Type': 'application/json'},
            credentials: "include",
        });
        if (!repjson || (repjson &&  !repjson.success))
            return;
        setDisplayedInfoConv(repjson.message)
    }

    useEffect(() => {
        fetch_go_to_conv_private()
    }, []);


    async function fetch_private_message(goToConv){

        if (!goToConv)
            return;

        const url = `/api/chatP/get_chat_private`;

        console.log(`${url} goToConv: `,goToConv)

        const repjson = await useFetch(`${url}`, {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            credentials: "include",
            body: JSON.stringify({token: goToConv}),
        })
        if (!repjson || (repjson &&  !repjson.success))
            return;
        
        setDisplayedMessages(repjson.message);
    }


useEffect(() => {

        fetch_private_message(goToConv);

        const handle_private_message = (data) => {
            console.log("handle_private_message(1) Message privé reçu via WebSocket:", data);
            if (data.login === goToConv || data.monMsg == true)
                setDisplayedMessages(prev => [...prev, data]);
            fetch_go_to_conv_private();
        }
        SocketM.on("priv", handle_private_message, "un");

        return () => {
            SocketM.off("priv", "un");
        };

    }, [goToConv]);
    
    return (
        <>
            <div className={`PrivateMessage-root border-0`}>

                <Hr initial={160} min1={160} thickness={5}>

                    <div className={`info border-1`}>

                        <div className={`bloc-friend-addfriend border-2`}>
                            <div className="bloc-left border-3" onClick={() => {setGoToAction(1); setGoToConv(null)} }><p>Ajouter / Accepter</p><p>Amis</p></div>
                            <hr/>
                            <div className="bloc-left border-3" onClick={() => {setGoToAction(2); setGoToConv(null)} }><p>Amis</p></div>
                        </div>

                        <hr className={`big`}/>

                        <div className={`bloc-last-conv-friend border-2`}>
                            {displayedInfoConv && displayedInfoConv.map((msg,index) => (
                                <div key={index} className={`bloc-left border-3`} onClick={() => {setGoToAction(0); setGoToConv(msg.login);} }>
                                    <div className={`header-last-conv border-4`}>
                                        <h4>{msg.login}</h4><span>{msg.isOnline ? "🟢" : "🔴"}{msg.time}</span>
                                    </div>
                                    <p className={`truncate`} style={{ fontSize: "0.5rem" }}>{msg.lastMessage}</p>
                                </div>
                            ))}
                        </div>

                    </div>

                    <div className={`display-screen border-2`}>

                        {goToAction === 1 && <AjouterAmis />}
                        {goToAction === 2 && <Amis setGoToAction={setGoToAction} setGoToConv={setGoToConv}/>}
                        {goToConv && <PrivateMessageConv login={goToConv} displayedMessages={displayedMessages} setDisplayedMessages={setDisplayedMessages} /> }
                    
                    </div>

                </Hr>

            </div>
        </>
        
    )
}

