/* extern */
import { useEffect, useState } from "react";

/* back */
// import checkCo from "BACK/fct1.js"

/* Css */
import "./AjouterAmis.scss";

/* Components */



export default function AjouterAmis() {

    const fetchtype = {
        method: "GET",
        headers: {'Content-Type': 'application/json'},
        credentials: "include",
    }

    async function add_friend(name){
        console.log("add_friend(1) called: ", name);
        try{

            const rep = await fetch(`/api/friend/add_friend?name=${name}`, fetchtype);
            
            // console.log("add_friend(2) after fetch");
            const repjson = await rep.json();
            if (repjson.success) {
                console.log("add_friend(info) good");
            } else {
                if (repjson.message === undefined) {
                    console.log("add_friend(info) people not exist");
                } else if (repjson.message === name) {
                    console,log("add_friend(info) people are already friend");
                } else {
                    console.log("add_friend(3) error back ", repjson.message);
                }
            }
        } catch(err) {
            console.log("add_friend(4) error front ", err);
        }
    }



    async function fetch_all_request_friend(){
        // console.log("fetch_all_request_friend(1) called");
        try{

            const rep = await fetch('/api/friend/all_request_friend',fetchtype);
            
            // console.log("fetch_all_request_friend(2) after fetch");
            const repjson = await rep.json();

            if (repjson.success){
                setResponseFriendArray(repjson.message)
                console.log("fetch_all_request_friend(info) success")

            }else {
                console.log("fetch_all_request_friend(3) error back ", repjson.message);
            }
        }catch(err){
            console.log("fetch_all_request_friend(4) error front ", err);
        }
    }


    async function fetch_response_friend_request(){
        console.log("fetch_response_friend_request(1) called");
        try{

            const rep = await fetch('/api/friend/all_request_friend', fetchtype);
            
            // console.log("fetch_response_friend_request(2) after fetch");
            const repjson = await rep.json();

            if (repjson.success){
                setResponseFriendArray(repjson.message)
                console.log("success")

            }else {
                console.log("fetch_response_friend_request(3) error back ", repjson.message);
            }
        }catch(err){
            console.log("fetch_response_friend_request(4) error front ", err);
        }
    }


    // useEffect(() => {fetch_all_request_friend()}, []);


    const [responseFriendArray, setResponseFriendArray] = useState([{ login: "titi" },{ login: "tata" }]);

    const handel_form = (e) =>{
        console.log("handel_form(1) called")
        const el_add_friend = document.getElementById("add-friend")
        console.log("handel_form(2) demande envoyer", el_add_friend.value)
        add_friend(el_add_friend.value)
        console.log("handel_form(info) clear input value")
        el_add_friend.value = ""
    }
    
    const handel_response = (arg) =>{
        console.log("requestfriend finish", arg)
        // send => responseFriend
    }


    return (

        <div className={`AjouterAmis-root border-0`}>
            <div className={`add border-1`}>
                <form onSubmit={(e) => {e.preventDefault(); handel_form(e)}}>
                    <input  type={`text`} id={`add-friend`}/>
                    <button type={`submit`}>add Friend</button>
                </form>
            </div>

            <hr/>

            <div className={`response border-1`}>

                {responseFriendArray && responseFriendArray.map((msg, index) => (

                    <div key={index}>
                        {index != 0 && <hr/>}
                        <div className={`one-response border-2`}>

                            <h5>{msg.login}</h5>

                            <div className={`div-btn border-3`}>
                                <button onClick={() => {handel_response({login: msg.login, response: true })}}>true</button>
                                <button onClick={() => {handel_response({login: msg.login, response: false })}}>false</button>
                            </div>

                        </div>
                    </div>

                ))}

            </div>
        </div>

    )
}
