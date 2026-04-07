/* extern */
import { useEffect, useState }  from    "react";

/* Css */
import "./Friends.scss";

/* Components */
import SocketM                  from    "TOOL/SocketManag";
import useFetch                 from    "TOOL/useFetch.jsx";

export default function Friends({setGoToAction, setGoToConv}) {

    const [responseFriendArray, setResponseFriendArray] = useState([]);

    async function all_friend(){
        const url = `/api/friend`;

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

        const url = `/api/friend/${name}`;
        console.log(`${url}`)
        const repjson = await useFetch(`${url}`, {
                method: "DELETE",
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

        const handle_friend_maj = (data) => {
            if (data.type == 'maj_frd'){
                all_friend();
                return ;
            }
            return ;
        }

        SocketM.on("friend", handle_friend_maj, "quatre");
        return () => {
            SocketM.off("friend", "quatre");
        }
    }, []);

    const handleDelete = async (friend) => {
        await dlt_friend(friend.login);
        await all_friend();
        SocketM.send("friend", {type: "maj_frd", login: friend});
    }

    return (
        <div className={`Friends-root border-0`}>
			<h1>Friends</h1>
			<hr />
			<div className="content">

	            {responseFriendArray && responseFriendArray.map((msg, index) => (
	                <div key={index} className="one-friend border-1">
	                    <h2>{msg.login}</h2>

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
