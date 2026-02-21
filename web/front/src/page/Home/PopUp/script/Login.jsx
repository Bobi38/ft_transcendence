/* Css */
import "FRONT/page/Home/PopUp/PopUp.scss";

import { showAlert } from "/app/back/src/fct1.js";
import { AUTH } from "FRONT/page/Home/Home.jsx"
import { FaGithub } from "react-icons/fa";

export default function Login({setShowLog}) {

    const login_submit = async (event) => {

		event.preventDefault();
        const form = event.target;
        const data = {
            email: form.email.value.trim(),
            password: form.password.value.trim()
        };

        if (!data.email || !data.password) {
            showAlert("Veuillez remplir tous les champs", "danger");
            return;
        }

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.success) {
                sessionStorage.setItem('token', result.tooken);
                sessionStorage.setItem('message', "Connexion réussie");
                sessionStorage.setItem('type', "success");


                setShowLog(AUTH.MAILA2F); 
                // setShowLog(AUTH.NONE); 

            } else {
                showAlert("Erreur : " + result.message, "danger");
            }
        } catch (error) {
            console.error("login_submit(1) Erreur serveur", error);
            showAlert("Impossible de se connecter pour le moment", "danger");
        }
    };



    const register_mode = () => {
        console.log("Passage en mode inscription:", AUTH.REGISTER);
        setShowLog(AUTH.REGISTER);
    }

    
    const handle_git = () => {
        window.location.href = "/api/github";
    };
    
    const miss_pass_mode = () => {
        console.log("Passage en mode inscription:", AUTH.REGISTER);
        setShowLog(AUTH.REGISTER);
    }

    return (
        <>
            <h4>Connexion</h4>
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
        </>
    )
}