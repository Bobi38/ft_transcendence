/* extern */
import { VscEdit, VscEye, VscEyeClosed } from "react-icons/vsc";
import { FaGithub } from "react-icons/fa";
import { useState } from "react";
import SocketM from "TOOL/SocketManag";

/* back */

/* Css */
import "../PopUp.scss";

/* Components */
import { AUTH, useAuth } from "TOOL/AuthContext.jsx";
import useFetch from "HOOKS/useFetch.jsx";

export default function PasswordForget() {

    const {setShowLog, showLog} = useAuth();

    const [showPassword, setShowPassword] = useState(false);
    const [showCodeInput, setShowCodeInput] = useState(false);
    const [changePassword, setChangePassword] = useState(false);

    async function send_code() {

        // setShowCodeInput(true);
        // return
        const url = `/api/secu/recupPswd`;

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



    async function check_code(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = {
            code: formData.get("code"),
            host:  window.location.host
        }
        const code = formData.get("code");

        const url = `/api/secu/check_code`;
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
        setChangePassword(true)
        setShowLog(AUTH.LOGIN);
    }

    function login_mode() {
        setShowLog(AUTH.LOGIN)
    }

    return (
        <>
            <div className={`script-in-root`}>

                <h1>Password Forget</h1>

                {!showCodeInput && (
                    <div className={`button-container`}>

                        <button type={`button`} id={`mailverif`} className={``} onClick={send_code}>
                            Send mail verification
                        </button>
                        <button type={`button`} className={``} onClick={login_mode}>Connexion</button>
                    </div>
                )}

                {showCodeInput && (

                    <form id={`forgetPassword`} className={``} onSubmit={check_code}>

                        <input type={`text`} id={`code`} name={`code`} placeholder={`Entrez Code`}/>

                        <div className={`button-container`}>
                            <button type={`submit`} className={``}>Valider</button>
                            <button type={`button`} className={``} onClick={send_code}>Send a new mail verification</button>
                            <button type={`button`} className={``} onClick={login_mode}>Connexion</button>
                        </div>
                    </form>

                )}
                {changePassword && (

                    <form id={`changePassword`} className={``} 
                    // onSubmit={send_new_password}
                    >

                        <label htmlFor="password">Nouveau Mot de passe</label>
                        <div className="input-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                className="password-field"
                                placeholder="Votre nouveau mot de passe"
                            />
                            <span className="toggle-icon" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <VscEyeClosed /> : <VscEye />}
                            </span>
                        </div>

                        <label htmlFor="confirmepassword">Confirmer Mot de passe</label>
                        <div className="input-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="confirmepassword"
                                name="confirmepassword"
                                className="password-field"
                                placeholder="Confirmation du nouveau mot de passe"
                            />
                            <span className="toggle-icon" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <VscEyeClosed /> : <VscEye />}
                            </span>
                        </div>

                        <div className={`button-container`}>
                            <button type={`submit`} className={``}>Modifier mon mot de passe</button>
                            <button type={`button`} className={``} onClick={login_mode}>Connexion</button>
                        </div>
                    </form>
                )}

            </div>
      </>
  );
}
