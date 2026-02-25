/* extern */
import { useEffect, useState } from "react";

/* back */
// import checkCo from "BACK/fct1.js"

/* Css */
import "./Amis.scss";

/* Components */


    
export default function Amis() {

    const [responseFriendArray, setResponseFriendArray] = useState([{ login: "titi" },{ login: "tata" }]);
    const [responseFriend, setResponseFriend] = useState();

    return (
        <div className={`Amis-root border-blue`}>
            {responseFriendArray && responseFriendArray.map((msg, index) => (
                <div key={index} className="one-friend border-green">
                    <h5>{msg.login ? msg.login : "titi"}</h5>

                    {/* <div className="div-btn">
                        <button onClick={() => {setResponseFriend({login: msg.login, response: true })}}>mp</button>
                        <button onClick={() => {setResponseFriend({login: msg.login, response: false })}}>supprimer</button>
                    </div> */}
                </div>
            ))}
            {!responseFriendArray && <p>HaHa ta pas de pote!</p> }
        </div>
    )
}
