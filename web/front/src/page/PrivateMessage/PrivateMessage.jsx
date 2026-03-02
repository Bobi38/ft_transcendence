/* extern */
import { useEffect, useState } from "react";

/* back */
import  SocketM  from "/app/front/tool/SocketManag.js";

/* Css */
import "./PrivateMessage.scss";

/* Components */
import PrivateMessageConv from "./PrivateMessageConv/PrivateMessageConv.jsx"
import AjouterAmis from "./AjouterAmis/AjouterAmis.jsx"
import Amis from "./Amis/Amis.jsx"


export default function PrivateMessage() {
    
    const [goToAction, setGoToAction] = useState(2)                                                   // info  Amis / Ajouter un Amis
    const [goToConv, setGoToConv] = useState(null)                                                    // changer de conv private

    const [displayedInfoConv, setDisplayedInfoConv] = useState([]);    // la liste des conv private
    /* {UserId: 1, login: 'tata', isOnline: false, lastMessage: 'e', time: '09:05:07'} */

    const [displayedMessages, setDisplayedMessages] = useState([]);
    const [input, setInput] = useState("");
    

    
    async function fetch_go_to_conv_private (){
        console.log("fetch_go_to_conv_private(1) called");
        try{

            const rep = await fetch('/api/fetch_conv', {
                method: "GET",
                headers: {'Content-Type': 'application/json'},
                credentials: "include",
            });
            
            // console.log("fetch_go_to_conv_private(2) after fetch");
            const repjson = await rep.json();
            if (repjson.success){
                // console.log("fetch_go_to_conv_private(3) success");

                const chats = repjson.message;
                console.log("fetch_go_to_conv_private(info)", chats);
                setDisplayedInfoConv(chats)
                
            }else {
                console.log("fetch_go_to_conv_private(4) error back ", repjson.message);
            }
        }catch(err){
            console.log("fetch_go_to_conv_private(5) error front ", err);
        }
    }
    
    useEffect(() => {
        fetch_go_to_conv_private()
    }, []);









    async function fetch_private_message(goToConv) {

        // console.log("fetch_private_message(0.5) called: ", goToConv);

        if (!goToConv) return;

        console.log("fetch_private_message(1) called: ", goToConv);

        const token = goToConv;
        console.log("goToConv: ",goToConv)
        try{
            const reponse = await fetch('/api/get_chat_private', {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                credentials: "include",
                body: JSON.stringify({token}),
            });
            const repjson = await reponse.json();
            if (repjson.success){
                setDisplayedMessages(repjson.message);
                console.log("fetch_private_message(2) success: " , repjson.message);
            } else
                console.error("fetch_private_message(3) Error back");
        }catch(error){
            console.error("fetch_private_message(4) Error front: ", err);
        }
    }


    useEffect(() => {

        console.log("useEffect on est la ", goToConv);
        fetch_private_message(goToConv);
        // async () => { await fetch_private_message({goToConv}) }


        // if (SocketM.getState() && SocketM.getState() === "closed") {
        //     SocketM.connect();
        // }

        const handle_private_message = (data) => {
            console.log("handle_private_message(1) Message privé reçu via WebSocket:", data);
            if (data.login === goToConv)
                setDisplayedMessages(prev => [...prev, data]);
            fetch_go_to_conv_private(); // no need for async IIFE here 
            // (async () => {await fetch_go_to_conv_private();})();// its ok for now
            //ici nous recevrons un message ne venant pas de la conversation qui est ouverte
            // il faudra donc recuperer le message et le name/id pour remonter le message en haut de la colonne 
        
        }
        SocketM.onPriv(handle_private_message);

        return () => {
            SocketM.offPriv(handle_private_message);
        };

    }, [goToConv]);

    // const handletest = async () =>{
    //     console.log("couocu");
    //     await fetch_all_friend();
    // }
    
    return (
        <>
            <div className={`PrivateMessage-root border-0`}>

{/* ------------------------------------------------------------------------------------------- */}
                <div className={`info border-1`}>

                    <div className={`bloc-friend-addfriend border-2`}>
                        <div className="bloc-left border-3" onClick={() => {setGoToAction(1); setGoToConv(null)} }>Ajouter / Accepter<br/>Amis</div>
                        <hr/>
                        <div className="bloc-left border-3" onClick={() => {setGoToAction(2); setGoToConv(null)} }>Amis</div>
                        {/* <div className="bloc-left border-3" onClick={handletest}>test</div> */}
                    </div>

    {/* ------------------------------------------------------------------------------ */}
                    <hr className={`big`}/>
    {/* ------------------------------------------------------------------------------ */}

                    <div className={`bloc-last-conv-friend border-2`}>
                        {displayedInfoConv && displayedInfoConv.map((msg,index) => (
                            <div key={index}>
                                {index != 0 && <hr/>}
                                <div>
                                    
                                    <div className={`bloc-left border-3`} onClick={() => {setGoToAction(0); setGoToConv(msg.login);} }>
                                        <div className={`header-last-conv border-4`}>
                                            <h4>{msg.login}</h4><span>{msg.isOnline ? "🟢" : "🔴"}{msg.time}</span>
                                        </div>
                                        <p className={`truncate`} style={{ fontSize: "0.5rem" }}>{msg.lastMessage}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
{/* ------------------------------------------------------------------------------------------- */}

    {/* ------------------------------------------------------------------------------ */}
                <hr className={`big`}/>
    {/* ------------------------------------------------------------------------------ */}

{/* ------------------------------------------------------------------------------------------- */}
                <div className={`display-screen border-2`}>
                    <div className={`border-left`}></div>

                    {goToAction === 1 && <AjouterAmis />}
                    {goToAction === 2 && <Amis />}
                    {goToConv && <PrivateMessageConv login={goToConv} displayedMessages={displayedMessages} setDisplayedMessages={setDisplayedMessages} /> }
                
                </div>

{/* ------------------------------------------------------------------------------------------- */}
            </div> {/* PrivateMessage-root */}
        </>
        
    )
}

