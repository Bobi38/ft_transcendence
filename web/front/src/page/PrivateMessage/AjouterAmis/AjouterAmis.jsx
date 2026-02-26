/* extern */
import { useEffect, useState } from "react";

/* back */
import checkCo from "BACK/fct1.js"

/* Css */
import "./AjouterAmis.scss";

/* Components */



export default function AjouterAmis() {

    async function add_friend(name){ //socket?
        // console.log("add_friend(1) called");
        try{

            const rep = await fetch(`/api/add_friend?name=${name}`, {
                method: "GET",
                headers: {'Content-Type': 'application/json'},
                credentials: "include",
            });
            
            // console.log("add_friend(2) after fetch");
            const repjson = await rep.json();
            if (repjson.success){
                console.log("good");
            }
            if (repjson.message === "exist"){
                console.log("people not exist");
                // console.log("fetch_all_conne
                // cted(3) error back ", repjson.message);
            }
            if(repjson.message === "relation"){
                console,log("people are already friend");
            }
            else{
                console.log("errrrror back ", repjson.message);
            }
        }catch(err){
            console.log("add_friend(4) error front ", err);
        }
    }



    async function fetch_all_request_friend(){ // with co or not
        console.log("fetch_all_request_friend(1) called");
        try{

            const rep = await fetch('/api/all_request_friend', {
                method: "GET",
                headers: {'Content-Type': 'application/json'},
                credentials: "include",
            });
            
            // console.log("fetch_all_request_friend(2) after fetch");
            const repjson = await rep.json();

            if (repjson.success){
                // setResponseFriendArray(repjson.message)
                console.log("success")

            }else {
                console.log("fetch_all_request_friend(3) error back ", repjson.message);
            }
        }catch(err){
            console.log("fetch_all_request_friend(4) error front ", err);
        }
    }


    async function fetch_response_friend_request(){ // with co or not
        console.log("fetch_all_request_friend(1) called");
        try{

            const rep = await fetch('/api/all_request_friend', {
                method: "GET",
                headers: {'Content-Type': 'application/json'},
                credentials: "include",
            });
            
            // console.log("fetch_all_request_friend(2) after fetch");
            const repjson = await rep.json();

            if (repjson.success){
                // setResponseFriendArray(repjson.message)
                console.log("success")

            }else {
                console.log("fetch_all_request_friend(3) error back ", repjson.message);
            }
        }catch(err){
            console.log("fetch_all_request_friend(4) error front ", err);
        }
    }


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
