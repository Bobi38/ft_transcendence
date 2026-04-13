/* extern */
import { useEffect, useState }  from    "react";

/* Css */
import "./Friends.scss";

/* Components */
import SocketM                  from    "TOOL/SocketManag";
import useFetch                 from    "TOOL/useFetch.jsx";

export default function Friends({setGoToAction, setGoToConv}) {

    const [responseFriendArray, setResponseFriendArray] = useState([]);
    const [popupFriend, setPopupFriend] = useState(null);

    async function all_friend(){

        const url = `/api/friend`;

        const repjson = await useFetch(`${url}`, {
                method: "GET",
                headers: {'Content-Type': 'application/json'},
                credentials: "include",
            })
        if (!repjson || (repjson &&  !repjson.success))
            return;
        setResponseFriendArray(repjson.message)
    }

    async function dlt_friend(name){

        if (!name)
            return;

        const url = `/api/friend/${name}`;
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
    }

    async function get_friend_profil(name){

        if (!name)
            return;

        const url = `/api/friend/${name}/profil`;
        const repjson = await useFetch(`${url}`, {
                method: "GET",
                headers: {'Content-Type': 'application/json'},
                credentials: "include",
            }, null , function(repjson) {
            });
        if (!repjson || (repjson &&  !repjson.success))
            return null;
        const data = {
            login: repjson.message.login,
            mail: repjson.message.mail,
            tel: repjson.message.tel
        }
        return data;
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
    const handleFriendProfil = async (friend) => {
        const profil = await get_friend_profil(friend.login);
        setPopupFriend(profil);
    }

    return (
        <div className={`Friends-root`}>
            { popupFriend && (
                <div id="popup-profil">
                    <div>
                        <div className="head">
                            <h2>Friend profil</h2>
                            <button onClick={()=>(setPopupFriend(null))}>X</button>
                        </div>
                        <div className="content">
                            <p>login: {popupFriend.login || "..."}</p>
                            <p>email: {popupFriend.mail || "..."}</p>
                            <p>tel: {popupFriend.tel || "..."}</p>
                        </div>
                    </div>
                </div>
            )}
			<h1>Friends</h1>
			<hr />
			<div className="content">

	            {responseFriendArray?.length !== 0 ? (responseFriendArray.map((msg, index) => (
	                <div key={index} className="one-friend">
	                    <h2>{msg.login}</h2>

	                    <div className="div-btn">
	                        <button onClick={() => {setGoToAction(0); setGoToConv(msg.login);}}>Message</button>
                            <button onClick={() => {handleFriendProfil({login: msg.login })}}>Profil</button>
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
