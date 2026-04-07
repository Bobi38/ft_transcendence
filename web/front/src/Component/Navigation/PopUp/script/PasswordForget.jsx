/* extern */
import { VscEye, VscEyeClosed }     from    "react-icons/vsc";
import { useEffect, useState }      from    "react";

/* Css */
import "../PopUp.scss";

/* Components */
import {showAlert}                  from    "TOOL/fonction_usefull"
import useFetch                     from    "TOOL/useFetch.jsx";
import { AUTH, useAuth }            from    "HOOKS/useAuth.jsx";

export default function PasswordForget({login_mode}) {

    const {setShowLog} = useAuth();

    const [showPassword, setShowPassword] = useState(false);
    const [showMode, setShowMode] = useState("send_code"); // send_code => check_code => new_password

    useEffect(() =>{
        if (sessionStorage.getItem("CodeInput") == "true")
            setShowMode("check_code");
        else if (sessionStorage.getItem("chgPsswrd") == "true")
            setShowMode("new_password");
        else
            sessionStorage.setItem("CodeInput", "false");
        // console.log("in use " + sessionStorage.getItem("CodeInput"));
    }, [])

    async function send_code(e) {
        e.preventDefault();
        const email = e.target.email.value;
        console.log("email",email)

        if (email === "")
            return;
        const url = `/api/secu/recovery/password`;

        console.log(`${url}`)

        const repjson = await useFetch(`${url}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({mail: email}),
        }, null, null, true);
        console.log("recupPswd repjson",repjson)
        if (!repjson || (repjson &&  !repjson.success)){
            console.log(repjson.message)
            return ;
        }
        setShowMode("check_code");
        sessionStorage.setItem("CodeInput", "true");
    }



    async function check_code(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = {
            code: formData.get("code"),
            host:  window.location.host
        }
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
        setShowMode("new_password");
        sessionStorage.setItem("CodeInput", "false");
        sessionStorage.setItem("chgPsswrd", "true");
    }

    const handle_pass = async (e) => {
        e.preventDefault();
        const password = e.target.password.value;
        const confirmePassword = e.target.confirmePassword.value;

        if (!password || !confirmePassword) {
            showAlert("Veuillez remplir tous les champs", "danger");
            return;
        }

        if (password !== confirmePassword) {
            showAlert("Les mots de passe ne correspondent pas", "danger");
            return;
        }

        let url = `/api/profile/majPass`;
        url = `/api/secu/majPswd`;

        console.log(`${url}`)

        const repjson = await useFetch(`${url}`, {
            method: "POST",
            headers : { "Content-Type" : "application/json" },
            credentials: "include",
            body: JSON.stringify({new_psd: password})
        });
        if (repjson.status < 500 && repjson.status >= 400){
            showAlert(`${repjson.message}`, "danger");
            return ;
        }
        if (!repjson || (repjson &&  !repjson.success)){
            console.log(repjson.message)
            return ;
        }
        sessionStorage.clear()
        setShowLog(AUTH.LOGIN)
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

                <h1>Password Forget</h1>

                {showMode === "send_code" && (
                    <>
                        <form onSubmit={(e) => {send_code(e)}}>

                            <label htmlFor={`email`}>Email</label>
                            <input type={`email`} id={`email`} name={`email`} placeholder={`you@example.com`}/>
                            <button type={`submit`} >Send mail verification</button>

                        </form>
                        <button type={`button`} onClick={login_mode}>Connexion</button>
                    </>
                )}

                {showMode === "check_code" && (
                    <>
                        <form onSubmit={(e) => {check_code(e)}}>

                                <input type={`text`} 
                                        id={`code`} name={`code`} 
                                        placeholder={`Entrez Code`}/>
                                <button type={`submit`}>Valider</button>

                        </form>
                        <hr/>
                        <form onSubmit={(e) => {send_code(e)}}>

                            <label htmlFor={`email`}>Email</label>
                            <input type={`email`} id={`email`} name={`email`} placeholder={`you@example.com`}/>
                            <button type={`submit`} >Send mail verification</button>

                        </form>
                        <button type={`button`} onClick={login_mode}>Connexion</button>

                    </>
                )}

                {showMode === "new_password" && (
                    <>
                        <form onSubmit={(e) => {handle_pass(e)}}>

                            <label htmlFor={`password`}>Nouveau Mot de passe</label>
                            <div className={`input-wrapper`}>
                                <input type={showPassword ? "text" : "password"}
                                    id={`password`} name={`password`}
                                    className={`password-field`}
                                    placeholder={`Votre nouveau mot de passe`}
                                    />
                                <span className={`toggle-icon`} onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <VscEyeClosed /> : <VscEye />}
                                </span>
                            </div>

                            <label htmlFor={`confirmePassword`}>Confirmer Mot de passe</label>
                            <div className={`input-wrapper`}>
                                <input type={showPassword ? "text" : "password"}
                                    id={`confirmePassword`} name={`confirmePassword`}
                                    className={`password-field`}
                                    placeholder={`Confirmation du nouveau mot de passe`}
                                    />
                                <span className={`toggle-icon`} onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <VscEyeClosed /> : <VscEye />}
                                </span>
                            </div>

                            <button type={`submit`}>Modifier mon mot de passe</button>

                        </form>
                        <button type={`button`} onClick={login_mode}>Connexion</button>
                    </>
                )}

            </div>
        </>
    );
}