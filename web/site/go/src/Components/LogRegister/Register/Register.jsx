
import "../LogRegister.css";

import { showAlert } from "../../../../../fct1";
import { useNavigate, Link} from "react-router-dom";
    
export default function Register() {

    const navigate = useNavigate();
    const form = document.getElementById('regist');

    console.log("regist.js loaded");

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
            console.log("coucou");
            if (result.success) {
                navigate("/");
            } else {
                showAlert(result.message, 'danger');
            }
        } catch (error) {
            console.error("Server error", error);
        }
    };

    return (
        <>
		<main className="full LogRegister-flex1 LogRegister-bglow">

            <div className="div1 iconecolor">

                <div id="alert-container">
                    {/* ne pas creat une div faire un innertext */}
                </div>

                <form id="regist" className="full LogRegister-flex2 center" onSubmit={retsubmit}>

                    <h4>INSCRIVER-VOUS</h4>

                    <label for="name">Pseudo</label>
                    <input type="text" id="name" name="name" placeholder="Pseudo: XxX_DarkSasuke_XxX"/>

                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" aria-describedby="email-help" placeholder="you@exemple.com"/>

                    <label for="password">Mot de passe</label>
                    <input type="password" id="password" name="password" placeholder="1234btw"/>

                    <div className="full LogRegister-flex3">
                        <button type="submit" className="iconecolor negativ">S'inscrire</button>
                    </div>
                </form>

            </div>
		</main>
        </>
    )
}
