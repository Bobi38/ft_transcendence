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
            if (repp.success)
                setDisplayedConvPrivate(repp.message);
            else
                console.log("error fectchConv back ", repp.message);
        }catch(err){
            console.log("error fetchConv front ", err);
        }
    }
    
    useEffect(() => {
        // (async () => {await fetchMsg();})();
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
                setDisplayedConvPrivate(); // COMMENT METTRE A JOUR ??
        
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
