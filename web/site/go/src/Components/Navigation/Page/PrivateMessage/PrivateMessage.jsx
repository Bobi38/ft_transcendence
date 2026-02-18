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
                
                setDisplayedConvPrivate(repjson.message);
                
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
                    {navConv && <PrivateMessageConv navConv={navConv}/> }
            </div>
        </>
    )
}
