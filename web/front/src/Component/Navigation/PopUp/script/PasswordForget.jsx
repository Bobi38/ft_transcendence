/* extern */
import { useEffect, useState } from "react";
import {showAlert} from "TOOL/fonction_usefull"

/* back */

/* Css */
import "../PopUp.scss";

/* Components */
import { AUTH, useAuth } from "TOOL/AuthContext.jsx";
import useFetch from "HOOKS/useFetch.jsx";

export default function PasswordForget() {

    const {setShowLog, showLog} = useAuth();

    const [showPassword, setShowPassword] = useState("");
    const [showPasswordConfirm, setShowPasswordConfirm] = useState("");
    const [showCodeInput, setShowCodeInput] = useState(false);
    const [changePassword, setChangePassword] = useState(false);
    const [mail, setmail] = useState("");

    useEffect(() =>{
        if (sessionStorage.getItem("CodeInput") == "true")
            setShowCodeInput(true);
        else if (sessionStorage.getItem("chgPsswrd") == "true")
            setChangePassword(true);
        else
            sessionStorage.setItem("CodeInput", "false");
        console.log("in use " + sessionStorage.getItem("CodeInput"));
    }, [])

    async function send_code() {

        // setShowCodeInput(true);
        // return
        if (!mail)
            return;
        const url = `/api/secu/recupPswd`;

        console.log(`${url}`)

        const repjson = await useFetch(`${url}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({mail: mail}),
        }, null, null, true);
        if (!repjson || (repjson &&  !repjson.success)){
            console.log(repjson.message)
            return ;
        }
        setShowCodeInput(true);
        sessionStorage.setItem("CodeInput", "true");
    }

    async function check_code(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = {
            code: formData.get("code"),
            host:  window.location.host
        }
        setmail("");
        const url = `/api/secu/recupPswd_check_code`;
        console.log(`${url}`)

        const repjson = await useFetch(`${url}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credential: "include",
            body: JSON.stringify(data),
        }, null, null, true)
        if (repjson.status < 500 && repjson.status >= 400){
            showAlert(`${repjson.message}`, "danger");
            return ;
        }
        if (!repjson || (repjson &&  !repjson.success)){
            console.log(repjson.message)
            return ;
        }
        setShowCodeInput(false)
        setChangePassword(true)
        sessionStorage.setItem("CodeInput", "false");
        sessionStorage.setItem("chgPsswrd", "true");
    }

    async function handle_modify_password() {
        if (showPassword != showPasswordConfirm){
            return ;
        }
        const url = `/api/secu/majPswd`;
        console.log(`${url}`)

        const repjson = await useFetch(`${url}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({new_psd: showPassword}),
        }, null, null, true)
        if (repjson.status < 500 && repjson.status >= 400){
            showAlert(`${repjson.message}`, "danger");
            return ;
        }
        if (!repjson || (repjson &&  !repjson.success)){
            console.log(repjson.message)
            return ;
        }
        setShowPassword("");
        setShowPasswordConfirm("")
        sessionStorage.clear()
        setShowLog(AUTH.LOGIN)
    }

    async function login_mode() {
        sessionStorage.clear();
        const url = `/api/secu/clearcookie`;
        console.log(`${url}`)

        const repjson = await useFetch(`${url}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credential: "include",
        }, null, null, true)
        setShowLog(AUTH.LOGIN);
    }

    return (
		<div className={`script-in-root`}>

			<h1>Password Forget</h1>

			{!showCodeInput && (
				<div>
					<label htmlFor="email">Email</label>
					<input type="email" id="email" name="email" placeholder="you@example.com" value={mail} onChange={(e) => setmail(e.target.value)}/>
					<div className={`button-container`}>

						<button type={`button`} id={`mailverif`} className={``} onClick={send_code}>
							Send mail verification
						</button>
						<button type={`button`} className={``} onClick={login_mode}>Connexion</button>
					</div>
				</div>
			)}

			{showCodeInput && (

				<form id={`forgetPassword`} className={``} onSubmit={check_code}>

					<div className={`button-container`}>
						<input type={`text`} id={`code`} name={`code`} placeholder={`Entrez Code`}/>
						<button type={`submit`} className={``}>Valider</button>
						<label htmlFor="email">Email</label>
						<input type="email" id="email" name="email" placeholder="you@example.com" value={mail} onChange={(e) => setmail(e.target.value)}/>
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
							value={showPassword}
							onChange={(e) => setShowPassword(e.target.value)}
						/>
						<span className="toggle-icon" onClick={() => setShowPassword(showPassword)}>
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
							value={showPasswordConfirm}
							onChange={(e) => setShowPasswordConfirm(e.target.value)}
						/>
						<span className="toggle-icon" onClick={() => setShowPasswordConfirm(showPasswordConfirm)}>
						</span>
					</div>

					<div className={`button-container`}>
						<button type={`button`} className={``} onClick={handle_modify_password}>Modifier mon mot de passe</button>
					</div>
				</form>
			)}

		</div>
  );
}
