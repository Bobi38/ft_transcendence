/* Css */
import "./PrivateMessage.scss";

/* Components */
import { useEffect, useState } from "react";
import PrivateMessageConv from "./PrivateMessageConv/PrivateMessageConv.jsx"
import Amis from "./Amis/Amis.jsx"
import AjouterAmis from "./AjouterAmis/AjouterAmis.jsx"

export default function PrivateMessage() { 
    
    const [navpri, setNavpri] = useState(1)
    const [navamis, setNavAmis] = useState(null)

    async function  fetchMsg(){
        console.log("fetchMsg(1) called");
        try {
            const rep = await fetch('/api/getprivatechat/user', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: "include"
            });
            
            const repjson = await rep.json();
            if (repjson.success){
                console.log("fetchMsg(2)" , repjson.message);
                
                setDisplayedMessages(repjson.message);
                
            }else{
                alerte("message get from db failed");
        }
        } catch (error) {
            console.error("Error fetching messages:", error);
        }

    }
    
    useEffect(() => {
        // (async () => {await fetchMsg();})();
    }, []);
    
    
    const [displayedMessages, setDisplayedMessages] = useState([{login: "titou"},{login: "flo"}]);
    
    return (
        <>
            <div className="PrivateMessage-flex PrivateMessage-bg fullh">


{/* ------------------------------------------------------------------------------------------- */}
                <div className="PrivateMessage-info">

                    <div className="PrivateMessage-bloc-friend-message ">
                        <div className="center PrivateMessage-bloc-left" onClick={() => {setNavpri(1); setNavAmis(null)} }>Amis</div>
                        <div className="PrivateMessage-border-bottom"></div>
                        <div className="center PrivateMessage-bloc-left" onClick={() => {setNavpri(2); setNavAmis(null)} }>Ajouter un Amis</div>
                    </div>

    {/* ------------------------------------------------------------------------------ */}
                    <div className="PrivateMessage-border-bottom-big fullw"></div>
    {/* ------------------------------------------------------------------------------ */}

                    <div className="PrivateMessage-bloc-friend-message ">
                        
                        {displayedMessages && displayedMessages.map((msg, index) => (
                            <>

                                <div key={index} className={`center PrivateMessage-bloc-left`} onClick={() => {setNavpri(0); setNavAmis(msg.login);} }>

                                    <h4>{msg.login}</h4>

                                </div>

                                <div className="PrivateMessage-border-bottom"></div>

                            </>
                        ))}

                    </div>

                </div>
{/* ------------------------------------------------------------------------------------------- */}


                <div className="PrivateMessage-border-left"></div>

                    {/* {{navpri &&

                        switch (navpri)
                        <Amis /> 
                        <AjouterAmis />

                    }} */}
                        {navamis && <PrivateMessageConv navamis={navamis}/> }
            </div>
        </>
    )
}
