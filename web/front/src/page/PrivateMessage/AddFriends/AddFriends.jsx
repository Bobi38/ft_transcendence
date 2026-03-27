/* extern */
import { useEffect, useState } from "react";

/* back */

/* Css */
import "./AddFriends.scss";

/* Components */
import useFetch from "HOOKS/useFetch.jsx";
import Hr from    "FRONT/Component/Hr/Hr.jsx";

export default function AddFriends() {
    const fetch_type = {
        method: "GET",
        headers: {'Content-Type': 'application/json'},
        credentials: "include",
    }

    const [responseFriendArray, setResponseFriendArray] = useState({
        Fme:[],
        Fother:[]
    });

    async function add_friend(name){
        if (!name)
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
        if (!repjson || (repjson &&  !repjson.success))
            return;
        console.log("add_friend(info) good");
    }


    async function fetch_all_request_friend(){
        const url = `/api/friend/all_request_friend`;

        console.log(`${url}`)

        const repjson = await useFetch(`${url}`, fetch_type)
        if (!repjson || (repjson &&  !repjson.success))
            return;
        console.log("all_request_friend", repjson.message)
        setResponseFriendArray(repjson.message)
    }



    useEffect(() => {fetch_all_request_friend()}, []);


    const handel_form = (e) =>{
        console.log("handel_form(1) called")
        const el_add_friend = document.getElementById("add-friend")
        console.log("handel_form(2) demande envoyer", el_add_friend.value)
        add_friend(el_add_friend.value)
        console.log("handel_form(info) clear input value")
        el_add_friend.value = ""
    }
    
    const handel_response = async (arg) => {
        console.log("requestfriend finish", arg)

        const url = `/api/friend/response_friend`;

        console.log(`${url}`)

        const repjson = await useFetch(`${url}`, {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        credentials: "include",
        body: JSON.stringify(arg)
    })
        if (!repjson || (repjson &&  !repjson.success))
            return;
        await fetch_all_request_friend()
    }


    return (

        <div className={`AddFriends-root border-0`}>
            <div className={`add border-1`}>
                <form onSubmit={(e) => {e.preventDefault(); handel_form(e)}}>
                    <input  type={`text`} id={`add-friend`}/>
                    <button type={`submit`}>add Friend</button>
                </form>
            </div>

            <hr className={`big`}/>

            <div className={`response border-1`}>

                <Hr mode={`column`} initial={120} min1={100} thickness={2}>

                    <div className={`bloc1`}>
                        <h4>Sended request</h4>
                        {responseFriendArray.Fme && responseFriendArray.Fme.map((msg, index) => (
                            <div key={`me-${index}`}>
                                <div className={`one-response border-2`}>
                                <h5>{msg.login}</h5>
                                    <div className={`div-btn border-3`}>
                                        <button onClick={() => {handel_response({login: msg.login, response: false })}}>Suprimer</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>


                    <div className={`bloc2`}>
                        <h4>Receve request</h4>
                        {responseFriendArray.Fother && responseFriendArray.Fother.map((msg, index) => (
                            <div key={`other-${index}`}>
                                <div className={`one-response border-2`}>
                                <h5>{msg.login}</h5>
                                    <div className={`div-btn border-3`}>
                                        <button onClick={() => {handel_response({login: msg.login, response: true })}}>accepter</button>
                                        <button onClick={() => {handel_response({login: msg.login, response: false })}}>refuser </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </Hr>
            </div>
        </div>

    )
}
