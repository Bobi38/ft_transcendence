/* extern */
import { FaGithub }         from    "react-icons/fa";
import { FcGoogle }         from    "react-icons/fc";
import { useGoogleLogin }	from	'@react-oauth/google';

/* Css */
import "../PopUp.scss";

/* Components */
import SocketM              from    "TOOL/SocketManag";
import { showAlert }        from    "TOOL/fonction_usefull.js";
import useFetch             from    "TOOL/useFetch.jsx";
import { AUTH, useAuth } 	from	"HOOKS/useAuth.jsx";

export default function Login({ password_forget_mode, register_mode}) {

    const {setShowLog} = useAuth();

    const login_submit = async (e) => {

		e.preventDefault();
        const form = e.target;
        const data = {
            email: form.email.value,
            password: form.password.value,
            host: window.location.host
        };

        if (!data.email || !data.password) {
            showAlert("Please fill all input", "danger");
            return;
        }

        const api_url = `/api/auth/session`;
        console.log(`${api_url}`)

        const repjson = await useFetch(`${api_url}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }, null, null, true);
        if (!repjson){
            showAlert("Can't establish connection for now", "danger");
            return;
        }

        if (repjson.status < 500 && repjson.status >= 400){
            showAlert(`Erreur ${repjson.status} : ${repjson.message}`, "danger");
            return ;
        }
        sessionStorage.setItem('username', repjson.username);

        sessionStorage.setItem('username', repjson.username);

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
    
    const handle_git = () => {
        const frontendUrl = window.location.origin;
        const backUrl = window.location.hostname;
        window.location.href = `/api/oauth2/github?frontendUrl=${encodeURIComponent(frontendUrl)}&backUrl=${encodeURIComponent(backUrl)}`;
    };


    const handle_google = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try{
                const url = "/api/oauth2/google";
                console.log(`${url}`)

                const repjson = await useFetch(`${url}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ access_token: tokenResponse.access_token, frontendUrl: window.location.origin })
                }, null, null, true);
                if (repjson && repjson.success == true && repjson.MPFA == true) {
                    setShowLog(AUTH.MAILA2F);
                    return;
                }
                if (!repjson){
                    showAlert("Can't establish connection for now", "danger");
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
        <div className={`script-in-root`}>

            <h1>Connexion</h1>
            <form id={`login`} onSubmit={(e) => {login_submit(e)}}>


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
                <button type={`submit`}>Connect</button>

            </form>
            <hr/>
            <div className="button-container">
                <button type={`button`}  target="_blank"
                        onClick={handle_git}>
                        <FaGithub/> GitHub
                </button>

                <button onClick={handle_google}>
                    <FcGoogle/> Google
                    </button>

                <button type={`button`} 
                        onClick={register_mode}>
                        Register
                </button>

                <button type={`button`} target="_blank"
                        onClick={password_forget_mode}>
                        Password forgot ?
                </button>
            </div>
        </div>
    );
}