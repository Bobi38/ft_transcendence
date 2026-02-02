import "./register.css";
import { showAlert } from "../../../../../fct1";
import {useNavigate} from "react-router-dom";
    
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
                navigate("/log");
            } else {
                showAlert(result.message, 'danger');
            }
        } catch (error) {
            console.error("Server error", error);
        }
    };

    return (
        <>
        <header>
			<h1>CONNECT</h1>
		</header>
		<main>
			<h2>INSCRIVER-VOUS</h2>
			<div id="alert-container"></div>
			<form id="regist" onSubmit={retsubmit}>
        	<div>
            	<label htmlFor="name" className="form-label">Nom</label>
            	<input type="text" className="form-control" id="name" name="name" placeholder="Votre nom"/>
        	</div>
        	<div>
            	<label htmlFor="email" className="form-label">Email</label>
            	<input type="email" className="form-control" id="email" name="email" aria-describedby="email-help" placeholder="you@exemple.com"/>
        	</div>

        	<div>
            	<label htmlFor="password" className="form-label">Mot de passe</label>
            	<input type="password" className="form-control" id="password" name="password"/>
        	</div>
        	<button type="submit" className="btn btn-priimary">S'inscrire</button>
    	</form>
		</main>
        </>
    )
}
