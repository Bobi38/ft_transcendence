/* extern */
import { useEffect, useState } from "react";

/* back */
import checkCo from "BACK/fct1.js"

/* Css */
import "./AjouterAmis.scss";

/* Components */



export default function AjouterAmis() {

    const [addFriend, setAddFriend] = useState(null);
    const [responseFriend, setResponseFriend] = useState(null);
    const [responseFriendArray, setResponseFriendArray] = useState([{ login: "titi" },{ login: "tata" }]);

    
    return (
        <div className={`AjouterAmis-root border-blue`}>
                <div className={`add border-red`}>
                    <form onSubmit={(e) => {e.preventDefault(); console.log("demande envoyer", addFriend)}}>
                        <input  type="text"
                                onChange={(e) => setAddFriend(e.target.value)}/>
                        <button type="submit">add Friend</button>
                    </form>
               </div>

                <hr/>

                <div className={`response border-yellow`}>
                    {responseFriendArray && responseFriendArray.map((msg, index) => (
                        <div key={index} className="one-response border-green">
                            <h5>{msg.login ? msg.login : "titi"}</h5>

                            <div className="div-btn">
                                <button onClick={() => {setResponseFriend({login: msg.login, response: true })}}>true</button>
                                <button onClick={() => {setResponseFriend({login: msg.login, response: false })}}>false</button>
                            </div>
                        </div>
                    ))}

                </div>
        </div>
    )
}
