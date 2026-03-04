/* extern */
import { useEffect, useState } from "react";

/* back */
// import checkCo from "BACK/fct1.js"

/* Css */
import "./Amis.scss";

/* Components */
import useFetch from "HOOKS/useFetch.jsx";


    
export default function Amis({setGoToAction, setGoToConv}) {


    console.log("Amis Components called")

    const [responseFriendArray, setResponseFriendArray] = useState([{ login: "titi" },{ login: "tata" }]);


    // async function fetch_all_friend(){ // with co or not
    //     console.log("fetch_all_friend(1) called");
    //     try{

            // const rep = await fetch('/api/friend/all_friend', {
            //     method: "GET",
            //     headers: {'Content-Type': 'application/json'},
            //     credentials: "include",
            // });
            
    //         // console.log("fetch_all_friend(2) after fetch");
    //         const repjson = await rep.json();
    //         console.log("fetch_all_friend(2.5) repjson: ",repjson.message);

    //         if (repjson.success){
    //             // setResponseFriendArray(repjson.message)
    //             console.log("success")
    //             console.log(repjson.message[0].Friends[0].name);
    //             console.log(repjson.message[0].Friends[1].name);
    //             console.log(repjson.message[0].FriendOf[0].name);

    //         }else {
    //             console.log("fetch_all_friend(3) error back ", repjson.message);
    //         }
    //     }catch(err){
    //         console.log("fetch_all_friend(4) error front ", err);
    //     }
    // }



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
        if (!repjson && !repjson.success)
            return;
        console.log("good");
    }


    useEffect(() => {
        // fetch_all_friend();
    }, []);


    const [responseFriend, setResponseFriend] = useState();

    return (
        <div className={`Amis-root border-0`}>
            {responseFriendArray && responseFriendArray.map((msg, index) => (
                <div key={index} className="one-friend border-1">
                    <h5>{msg.login}</h5>

                    <div className="div-btn">
                        <button onClick={() => {setGoToAction(0); setGoToConv(msg.login);}}>mp</button>
                        <button onClick={() => {setResponseFriend({login: msg.login, response: "c'est pas encore fait bg" })}}>supprimer</button>
                    </div>
                </div>
            ))}
            {!responseFriendArray && <p>HaHa ta pas de pote!</p> }
        </div>
    )
}
