/* extern */
import { FaGithub } from "react-icons/fa";
import { useState } from "react";
import SocketM from "TOOL/SocketManag";

/* back */

/* Css */
import "FRONT/page/Home/PopUp/PopUp.scss";

/* Components */
import { AUTH } from "FRONT/page/Home/Home.jsx"
import useFetch from "HOOKS/useFetch.jsx";

export default function MailA2F({setShowLog}) {

    const [showCodeInput, setShowCodeInput] = useState(false);


    async function maila2f_send_mail() {
        const url = `/api/secu/send_mail`;

        console.log(`${url}`)

        const repjson = await useFetch(`${url}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });
        if (!repjson || (repjson &&  !repjson.success))
            return;
        SocketM.sendd('friend', {type: 'co'});
        setShowCodeInput(true);
    }



    async function maila2f_check_code(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const code = formData.get("code");

        const url = `/api/secu/maila2f_check_code`;
        const data ={
            code: code,
            host: window.location.host
        }
        console.log(`${url}`)

        const repjson = await useFetch(`${url}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({data}),
        })
        if (!repjson || (repjson &&  !repjson.success))
            return;

        setShowLog(AUTH.NONE);
    }

    return (
        <>
            <div className={`script-in-root`}>
              
                <h4>MailA2F</h4>
                
                {!showCodeInput && (
                    <button type={`button`} id={`mailverif`} className={``} onClick={(e) => {maila2f_send_mail(e);}}>
                      Envoyer mail de verification
                    </button>
                )}

                {showCodeInput && (

                  <form id={`maila2f`} className={``} onSubmit={maila2f_check_code}>

                    <input type={`text`} id={`code`} name={`code`} placeholder={`Entrez Code`}/>

                      <div className={`button-container`}>
                          <button type={`submit`} className={``}>Valider</button>
                          <button type={`button`} className={``} onClick={maila2f_send_mail}>Renvoyer un mail de verification</button>
                      </div>
                  </form>

                )}

            </div>
      </>
  );
}
