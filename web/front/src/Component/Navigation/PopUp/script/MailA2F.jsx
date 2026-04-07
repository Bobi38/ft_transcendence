/* extern */
import { useState } from "react";
import SocketM from "TOOL/SocketManag";
import showAlert from 'TOOL/fonction_usefull'

/* back */

/* Css */
import "../PopUp.scss";

/* Components */
import { AUTH, useAuth } from "TOOL/AuthContext.jsx";
import useFetch from "HOOKS/useFetch.jsx";

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
            console.log(repjson.message);
            return;
        }
        setShowMode("check_code")
    }

    async function maila2f_check_code(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = {
            code: formData.get("code"),
            host:  window.location.host
        }
        const code = formData.get("code");

        const url = `/api/secu/maila2f_check_code`;
        console.log(`${url}`)

        const repjson = await useFetch(`${url}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(data),
        }, null, null, true);
        if (repjson.status < 500 && repjson.status >= 400){
            showAlert(`${repjson.message}`, "danger");
            return ;
        }
        if (!repjson || (repjson &&  !repjson.success)){
            console.log(repjson.message)
            return ;
        }
        SocketM.sendd('friend', {type: 'co'});
        setShowLog(AUTH.NONE);
    }

    async function login_mode() {
        sessionStorage.clear();
        const url = `/api/secu/cookie`;
        console.log(`${url}`)

        const repjson = await useFetch(`${url}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credential: "include",
        }, null, null, true)
        setShowLog(AUTH.LOGIN);
    }

    return (
        <>
            <div className={`script-in-root`}>

                <h1>MailA2F</h1>

                {showMode === "send_code" && (
                    <>
                        <button type={`button`} id={`mailverif`} onClick={(e) => {maila2f_send_code(e);}}>Send mail verification</button>
                        <button type={`button`} onClick={login_mode}>Connexion</button>
                    </>
                )}

                {showMode === "check_code" && (
                    <>
                        <form id={`maila2f`} onSubmit={(e) => {maila2f_check_code(e)}}>
                            <input type={`text`} id={`code`} name={`code`} placeholder={`Entrez Code`}/>
                            <button type={`submit`} >Valider</button>
                        </form>
                        <hr/>
                        <button type={`button`} id={`mailverif`} onClick={(e) => {maila2f_send_code(e);}}>Send mail verification</button>
                        <button type={`button`} onClick={login_mode}>Connexion</button>

                    </>
                )}

            </div>
      </>
  );
}
