/* Css */
import "./PrivateMessage.css";

/* Components */
import { useEffect, useState } from "react";

export default function PrivateMessage() { 
    
    
    const [displayedMessages, setDisplayedMessages] = useState([
        {login: "test1"},
        {login: "test2"},
        {login: "test3"},
    ]);

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


    return (
        <>
            <div className="full PrivateMessage-flex PrivateMessage-bg">

                <div className="full PrivateMessage-info">
                    <div>
                        <button>Amis</button>
                        <div className="PrivateMessage-border-bottom"></div>
                        <button>Ajouter un Amis</button>
                        <div className="PrivateMessage-border-bottom fullw"></div>
                    </div>

                    <div>
                        {displayedMessages && displayedMessages.map((msg, index) => (
                            <>
                                <div key={index} className={``}>
                                    <h4>{msg.login}</h4>
                                </div>
                                <div className="PrivateMessage-border-bottom"></div>
                            </>
                        ))}
                    </div>
                </div>


                <div className="PrivateMessage-border-left">

                </div>


                <div className="full">display</div>

            </div>
        </>
    )
}
