/* Css */
import "../LogRegister.scss";

import { showAlert } from "/app/back/src/fct1.js";
import { AUTH } from "../../Home.jsx"

export default function Register({setShowLog}) {


    const retsubmit = async (event) => {
        event.preventDefault();

        const form = event.target;
        const data = {
            name: form.name.value.trim(),
            email: form.email.value.trim(),
            password: form.password.value.trim()
        };

        if (!data.name || !data.email || !data.password) {
            showAlert("Missing value", 'danger');
            return;
        }
        console.log(data.name + " " + data.email + " " + data.password);
        try {
            const reponse = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await reponse.json();

            if (result.success) {
                setShowLog(AUTH.LOGIN);
            } else {
                showAlert(result.message, 'danger');
            }
        } catch (error) {
            console.error("Server error", error);
        }
    };

    function logMode() {
        console.log("Passage en mode connection:", AUTH.REGISTER);
        setShowLog(AUTH.LOGIN)
    }


    return (
        <>
            <main className="full LogRegister-flex1 LogRegister-bglow">

                <div className="LogRegister-div1 iconecolor">

                    <div id="alert-container">
                        {/* ne pas creat une div faire un innertext */}
                    </div>

                    <form id="regist" className="full LogRegister-flex2 center" onSubmit={retsubmit}>

                        <h4>INSCRIVEZ-VOUS</h4>

                        <label htmlFor="name">Pseudo</label>
                        <input type="text" id="name" name="name" placeholder="XxX_DarkSasuke_XxX"/>

                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" placeholder="you@exemple.com"/>

                        <label htmlFor="password">Mot de passe</label>
                        <input type="password" id="password" name="password" placeholder="1234btw"/>

                        <div className="full LogRegister-flex3">

                            <button type="submit" className="iconecolor negativ">S'inscrire</button>

                            <button type="button"
                                    className="iconecolor negativ"
                                    onClick={logMode}
                                    >
                                    Se connecter
                            </button>

                        </div>
                    </form>

                </div>
            </main>
        </>
    )
}
