/* extern */
import { FaGithub } from "react-icons/fa";

/* back */
import { showAlert } from "TOOL/fonction_usefull.js";
import SocketM from "TOOL/SocketManag.js";


/* Css */
import "FRONT/page/Home/PopUp/PopUp.scss";

/* Components */
import { AUTH } from "FRONT/page/Home/Home.jsx"

import useFetch from "HOOKS/useFetch.jsx";

export default function Login({setShowLog}) {

    const login_submit = async (event) => {

		event.preventDefault();
        const form = event.target;
        const data = {
            email: form.email.value.trim(),
            password: form.password.value.trim(),
            host: window.location.host
        };

        alert(data.host);
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
        });

        if (!repjson){
            showAlert("Impossible de se connecter pour le moment", "danger");
            return;
        }



        sessionStorage.setItem('type', "success");
        sessionStorage.setItem('message', "Connexion réussie");
        sessionStorage.setItem('token', repjson.token);
        sessionStorage.setItem('username', repjson.username);

        if (repjson.MPFA) {
            setShowLog(AUTH.MAILA2F);
        }
        
        if (!repjson.MPFA) {
            setShowLog(AUTH.NONE);
        SocketM.sendd(SocketM.socket.friend, {type: 'co'});
    };
}




    const register_mode = () => {
        console.log("register_mode(1) Passage en mode inscription:", AUTH.REGISTER);
        setShowLog(AUTH.REGISTER);
    }

    
    const handle_git = () => {
        window.location.href = "/api/oauth2/github";
    };
    return (
        <>
            <div className={`script-in-root`}>

                <h4>Connexion</h4>
                <form id={`login`} onSubmit={login_submit}>


                    <label  htmlFor="email">Email</label>
                    <input  type={`email`}
                            id={`email`}
                            name={`email`}
                            placeholder={`you@exemple.com`}
                            required
                            // value={`toto@test.c`}//--
                            />

                    <label  htmlFor="password">Password</label>
                    <input  type={`password`}
                            id={`password`}
                            name={`password`}
                            placeholder={`1234btw`}
                            required
                            // value={`tt`}//--
                            />

                    <div className={`button-container`}>

                        <button type={`submit`} className={``}>
                                Connexion
                        </button>

                        <button type={`button`} className={``}
                                onClick={register_mode}>
                                Password lost
                        </button>
                        
                        <button type={`button`} className={``}
                                onClick={register_mode}>
                                Register
                        </button>

                        <button type={`button`} className={``} target="_blank"
                                onClick={handle_git}>
                                <FaGithub/> GitHub
                        </button>

                        {/* <button type={`button`} className={``} target="_blank"
                                onClick={miss_pass_mode}>
                                Password forgot ?
                                </button> */}
                    </div>
                </form>
            </div>
        </>
    )
}