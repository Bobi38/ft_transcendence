/* extern */
import { useEffect, useState } from "react";

/* back */
// import checkCo from "BACK/fct1.js"

/* Css */
import "./Amis.scss";

/* Components */


    
export default function Amis() {


    const [responseFriendArray, setResponseFriendArray] = useState([{ login: "titi" },{ login: "tata" }]);


    async function fetch_all_friend(){ // with co or not
        console.log("fetch_all_friend(1) called");
        try{

            const rep = await fetch('/api/friend/all_friend', {
                method: "GET",
                headers: {'Content-Type': 'application/json'},
                credentials: "include",
            });
            
            // console.log("fetch_all_friend(2) after fetch");
            const repjson = await rep.json();
            console.log("fetch_all_friend(2.5) repjson: ",repjson.message);

            if (repjson.success){
                // setResponseFriendArray(repjson.message)
                console.log("success")
                console.log(repjson.message[0].Friends[0].name);
                console.log(repjson.message[0].Friends[1].name);
                console.log(repjson.message[0].FriendOf[0].name);

            }else {
                console.log("fetch_all_friend(3) error back ", repjson.message);
            }
        }catch(err){
            console.log("fetch_all_friend(4) error front ", err);
        }
    }



    async function dlt_friend(name){ //socket?
        // console.log("fetch_all_connected(1) called");
        try{

            const rep = await fetch(`/api/friend/dlt_friend?name=${name}`, {
                method: "GET",
                headers: {'Content-Type': 'application/json'},
                credentials: "include",
            });
            
            // console.log("fetch_all_connected(2) after fetch");
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
                console,log("people are not friend");
            }
            else{
                console.log("errrrror back ", repjson.message);
            }
        }catch(err){
            console.log("fetch_all_connected(4) error front ", err);
        }
    }


    useEffect(() => {
        fetch_all_friend();
    }, []);


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
