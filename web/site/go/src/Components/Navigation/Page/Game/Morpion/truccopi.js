import { useState, useEffect } from "react"
import { postJson } from "./postjson"

export default function Truc(){
    const [msg, setMsg] = useState("");

    useEffect(() => {
        const sendMessage = async () => {
            try {
                const reponse = await fetch(
                    "/api/truc",
                    postJson({message: " papa"}));

                const result = await reponse.json();
                setMsg(result.message);
            } catch (err) {console.error(err);}
        };
        sendMessage();
    }, []);

    return <p>{msg}</p>
}



