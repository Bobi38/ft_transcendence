/* Css */
import "./PrivateMessage.css";

/* Components */
import { useEffect, useState } from "react";

export default function PrivateMessage() { 
    
    
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

                <div className="full PrivateMessage-info">info</div>
                <div className="full">display</div>

            </div>
        </>
    )
}
