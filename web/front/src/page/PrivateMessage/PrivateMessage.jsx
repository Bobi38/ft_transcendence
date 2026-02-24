/* extern */
import { useEffect, useState } from "react";

/* back */
import { SocketM } from "/app/front/tool/SocketManag.js";

/* Css */
import "./PrivateMessage.scss";

/* Components */
import PrivateMessageConv from "./PrivateMessageConv/PrivateMessageConv.jsx"
// import Amis from "./Amis/Amis.jsx"
// import AjouterAmis from "./AjouterAmis/AjouterAmis.jsx"

export default function PrivateMessage() { 
    
    const [navInfo, setNavInfo] = useState(1)                                                         // info  Amis / Ajouter un Amis

    const [navConv, setNavConv] = useState(null)                                                            // changer de conv private
    const [displayedConvPrivate, setDisplayedConvPrivate] = useState([{login: "titou"},{login: "flo"}]);    // la liste des conv private
    const [displayedMessages, setDisplayedMessages] = useState([]);
    const [input, setInput] = useState("");


    async function fetch_private_message({navConv}){
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
                console.log("fetch_private_message(2) error back ", repjson.message);
        }catch(err){
            console.log("fetch_private_message(3) error front ", err);
        }
    }

    async function fetch_conv_private (){
        try{
            const rep = await fetch('/api/fetchConv', {
                method: "GET",
                headers: {'Content-Type': 'application/json'},
                credentials: "include",                
            });
            const repjson = await rep.json();
            if (repjson.success){
                const chats = repjson.message;
                console.log("fetch_conv_private(1) ", chats[0].PrivMesses[0].contenu)
                console.log("fetch_conv_private(2) ", chats[1].PrivMesses[0].contenu)
                console.log("fetch_conv_private(3) test join ", chats[0].user1.name);
                //Chat est un tableau 0-1-2-3-....
                //chaque partie du tableau est le dernier message d une conversation
                //PrivMesses est un tableau d une taille de 1 car qu un seul message
                //dans chaque message il y a le nom des deux personnes dans la conversation= .user1 et .user2
                // un des deux c'est me
                // il faudra donc checker chaque chat[i] pour savoir si me est .user1 ou .user2 et mettre a jour la colonne des conversation
                // puis setDisplayedConvPrivate
            }
            else
                console.log("fetch_conv_private(1) error back ", repjson.message);
        }catch(err){
            console.log("fetch_conv_private(2) error front ", err);
        }
    }
    
    useEffect(() => {
        (async () => {await fetch_conv_private();})();
    }, []);
    

    useEffect(() => {

        if (!navConv) return;
        async () => { fetch_private_message({navConv}) }
        if (SocketM.nb() === 0 && SocketM.getState() !== WebSocket.OPEN) {
            SocketM.connect();
        }

        const handle_priv_message = (data) => {
            console.log("Message privé reçu via WebSocket:", data);
            if (data.login === navConv)
                setDisplayedMessages(prevMessages => [...prevMessages, data]);
            else
                setDisplayedConvPrivate();
                //ici nous recevrons un message ne venant pas de la conversation qui est ouverte
                // il faudra donc recuperer le message et le name/id pour remonter le message en haut de la colonne 
        
        }
        SocketM.onPriv(handle_priv_message);

        return () => {
            SocketM.offPriv(handle_priv_message);
        };
    }, [navConv]);
    
    return (
        <>
            <div className={`PrivateMessage-root`}>

{/* ------------------------------------------------------------------------------------------- */}
                <div className={`info`}>

                    <div className={`bloc-friend-addfriend`}>
                        <div className="bloc-left" onClick={() => {setNavInfo(1); setNavConv(null)} }>Amis</div>
                        <div className={`border-bottom`}></div>
                        <div className="bloc-left" onClick={() => {setNavInfo(2); setNavConv(null)} }>Ajouter un Amis</div>
                    </div>

    {/* ------------------------------------------------------------------------------ */}
                    <div className={`border-bottom-big`}></div>
    {/* ------------------------------------------------------------------------------ */}

                    <div className={`bloc-friend-message`}>
                        
                        {displayedConvPrivate && displayedConvPrivate.map((msg, index) => (
                            <>

                                <div key={index} className={`bloc-left`} onClick={() => {setNavInfo(0); setNavConv(msg.login);} }>

                                    <h4>{msg.login}</h4>

                                </div>

                                <div className={`border-bottom`}></div>

                            </>
                        ))}

                    </div>

                </div>
{/* ------------------------------------------------------------------------------------------- */}

    {/* ------------------------------------------------------------------------------ */}
                <div className={`border-left`}></div>
    {/* ------------------------------------------------------------------------------ */}

{/* ------------------------------------------------------------------------------------------- */}
                <div className={`display-screen`}>
                    <div className={`border-left`}></div>

                    {/* {{navInfo &&

                    switch (navInfo)
                    <Amis /> 
                    <AjouterAmis />

                    }} */}
                    {navConv && <PrivateMessageConv navConv={navConv} displayedMessages={displayedMessages} setDisplayedMessages={setDisplayedMessages} /> }
                
                </div>

{/* ------------------------------------------------------------------------------------------- */}
            </div> {/* PrivateMessage-root */}
        </>
    )
}
