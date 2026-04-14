/* extern */
import { useEffect, useState }  from    "react";

/* Css */
import "./PrivateMessage.scss";

/* Components */
import SocketM                  from    "TOOL/SocketManag.js";
import { useFriend, FRIEND }    from    "TOOL/FriendContext.jsx";
import useFetch                 from    "TOOL/useFetch";
import Hr                       from    "COMP/Hr/Hr.jsx";
import PrivateMessageConv       from    "./PrivateMessageConv/PrivateMessageConv.jsx"
import AddFriends               from    "./AddFriends/AddFriends.jsx"
import Friends                  from    "./Friends/Friends.jsx"

export default function PrivateMessage() {

    const [goToAction, setGoToAction] = useState(2)
    const [goToConv, setGoToConv] = useState(null)
    const { showFriend, setShowFriend } = useFriend();

    const [displayedInfoConv, setDisplayedInfoConv] = useState([]);
    const [displayedMessages, setDisplayedMessages] = useState([]);

    async function fetch_go_to_conv_private(){

        const repjson = await useFetch('/api/chatP', {
            method: "GET",
            headers: {'Content-Type': 'application/json'},
            credentials: "include",
        });
        if (!repjson || (repjson &&  !repjson.success)){
            
            return;
        }
        setDisplayedInfoConv(repjson.message)
    }

    useEffect(() => {
        if (showFriend == FRIEND.RED || showFriend == FRIEND.GREEN){
            fetch_go_to_conv_private()
        }
        setShowFriend(FRIEND.START);
    }, [showFriend]);


    async function fetch_private_message(goToConv){
        if (!goToConv)
            return;
        const url = `/api/chatP/${goToConv}`

        const repjson = await useFetch(`${url}`, {
            method: "GET",
            headers: {'Content-Type': 'application/json'},
            credentials: "include",
        })
        if (!repjson || (repjson &&  !repjson.success)){
            return;
        }
        setDisplayedMessages(repjson.message);
    }


	useEffect(() => {
        const handle_private_message = async (data) => {
            if (data.type === "updateName_good"){
                console.log("i m in handle 7878" + data.new_name);
                if (data.old_name === goToConv){
                    console.log("i m in handle 7878" + data.new_name);
                    setGoToConv(data.new_name);
                    await fetch_go_to_conv_private();
                    await fetch_private_message(data.new_name);
                    return;
                }
                await fetch_go_to_conv_private();
                await fetch_private_message(goToConv);
                return;
            }
            if (data.type == 'priv_mess' && (data.login === goToConv || data.monMsg == true))
                setDisplayedMessages(prev => [...prev, data]);
            await fetch_go_to_conv_private();
        }
        SocketM.on("priv", handle_private_message, "un");
        fetch_private_message(goToConv);
        fetch_go_to_conv_private();
        return () => {
            SocketM.off("priv", "un");
        };

    }, [goToConv]);

    return (
		<div className={`PrivateMessage-root`}>

			<Hr initial={205} min1={90} thickness={5}>

				<div className={`info`}>

					<div className={`bloc-friend-addfriend`}>
						<div className="bloc-left" onClick={() => {setGoToAction(2); setGoToConv(null)} }><p>Friend list</p></div>
						<div className="bloc-left" onClick={() => {setGoToAction(1); setGoToConv(null)} }><p>Friend requests</p></div>
					</div>

					<hr className={`big`}/>

					<div className={`bloc-last-conv-friend`}>
						{displayedInfoConv && displayedInfoConv.map((msg,index) => (
							<div key={index} className={`bloc-left`} onClick={() => {setGoToAction(0); setGoToConv(msg.login);} }>
								<div className={`header-last-conv`}>
									<h2>{msg.login}</h2><p>{msg.isOnline ? "🟢" : "🔴"}{msg.time}</p>
								</div>
								<p className={`truncate`}>{msg.lastMessage}</p>
							</div>
						))}
					</div>
				</div>

				<div className={`display-screen`}>
					{goToAction === 1 && <AddFriends />}
					{goToAction === 2 && <Friends setGoToAction={setGoToAction} setGoToConv={setGoToConv}/>}
					{goToConv && <PrivateMessageConv login={goToConv} displayedMessages={displayedMessages} />}

				</div>

			</Hr>
		</div>
    );
}

