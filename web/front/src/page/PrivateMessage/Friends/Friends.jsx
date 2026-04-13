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

        console.log("all_frienqwerqwerqwerqwerqwerd ");
        const repjson = await useFetch(`${url}`, {
                method: "GET",
                headers: {'Content-Type': 'application/json'},
                credentials: "include",
            })
        console.log("all_frienqwerqwerqwerqwerqwerd repjson", repjson);
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
        await all_friend();
        SocketM.sendd("friend", {type: "maj_frd", login: name});
        console.log("good");
    }

    useEffect(() => {
        all_friend();

        const handle_friend_maj = (data) => {
            if (data.type == 'maj_frd' || data.type == 'updateName'){
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
    }

    return (
        <div className={`Friends-root`}>
			<h1>Friends</h1>
			<hr />
			<div className="content">

	            {responseFriendArray?.length !== 0 ? (responseFriendArray.map((msg, index) => (
	                <div key={index} className="one-friend">
	                    <h2>{msg.login}</h2>

	                    <div className="div-btn">
	                        <button onClick={() => {setGoToAction(0); setGoToConv(msg.login);}}>Message</button>
	                        <button onClick={() => {handleDelete({login: msg.login })}}>Remove</button>
	                    </div>
	                </div>
	            ))):(
					<div className="no-friend">
						<p>No friend...</p>
						<p>Go play Pong3D or Morpion to find some friends !</p>
					</div>
				)}
			</div>
        </div>
    )
}
