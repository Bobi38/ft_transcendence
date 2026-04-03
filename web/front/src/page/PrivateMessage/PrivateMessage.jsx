/* extern */
import { useEffect, useState } from "react";

/* back */
import  SocketM  from "TOOL/SocketManag.js";
import { useFriend, FRIEND } from "TOOL/FriendContext.jsx";
/* Css */
import "./PrivateMessage.scss";

/* Components */
import useFetch from "HOOKS/useFetch";
import PrivateMessageConv from "./PrivateMessageConv/PrivateMessageConv.jsx"
import AddFriends from "./AddFriends/AddFriends.jsx"
import Friends from "./Friends/Friends.jsx"
import Hr from    "FRONT/Component/Hr/Hr.jsx";

export default function PrivateMessage() {

    const [goToAction, setGoToAction] = useState(2)
    const [goToConv, setGoToConv] = useState(null)
    const { showFriend, setShowFriend } = useFriend();

    const [displayedInfoConv, setDisplayedInfoConv] = useState([]);
    /* {UserId: 1, login: 'tata', isOnline: false, lastMessage: 'e', time: '09:05:07'} */

    const [displayedMessages, setDisplayedMessages] = useState([]);

    async function fetch_go_to_conv_private(){

        const repjson = await useFetch('/api/chatP/fetch_conv', {
            method: "GET",
            headers: {'Content-Type': 'application/json'},
            credentials: "include",
        });
        if (!repjson || (repjson &&  !repjson.success))
            return;
        setDisplayedInfoConv(repjson.message)
    }

    useEffect(() => {
        if (showFriend == FRIEND.RED || showFriend == FRIEND.GREEN){
            fetch_go_to_conv_private()
        }
        setShowFriend(FRIEND.START);
    }, [showFriend]);


    async function fetch_private_message(goToConv){

        const url = goToConv 
            ? `/api/chatP/get_chat_private?name=${goToConv}`
            : `/api/chatP/get_chat_private`;

        console.log(`${url} goToConv: `,goToConv)

        const repjson = await useFetch(`${url}`, {
            method: "GET",
            headers: {'Content-Type': 'application/json'},
            credentials: "include",
        })
        if (!repjson || (repjson &&  !repjson.success))
            return;

        setDisplayedMessages(repjson.message);
    }


	useEffect(() => {
        const handle_private_message = async (data) => {
            console.log("handle_private_message(1) Message privé reçu via WebSocket:", data);
            if (data.type === "updateName_good"){             
                if (data.old_name === goToConv){
                    setGoToConv(data.new_name);
                    fetch_go_to_conv_private();
                    fetch_private_message(data.new_name);
                    return;
                }
                fetch_go_to_conv_private();
                fetch_private_message(goToConv);
                return;
            }
            if (data.type == 'priv_mess' && (data.login === goToConv || data.monMsg == true))
                setDisplayedMessages(prev => [...prev, data]);
            fetch_go_to_conv_private();
        }
        SocketM.on("priv", handle_private_message, "un");
        fetch_private_message(goToConv);
        fetch_go_to_conv_private();
        return () => {
            SocketM.off("priv", "un");
        };

    }, [goToConv]);

    return (
		<div className={`PrivateMessage-root border-0`}>

			<Hr initial={205} min1={90} thickness={5}>

				<div className={`info border-1`}>

					<div className={`bloc-friend-addfriend border-2`}>
						<div className="bloc-left border-3" onClick={() => {setGoToAction(2); setGoToConv(null)} }><p>Friend list</p></div>
						<div className="bloc-left border-3" onClick={() => {setGoToAction(1); setGoToConv(null)} }><p>Friend request</p></div>
					</div>

					<hr className={`big`}/>

					<div className={`bloc-last-conv-friend border-2`}>
						{displayedInfoConv && displayedInfoConv.map((msg,index) => (
							<div key={index} className={`bloc-left border-3`} onClick={() => {setGoToAction(0); setGoToConv(msg.login);} }>
								<div className={`header-last-conv border-4`}>
									<h4>{msg.login}</h4><p>{msg.isOnline ? "🟢" : "🔴"}{msg.time}</p>
								</div>
								<p className={`truncate`}>{msg.lastMessage}</p>
							</div>
						))}
					</div>

				</div>

				<div className={`display-screen border-2`}>
					{goToAction === 1 && <AddFriends />}
					{goToAction === 2 && <Friends setGoToAction={setGoToAction} setGoToConv={setGoToConv}/>}
					{goToConv && <PrivateMessageConv login={goToConv} displayedMessages={displayedMessages} setDisplayedMessages={setDisplayedMessages} /> }

				</div>
			</Hr>
		</div>
    )
}

