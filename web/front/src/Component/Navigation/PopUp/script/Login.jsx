/* extern */
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

/* back */
import { showAlert } from "TOOL/fonction_usefull.js";
import SocketM from "TOOL/SocketManag";

/* Css */
import "../PopUp.scss";

/* Components */
import { AUTH, useAuth } from "TOOL/AuthContext.jsx";
import { useGoogleLogin } from '@react-oauth/google';
import useFetch from "HOOKS/useFetch.jsx";

export default function Login() {

    const {setShowLog, showLog} = useAuth();

    const login_submit = async (event) => {

		event.preventDefault();
        const form = event.target;
        const data = {
            email: form.email.value.trim(),
            password: form.password.value.trim(),
            host: window.location.host
        };

        if (!data.email || !data.password) {
            showAlert("login_submit(1) Veuillez remplir tous les champs", "danger");
            return;
        }

        const api_url = `/api/auth/login`;
        console.log(`${api_url}`)

        const repjson = await useFetch(`${api_url}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }, null, null, true);
        console.log(repjson);
        if (!repjson){
            showAlert("Impossible de se connecter pour le moment", "danger");
            return;
        }

        if (repjson.status < 500 && repjson.status >= 400){
            showAlert(`Erreur ${repjson.status} : ${repjson.message}`, "danger");
            return ;
        }

        if (repjson.success === false){
            showAlert(`Erreur : ${repjson.message}`, "danger");
            return ;
        }
        if (repjson.MPFA) {
            setShowLog(AUTH.MAILA2F);
        }
        if (!repjson.MPFA) {
            setShowLog(AUTH.NONE);
            SocketM.sendd('friend', {type: 'co_first'});
        };
    };

    const password_forget_mode = () => {
        sessionStorage.clear();
        setShowLog(AUTH.PASSFORGET);
    };

    const register_mode = () => {
        sessionStorage.clear();
        setShowLog(AUTH.REGISTER);
    }

    const handle_git = () => {
        const frontendUrl = window.location.origin;
        const backUrl = window.location.hostname;
        window.location.href = `/api/oauth2/github?frontendUrl=${encodeURIComponent(frontendUrl)}&backUrl=${encodeURIComponent(backUrl)}`;
    };


    const handle_google = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try{
                const api_url = "/api/oauth2/google";
                console.log(`${api_url}`)

                const repjson = await useFetch(`${api_url}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ access_token: tokenResponse.access_token, frontendUrl: window.location.origin })
                }, null, null, true);
                if (repjson && repjson.success == true && repjson.MPFA == true) {
                    setShowLog(AUTH.MAILA2F);
                    return;
                }
                if (!repjson){
                    showAlert("Impossible de se connecter pour le moment", "danger");
                    return;
                }
                setShowLog(AUTH.NONE);
                SocketM.sendd('friend', {type: 'co_first'});
            }catch(err){
                console.log("error front handle_google " + err);
            }

        },
        onError: () => console.log('Erreur'),
    });

    return (
        <>
            <div className={`script-in-root`}>

                <h1>Connexion</h1>
                <form id={`login`} onSubmit={login_submit}>


                    <label  htmlFor="email">Email</label>
                    <input  type={`email`}
                            id={`email`}
                            name={`email`}
                            placeholder={`you@exemple.com`}
                            required
                    />

                    <label  htmlFor="password">Password</label>
                    <input  type={`password`}
                            id={`password`}
                            name={`password`}
                            placeholder={`1234btw`}
                            required
                    />

                    <div className={`button-container`}>

                        <button type={`submit`} className={``}>
                                Connexion
                        </button>

                        <button type={`button`} className={``} target="_blank"
                                onClick={handle_git}>
                                <FaGithub/> GitHub
                        </button>

                        <button onClick={handle_google}>
                            <FcGoogle/> Google
                            </button>

                        <button type={`button`} className={``}
                                onClick={register_mode}>
                                Register
                        </button>

                        <button type={`button`} className={``} target="_blank"
                                onClick={password_forget_mode}>
                                Password forgot ?
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}