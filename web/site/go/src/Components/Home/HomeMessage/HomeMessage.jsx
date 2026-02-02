/* Css */
import "../../../index.css"
import "./HomeMessage.css";

/* Components */
import { useState } from "react";

export default function HomeMessage({message, grid_style}) {

    const [input, setInput] = useState("");
    const [displayedMessage, setDisplayedMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        setDisplayedMessage(input);
        setInput(""); // optionnel : reset le champ
    };
    

    // async function  fetchMsg(){
    //     const reponse = await fetch('/api/getchat', {
    //             method: 'GET',
    //             headers: { 'Content-Type': 'application/json' },
    //             credentials: "include"
    //         });

    //     const rep = await reponse.json();
    //     if (rep.succes){
    //         const chat = rep.ret;
    //     }

    // }

    // async function addmess(){}
    return (
        <>
            <div className={`${grid_style} message center`}>

                    <div className="display-message ">


                        {/* {fetchMsg()} */}
                    </div>

                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <input type="submit"></input>
                    </form>
           
            </div>
        </>
    )
}
