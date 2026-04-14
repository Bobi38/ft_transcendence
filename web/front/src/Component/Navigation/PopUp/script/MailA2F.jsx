/* extern */
import { useState, useEffect }         from    "react";

/* Css */
import "../PopUp.scss";

/* Components */
import SocketM              from    "TOOL/SocketManag";
import { showAlert }        from    "TOOL/fonction_usefull";
import useFetch             from    "TOOL/useFetch.jsx";
import { AUTH, useAuth }    from    "HOOKS/useAuth.jsx";

export default function MailA2F({login_mode}) {

    const {setShowLog} = useAuth();

    const [showMode, setShowMode] = useState("send_code"); // send_code => check_code => new_password

	async function maila2f_send_code(e)
    {
        const btn = e.currentTarget;

        if (btn) btn.disabled = true;

        const url = `/api/secu/send_mail`;
        const repjson = await useFetch(`${url}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        }, null, null, true);

        if (btn) btn.disabled = false;

        if (!repjson || (repjson && !repjson.success)) {
            return;
        }
        sessionStorage.setItem("check_code", "true");
        setShowMode("check_code")
    }

    const maila2f_check_code = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = {
            code: formData.get("code"),
            host:  window.location.host
        }

        const url = `/api/secu/maila2f_check_code`;

        const repjson = await useFetch(`${url}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(data),
        }, null, null, true);
        if (repjson.status < 500 && repjson.status >= 400){
            console.log("where is showalert " + repjson.message);
            showAlert(`${repjson.message}`, "danger");
            return ;
        }
        if (!repjson || (repjson &&  !repjson.success)){
            console.log(repjson.message)
            return ;
        }
        setShowLog(AUTH.NONE);
        SocketM.sendd('friend', {type: 'co_first'});
        if (sessionStorage.getItem("type") === null)
            sessionStorage.setItem('type', "success");
        if (sessionStorage.getItem("message") === null)
            sessionStorage.setItem('message', "Connexion réussie");
        if (sessionStorage.getItem("token") === null)
            sessionStorage.setItem('token', repjson.token);
        if (sessionStorage.getItem("username") === null)
            sessionStorage.setItem('username', repjson.username);
    }

    useEffect(()=>{
        if (sessionStorage.getItem("check_code") === "true")
            setShowMode("check_code")
    },[])


    return (
        <div className={`script-in-root`}>

            <h1>MailA2F</h1>

            {showMode === "send_code" && (
                <>
                    <button type={`button`} id={`mailverif`} onClick={(e) => {maila2f_send_code(e);}}>Send mail verification</button>
					<hr />
                    <button type={`button`} onClick={login_mode}>Connexion</button>
                </>
            )}

            {showMode === "check_code" && (
                <>
                    <form id={`maila2f`} onSubmit={(e) => {maila2f_check_code(e)}}>
    		    	    <p id={`alert-container`}></p>
                        <input type={`text`} id={`code`} name={`code`} placeholder={`Your Code`} required/>
                        <button type={`submit`}>Valid</button>
                    </form>
                    <hr/>
                    <button type={`button`} id={`mailverif`} onClick={(e) => {maila2f_send_code(e);}}>Send mail verification</button>
                    <button type={`button`} onClick={login_mode}>Connexion</button>

                </>
            )}
        </div>
    );
}
