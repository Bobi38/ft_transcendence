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
    const [displayedInfoConv, setDisplayedInfoConv] = useState([{login: "titi"},{login: "tata"}]);    // la liste des conv private

    const [displayedMessages, setDisplayedMessages] = useState([]);
    const [input, setInput] = useState("");
    
    async function fetch_all_friend(){ // with co or not
        // console.log("fetch_all_friend(1) called");
        try{

            const rep = await fetch('/api/all_friend', {
                method: "GET",
                headers: {'Content-Type': 'application/json'},
                credentials: "include",
            });
            
            // console.log("fetch_all_friend(2) after fetch");
            const repjson = await rep.json();
            if (repjson.success){
            }else {
                // console.log("fetch_all_friend(3) error back ", repjson.message);
            }
        }catch(err){
            // console.log("fetch_all_friend(4) error front ", err);
        }
    }

    async function add_friend(){ //socket?
        // console.log("fetch_all_connected(1) called");
        try{

            const rep = await fetch('/api/', {
                method: "GET",
                headers: {'Content-Type': 'application/json'},
                credentials: "include",
            });
            
            // console.log("fetch_all_connected(2) after fetch");
            const repjson = await rep.json();
            if (repjson.success){
            }else {
                // console.log("fetch_all_connected(3) error back ", repjson.message);
            }
        }catch(err){
            // console.log("fetch_all_connected(4) error front ", err);
        }
    }














    
    async function fetch_go_to_conv_private (){
        // console.log("fetch_go_to_conv_private(1) called");
        try{

            const rep = await fetch('/api/fetchConv', {
                method: "GET",
                headers: {'Content-Type': 'application/json'},
                credentials: "include",
            });
            
            // console.log("fetch_go_to_conv_private(2) after fetch");
            const repjson = await rep.json();
            if (repjson.success){
                // console.log("fetch_go_to_conv_private(3) success");

                const chats = repjson.message;
                // console.log("fetch_go_to_conv_private(info) ", chats[0].PrivMesses[0].contenu)
                // console.log("fetch_go_to_conv_private(info) ", chats[1].PrivMesses[0].contenu)
                // console.log("fetch_go_to_conv_private(info) test join ", chats[0].user1.name);
                //Chat est un tableau 0-1-2-3-....
                //chaque partie du tableau est le dernier message d une conversation
                //PrivMesses est un tableau d une taille de 1 car qu un seul message
                //dans chaque message il y a le nom des deux personnes dans la conversation= .user1 et .user2
                // un des deux c'est me
                // il faudra donc checker chaque chat[i] pour savoir si me est .user1 ou .user2 et mettre a jour la colonne des conversation
                // puis setDisplayedInfoConv
            }else {
                // console.log("fetch_go_to_conv_private(4) error back ", repjson.message);
            }
        }catch(err){
            // console.log("fetch_go_to_conv_private(5) error front ", err);
        }
    }
    
    useEffect(() => {
        (async () => {await fetch_go_to_conv_private();})();
    }, []);









    async function fetch_private_message(goToConv) {

        console.log("fetch_private_message(0.5) called: ", goToConv);

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
    
    return (
        <>
            <div className={`PrivateMessage-root`}>

{/* ------------------------------------------------------------------------------------------- */}
                <div className={`info`}>

                    <div className={`bloc-friend-addfriend`}>
                        <div className="bloc-left" onClick={() => {setGoToAction(1); setGoToConv(null)} }>Ajouter / Accepter<br/>Amis</div>
                        {/* <div className={`border-bottom`}></div> */}
                        <hr/>
                        <div className="bloc-left" onClick={() => {setGoToAction(2); setGoToConv(null)} }>Amis</div>
                    </div>

    {/* ------------------------------------------------------------------------------ */}
                    <hr className={`big`}/>
    {/* ------------------------------------------------------------------------------ */}

                    <div className={`bloc-friend-message`}>
                        
                        {displayedInfoConv && displayedInfoConv.map((msg, index) => (
                            <>

                                <div key={index} className={`bloc-left`} onClick={() => {setGoToAction(0); setGoToConv(msg.login);} }>

                                    <h4>{msg.login}</h4>

                                </div>

                                <div className={`border-bottom`}></div>

                            </>
                        ))}

                    </div>

                </div>
{/* ------------------------------------------------------------------------------------------- */}

    {/* ------------------------------------------------------------------------------ */}
                <hr className={`big`}/>
    {/* ------------------------------------------------------------------------------ */}

{/* ------------------------------------------------------------------------------------------- */}
                <div className={`display-screen`}>
                    <div className={`border-left`}></div>

                    {goToAction && goToAction == 1 ? <AjouterAmis /> : <Amis />}
                    {goToConv && <PrivateMessageConv login={goToConv} displayedMessages={displayedMessages} setDisplayedMessages={setDisplayedMessages} /> }
                
                </div>

{/* ------------------------------------------------------------------------------------------- */}
            </div> {/* PrivateMessage-root */}
        </>
    )
}
