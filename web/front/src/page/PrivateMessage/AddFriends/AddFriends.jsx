/* extern */
import { useEffect, useState }  from    "react";

/* Css */
import "./AddFriends.scss";

/* Components */
import SocketM                  from    "TOOL/SocketManag.js";
import useFetch                 from    "TOOL/useFetch.jsx";
import Hr                       from    "FRONT/Component/Hr/Hr.jsx";
import { showAlert }        from    "TOOL/fonction_usefull.js";

export default function AddFriends() {

    const fetch_type = {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        credentials: "include",
        body: JSON.stringify({})
    }

    const [responseFriendArray, setResponseFriendArray] = useState({
        Fme:[],
        Fother:[]
    });

    async function add_friend(name){
        if (!name)
            return;

        const url = `/api/friend`;

        const repjson = await useFetch(`${url}`, {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                credentials: "include",
                body: JSON.stringify({name: name})
            }, null , function(repjson) {
            if (repjson.message === undefined) {
                console.log("add_friend callbackfail(info) people not exist");
            } else if (repjson.message === name) {
                console,log("add_friend callbackfail(info) people are already friend");
            } else {
                console.log("add_friend callbackfail(info) error back ", repjson.message);
            }
        })
        if (!repjson || (repjson &&  !repjson.success)){
            showAlert(repjson.message, "danger");
            return;
        }
        fetch_all_request_friend();
        SocketM.sendd("friend", {type: "req_frd", login: name});
    }

    async function fetch_all_request_friend(){
        const url = `/api/friend/requests`;

        const repjson = await useFetch(`${url}`, {
                method: "GET",
                headers: {'Content-Type': 'application/json'},
                credentials: "include",
            }, null , null);
        if (!repjson || (repjson &&  !repjson.success))
            return;
        setResponseFriendArray(repjson.message)
    }

    useEffect(() => {
        fetch_all_request_friend();

        const handle_friend_add = async (data) => {
                if (data.type == 'req_frd' || data.type == 'updateName')
                    await fetch_all_request_friend()
        }

        SocketM.on("friend", handle_friend_add, "trois");
        return () =>{
            SocketM.off("friend", "trois");
        }

    }, []);

    const handel_form = (e) =>{
        const el_add_friend = document.getElementById("add-friend")
        add_friend(el_add_friend.value)
        el_add_friend.value = ""
    }

    const handel_response = async (arg) => {
        console.log("requestfriend finish", arg)

        const url = `/api/friend/response`;

        const repjson = await useFetch(`${url}`, {
        method: "PATCH",
        headers: {'Content-Type': 'application/json'},
        credentials: "include",
        body: JSON.stringify(arg)
        })
        if (!repjson || (repjson &&  !repjson.success))
            return;
        await fetch_all_request_friend()
        SocketM.sendd("friend", {type: "maj_frd", login: repjson.login});
        SocketM.sendd("friend", {type: "req_frd", login: repjson.login});
    }
    return (
        <div className={`AddFriends-root`}>
			<h1>Friend requests</h1>
			<hr />
			<div className="content">
				<form onSubmit={(e) => {e.preventDefault(); handel_form(e)}}>
           			<p id={`alert-container`}></p>
					<div>
						<input  type={`text`} id={`add-friend`} placeholder="Nickname" required/>
						<button type={`submit`}>Add</button>
					</div>
				</form>

				<hr className={`big`}/>

				<div className={`response`}>

					<Hr mode={`column`} initial={120} min1={100} thickness={2}>

						<div className={`bloc1`}>
							<h2>Requests sent</h2>
							{responseFriendArray.Fme && responseFriendArray.Fme.map((msg, index) => (
								<div key={`me-${index}`}>
									<div className={`one-response`}>
									<h3>{msg.login}</h3>
										<div className={`div-btn`}>
											<button onClick={() => {handel_response({login: msg.login, response: false })}}>Remove</button>
										</div>
									</div>
								</div>
							))}
						</div>


						<div className={`bloc2`}>
							<h2>Requests received</h2>
							{responseFriendArray.Fother && responseFriendArray.Fother.map((msg, index) => (
								<div key={`other-${index}`}>
									<div className={`one-response`}>
									<h3>{msg.login}</h3>
										<div className={`div-btn`}>
											<button onClick={() => {handel_response({login: msg.login, response: true })}}>Accept</button>
											<button onClick={() => {handel_response({login: msg.login, response: false })}}>Refuse</button>
										</div>
									</div>
								</div>
							))}
						</div>

					</Hr>
				</div>
			</div>
        </div>
    )
}
