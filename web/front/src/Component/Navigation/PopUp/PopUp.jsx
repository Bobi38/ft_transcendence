/* Css */
import "./PopUp.scss";

/* Components */
import { AUTH, useAuth }        from    "HOOKS/useAuth.jsx";
import Login                    from    "./script/Login.jsx";                   // on essaie de ce co et rediriger MailA2F
import PasswordForget           from    "./script/PasswordForget.jsx";          // on envoye un mail pour changer de password
import MailA2F                  from    "./script/MailA2F.jsx";                 // on envoye un mail a titou donc faut pas clicker
import Register                 from    "./script/Register.jsx";                // pas de compte cree nous en cree un et redirige vers Login


export default function PopUp() {

    const {showLog, setShowLog} = useAuth();

    async function login_mode() {
        
        sessionStorage.clear();
        const url = `/api/secu/clearcookie`;
        console.log(`${url}`)

        await useFetch(`${url}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credential: "include",
        }, null, null, true)
        setShowLog(AUTH.LOGIN);

    }

    const password_forget_mode = () => {
        sessionStorage.clear();
        setShowLog(AUTH.PASSFORGET);
    };

    const register_mode = () => {
        sessionStorage.clear();
        setShowLog(AUTH.REGISTER);
    }

    return (

        <div className={`PopUp-root`}>

            <div id={`alert-container`}></div>

            {showLog === AUTH.LOGIN && <Login password_forget_mode={password_forget_mode} register_mode={register_mode}/>}
            {showLog === AUTH.MAILA2F && <MailA2F login_mode={login_mode}/>}
            {showLog === AUTH.REGISTER && <Register login_mode={login_mode}/>}
            {showLog === AUTH.PASSFORGET && <PasswordForget login_mode={login_mode}/>}

        </div>
    );
}
