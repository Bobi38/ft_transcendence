/* extern */
import { useEffect, useState } from "react";

/* back */
// import checkCo from "BACK/fct1.js"

/* Css */
import "./AjouterAmis.scss";

/* Components */
import useFetch from "HOOKS/useFetch.jsx";

export default function AjouterAmis() {
    const fetch_type = {
        method: "GET",
        headers: {'Content-Type': 'application/json'},
        credentials: "include",
    }

    async function add_friend(name){
        if (!goToConv)
            return;

        const url = `/api/friend/add_friend?name=${name}`;

        console.log(`${url}`)

        const repjson = await useFetch(`${url}`, fetch_type, null , function(repjson) {
            if (repjson.message === undefined) {
                console.log("add_friend callbackfail(info) people not exist");
            } else if (repjson.message === name) {
                console,log("add_friend callbackfail(info) people are already friend");
            } else {
                console.log("add_friend callbackfail(info) error back ", repjson.message);
            }
        })
        if (!repjson && !repjson.success)
            return;
        console.log("add_friend(info) good");
    }


    async function fetch_all_request_friend(){
        const url = `/api/friend/all_request_friend`;

        console.log(`${url}`)

        const repjson = await useFetch(`${url}`, fetch_type)
        if (!repjson && !repjson.success)
            return;
        setResponseFriendArray(repjson.message)
    }

    
    // async function fetch_response_friend_request(){
    //     const url = `/api/friend/all_request_friend`;//todo

    //     console.log(`${url}`)

    //     const repjson = await useFetch(`${url}`, fetch_type)
    //     if (!repjson)
    //         return;
    //     setResponseFriendArray(repjson.message)
    // }
    


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
