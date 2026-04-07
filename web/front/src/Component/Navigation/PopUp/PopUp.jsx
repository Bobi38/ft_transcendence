/* Css */
import "./PopUp.scss";

/* Components */
import Login from "./script/Login.jsx"                      // on essaie de ce co et rediriger MailA2F
import PasswordForget from "./script/PasswordForget.jsx"    // on envoye un mail pour changer de password
import MailA2F from "./script/MailA2F.jsx"                  // on envoye un mail a titou donc faut pas clicker
import Register from "./script/Register.jsx"                // pas de compte cree nous en cree un et redirige vers Login


import { AUTH, useAuth } from "TOOL/AuthContext.jsx";

export default function PopUp() {

    
    const {showLog, setShowLog} = useAuth();

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

        <div className={`PopUp-root`}>

            <div id={`alert-container`}></div>

            {showLog === AUTH.LOGIN && <Login/>}
            {showLog === AUTH.MAILA2F && <MailA2F/>}
            {showLog === AUTH.REGISTER && <Register/>}
            {showLog === AUTH.PASSFORGET && <PasswordForget login_mode={login_mode}/>}


        </div>
    )
}
