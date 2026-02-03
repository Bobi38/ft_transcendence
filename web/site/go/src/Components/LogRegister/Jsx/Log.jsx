/* Css */
import "../LogRegister.css";

import { showAlert } from "../../../../../fct1";
import { useNavigate, Link } from "react-router-dom";
    
export default function Log() {

    const navigate = useNavigate();

    const logsub =  async (event) => {
        event.preventDefault();

        const form = event.target;
        const data = {
            email: form.email.value.trim(),
            password: form.password.value.trim()
        };

        if (!data.email || !data.password) {
            alert("Veuillez remplir tous les champs");
            return;
        }

        try {
            const reponse = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await reponse.json();

            if (result.success) {
                alert(result.tooken);
                sessionStorage.setItem('token', result.tooken);
                sessionStorage.setItem('message', "Registration successful");
                sessionStorage.setItem('type', "success");
                navigate("/home");
            } else {
                showAlert("Erreur : " + result.message, "danger");
            }
        } catch (error) {
            console.error("Erreur serveur", error);
            alert("Impossible de se connecter pour le moment");
        }
    };

    return (
        <>
            <main className="full LogRegister-flex1 LogRegister-bglow">
                
                <div className="div1 iconecolor">

                    <div id="alert-container">
                        {/* ne pas creat une div faire un innertext */}
                    </div>
                    
                    <form id="login" className="full LogRegister-flex2 center" onSubmit={logsub}>

                        <h4>CONNECTEZ VOUS</h4>

                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" aria-describedby="email-help" placeholder="you@exemple.com"/>

                        <label htmlFor="password">Mot de passe</label>
                        <input type="password" id="password" name="password" placeholder="1234btw"/>
                        
                        <div className="full LogRegister-flex3">
                            <Link to="/register" className="iconecolor negativ">Inscrit-toi</Link>
                            <button type="submit" className="iconecolor negativ">Se connecter</button>
                        </div>

                    </form>

                </div>
            </main>
        </>
    )
}
