/* extern */
import { FaGithub } from "react-icons/fa";
import { useState } from "react";
import SocketM from "TOOL/SocketManag";

/* back */

/* Css */
import "../PopUp.scss";

/* Components */
import { AUTH, useAuth } from "TOOL/AuthContext.jsx";
import useFetch from "HOOKS/useFetch.jsx";

export default function MailA2F() {

    const {setShowLog, showLog} = useAuth();

    const [showCodeInput, setShowCodeInput] = useState(false);


    async function maila2f_send_code() {
        const url = `/api/secu/repjson`;

        console.log(`${url}`)

        const repjson = await useFetch(`${url}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });
        if (!repjson || (repjson &&  !repjson.success)){
            console.log(repjson.message)
            return ;
        }
        
        setShowCodeInput(true);
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
        })
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

    return (
        <>
            <div className={`script-in-root`}>

                <h4>MailA2F</h4>

                {!showCodeInput && (
					<button type={`button`} id={`mailverif`} className={``} onClick={(e) => {maila2f_send_code(e);}}>
						Send mail verification
                    </button>
                )}

                {showCodeInput && (

                  <form id={`maila2f`} className={``} onSubmit={maila2f_check_code}>

                    <input type={`text`} id={`code`} name={`code`} placeholder={`Entrez Code`}/>

                      <div className={`button-container`}>
                          <button type={`submit`} className={``}>Valider</button>
                          <button type={`button`} className={``} onClick={maila2f_send_code}>Send a new mail verification</button>
                      </div>
                  </form>

                )}

            </div>
      </>
  );
}
