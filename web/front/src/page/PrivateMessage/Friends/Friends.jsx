/* extern */
import { useEffect, useState } from "react";

/* back */

/* Css */
import "./Friends.scss";

/* Components */
import useFetch from "HOOKS/useFetch.jsx";


    
export default function Friends({setGoToAction, setGoToConv}) {


    console.log("Friends Components called")

    const [responseFriendArray, setResponseFriendArray] = useState([]);


    async function all_friend(){
        const url = `/api/friend/all_friend`;

        console.log(`${url}`)

        const repjson = await useFetch(`${url}`, {
                method: "GET",
                headers: {'Content-Type': 'application/json'},
                credentials: "include",
            })
        if (!repjson || (repjson &&  !repjson.success))
            return;
        console.log("all_friend", repjson.message);
        setResponseFriendArray(repjson.message)
    }

    async function dlt_friend(name){

        if (!name)
            return;

        const url = `/api/friend/dlt_friend?name=${name}`;
        console.log(`${url}`)
        const repjson = await useFetch(`${url}`, {
                method: "GET",
                headers: {'Content-Type': 'application/json'},
                credentials: "include",
            }, null , function(repjson) {
                if (repjson.message === "exist") {
                    console.log("dlt_friend callbackfail(info) people not exist");
                } else if (repjson.message === "relation") {
                    console,log("dlt_friend callbackfail(info) people are not friend");
                } else {
                    console.log("dlt_friend callbackfail(info) error back ", repjson.message);
                }
            });
        if (!repjson || (repjson &&  !repjson.success))
            return;
        console.log("good");
    }


    useEffect(() => {
        all_friend();
    }, []);

    const handleDelete = async (friend) => {
        await dlt_friend(friend.login);
        await all_friend();
    }


    return (
        <div className={`Friends-root border-0`}>
			<h1>Friends</h1>
			<hr />
			<div className="content">

	            {responseFriendArray && responseFriendArray.map((msg, index) => (
	                <div key={index} className="one-friend border-1">
	                    <h5>{msg.login}</h5>

	                    <div className="div-btn">
	                        <button onClick={() => {setGoToAction(0); setGoToConv(msg.login);}}>Message</button>
	                        <button onClick={() => {handleDelete({login: msg.login })}}>Remove</button>
	                    </div>
	                </div>
	            ))}
	            {!responseFriendArray && <p>Nothing here...</p> }
			</div>
        </div>
    )
}
