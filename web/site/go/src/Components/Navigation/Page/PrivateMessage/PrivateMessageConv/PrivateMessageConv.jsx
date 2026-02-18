/* Css */
import "./PrivateMessageConv.css"; 
import SocketM from "../../../../../SocketM/SocketM";

/* Components */
import { useEffect, useState } from "react"; 

export default function PrivateMessageConv({navamis}) {    

// useEffect
// fetch(navamis = login)
// JSON
// data
// setDisplayedMessages(data)
// ws
const [displayedMessages, setDisplayedMessages] = useState([]);
const [input, setInput] = useState("");

async function addmessprivate(timer, navamis){
    const data={
        time: timer,
        id: navamis
    }
     try{
        const rep = await fetch('/api/addpriv',{
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            credentials: "include",
            body: JSON.stringify(data),
        });

        const repp = await rep.json();
        if(repp.success)
            console.log("message priv good ad to db")
        else
            console.log("err add messpriv ", repp.message)
     }catch(err){
        console.log("err front addmessprivate ", err)
     }
}

async function fetchPrivMsg({navamis}){
    console.log("fetch priv", navamis);

    const tok2 = navamis;

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
    

    const handler = (e) =>{
        e.preventDefault();
        console.log("uai handler")
    }

    useEffect(() => {
        async () => { fetchPrivMsg({navamis}) }
        if (SocketM.nb() === 0 && SocketM.getState() !== WebSocket.OPEN) {
            SocketM.connect();
        }

        const handlePrivMessage = (data) => {
            console.log("Message privé reçu via WebSocket:", data);
            setDisplayedMessages(prevMessages => [...prevMessages, data]);
        }
        SocketM.onPriv(navamis, handlePrivMessage);

        return () => {
            SocketM.offPriv(handlePrivMessage);
        };
    }, [navamis]);

    
    const handlerPriv = (e) => {
        e.preventDefault();
        const message = e.target[0].value;
        console.log("handlerPriv: ", message);
        const time = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
        const data = {monMsg: true, type: 'priv_mess', message: input, timer: time, to:}
    }
    return (
        <>

                <div className="PrivateMessageConv-flex1">

                    <div><h5 className="center">{navamis}</h5></div>

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
                        <form onSubmit={handlerPriv}>
                            <input type="text"
                            value = {input}
                            onChange={(e) => setInput(e.target.value)}
                            />
                            <button type="submit">button</button>
                        </form>
                    </div>
                    
                </div>

        </>
    )
}

