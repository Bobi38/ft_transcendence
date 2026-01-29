import "./log.css";
import { useNavigate } from "react-router-dom";
import { showAlert } from "../../../../../fct1";
    
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
        <main>
            <h2>CONNECTEZ_VOUS</h2>
			    <div id="alert-container"></div>
			    <form id="login" onSubmit={logsub}>
        		    <div className="mb-3">
            	    <label htmlFor="email">Email</label>
            	    <input type="email" className="form-control" id="email" name="email" aria-describedby="email-help" placeholder="you@exemple.com"/>
            	    <div id="email-help" className="form-text">L'email utilisé lors de la création de compte.</div>
        	    </div>
        	    <div className="mb-3">
            	    <label htmlFor="password">Mot de passe</label>
            	    <input type="password" className="form-control" id="password" name="password"/>
        	    </div>
        	    <button type="submit" className="btn btn-priimary">Se conencter</button>
    	    </form>
            <button type="button" onClick={() => navigate("/register")}>S'inscrire</button>
        </main>
        </>
    )
}
