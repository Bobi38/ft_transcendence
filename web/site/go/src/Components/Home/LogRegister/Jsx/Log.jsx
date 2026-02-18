/* Css */
import "../LogRegister.scss";

import { showAlert } from "../../../../../../fct1";
import { AUTH } from "../../Home.jsx"
import { FaGithub } from "react-icons/fa";

export default function Log({setShowLog}) {

    const logsub = async (event) => {

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


                setShowLog(AUTH.QRCODE); // change to qrcode
                // setShowLog(AUTH.NONE); // change to qrcode

            } else {
                showAlert("Erreur : " + result.message, "danger");
            }
        } catch (error) {
            console.error("Erreur serveur", error);
            showAlert("Impossible de se connecter pour le moment", "danger");
        }
    };

    const registerMode = () => {
        console.log("Passage en mode inscription:", AUTH.REGISTER);
        setShowLog(AUTH.REGISTER);
    }

    const handleGit = () => {
        window.location.href = "/api/github";
    };


    return (
        <main className="full LogRegister-flex1 LogRegister-bglow">

            <div className="LogRegister-div1 iconecolor">

                <div id="alert-container">
                    {/* ne pas creat une div faire un innertext */}
                </div>

                <form id="login" className="full LogRegister-flex2 center" onSubmit={logsub}>

                    <h4>CONNECTEZ-VOUS</h4>

                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="you@exemple.com"
                        required
                    />

                    <label htmlFor="password">Mot de passe</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="1234btw"
                        required
                    />

                    <div className="full LogRegister-flex3">

                        <button type="submit"
                                className="iconecolor negativ"
                                >
                                Connexion
                        </button>

                        <button type="button"
                                className="iconecolor negativ"
                                onClick={registerMode}
                                >
                                Inscris-toi
                        </button>

                        <button type="button"
                                className="iconecolor negativ"
                                target="_blank"
                                onClick={handleGit}
                                >
                                <FaGithub/> GitHub
                        </button>
                    </div>
                </form>
            </div>
        </main>
    )
}