/* Css */
import "./PrivateMessage.css";

/* Components */
import { useEffect, useState } from "react";
import PrivateMessageConv from "./PrivateMessageConv/PrivateMessageConv.jsx"
import Amis from "./Amis/Amis.jsx"
import AjouterAmis from "./AjouterAmis/AjouterAmis.jsx"

export default function PrivateMessage() { 
    
    const [NavInfo, setNavInfo] = useState(1)                                                         // info  Amis / Ajouter un Amis

    const [navConv, setNavConv] = useState(null)                                                            // changer de conv private
    const [displayedConvPrivate, setDisplayedConvPrivate] = useState([{login: "titou"},{login: "flo"}]);    // la liste des conv private
    const [displayedMessages, setDisplayedMessages] = useState([]);


    async function fetchPrivMsg({navConv}){
        console.log("fetch priv", navConv);

        const tok2 = navConv;

        try{
            const rep = await fetch('/api/getpriv', {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                credentials: "include",
                body: JSON.stringify({tok2}),
            });
            const repp = await rep.json();
            if (repp.success)
                setDisplayedMessages(message)
            else
                console.log("fetch getpriv fail ", repp.message);
        }catch(err){
            console.log("fetch getpriv error ", err);
        }
    }

    async function fetchConvPrivate (){
        try{
            const rep = await fetch('/api/fetchConv', {
                method: "GET",
                headers: {'Content-Type': 'application/json'},
                credentials: "include",                
            });
            const repp = await rep.json();
            if (repp.success){
                const chats = repp.message;
                console.log("chattt 1 ", chats[0].PrivMesses[0].contenu)
                console.log("chattt 2 ", chats[1].PrivMesses[0].contenu)
                console.log("test join ", chats[0].user1.name);
                //Chat est un tableau 0-1-2-3-....
                //chaque partie du tableau est le dernier message d une conversation
                //PrivMesses est un tableau d une taille de 1 car qu un seul message
                //dans chaque message il y a le nom des deux personnes dans la conversation= .user1 et .user2
                // un des deux c'est me
                // il faudra donc checker chaque chat[i] pour savoir si me est .user1 ou .user2 et mettre a jour la colonne des conversation
                // puis setDisplayedConvPrivate
            }
            else
                console.log("error fectchConv back ", repp.message);
        }catch(err){
            console.log("error fetchConv front ", err);
        }
    }
    
    useEffect(() => {
        (async () => {await fetchConvPrivate();})();
    }, []);
    
    useEffect(() => {
        if (!navConv) return;
        async () => { fetchPrivMsg({navConv}) }
        if (SocketM.nb() === 0 && SocketM.getState() !== WebSocket.OPEN) {
            SocketM.connect();
        }

        const handlePrivMessage = (data) => {
            console.log("Message privé reçu via WebSocket:", data);
            if (data.login === navConv)
                setDisplayedMessages(prevMessages => [...prevMessages, data]);
            else
                setDisplayedConvPrivate();
                //ici nous recevrons un message ne venant pas de la conversation qui est ouverte
                // il faudra donc recuperer le message et le name/id pour remonter le message en haut de la colonne 
        
        }
        SocketM.onPriv(handlePrivMessage);

        return () => {
            SocketM.offPriv(handlePrivMessage);
        };
    }, [navConv]);
    
    return (
        <>
            <div className="PrivateMessage-flex PrivateMessage-bg fullh">


{/* ------------------------------------------------------------------------------------------- */}
                <div className="PrivateMessage-info">

                    <div className="PrivateMessage-bloc-friend-message ">
                        <div className="center PrivateMessage-bloc-left" onClick={() => {setNavInfo(1); setNavConv(null)} }>Amis</div>
                        <div className="PrivateMessage-border-bottom"></div>
                        <div className="center PrivateMessage-bloc-left" onClick={() => {setNavInfo(2); setNavConv(null)} }>Ajouter un Amis</div>
                    </div>

    {/* ------------------------------------------------------------------------------ */}
                    <div className="PrivateMessage-border-bottom-big fullw"></div>
    {/* ------------------------------------------------------------------------------ */}

                    <div className="PrivateMessage-bloc-friend-message ">
                        
                        {displayedConvPrivate && displayedConvPrivate.map((msg, index) => (
                            <>

                                <div key={index} className={`center PrivateMessage-bloc-left`} onClick={() => {setNavInfo(0); setNavConv(msg.login);} }>

                                    <h4>{msg.login}</h4>

                                </div>

                                <div className="PrivateMessage-border-bottom"></div>

                            </>
                        ))}

                    </div>

                </div>
{/* ------------------------------------------------------------------------------------------- */}


                <div className="PrivateMessage-border-left"></div>

                    {/* {{navInfo &&

                        switch (navInfo)
                        <Amis /> 
                        <AjouterAmis />

                    }} */}
                    {navConv && <PrivateMessageConv navConv={navConv} displayedMessages={displayedMessages} setDisplayedMessages={setDisplayedMessages} /> }
            </div>
        </>
    )
}
