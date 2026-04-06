/* Css */
import "./PopUp.scss";

/* Components */
import Login from "./script/Login.jsx"
import PasswordForget from "./script/PasswordForget.jsx"
import MailA2F from "./script/MailA2F.jsx"
import Register from "./script/Register.jsx"


import { AUTH, useAuth } from "TOOL/AuthContext.jsx";

export default function PopUp() {

    const {showLog} = useAuth();

    return (

        <div className={`PopUp-root`}>
            <div id={`alert-container`}></div>

            {showLog === AUTH.LOGIN && <Login/>}
            {showLog === AUTH.MAILA2F && <MailA2F/>}
            {showLog === AUTH.REGISTER && <Register/>}
            {showLog === AUTH.PASSFORGET && <PasswordForget/>}
        </div>
    )
}
