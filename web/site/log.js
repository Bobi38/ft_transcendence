import { showAlert } from './fct.js';

const form = document.getElementById('login');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const data = {
        email: form.email.value.trim(),
        password: form.password.value.trim()
    };

    if (!data.email || !data.password) {
        alert("Veuillez remplir tous les champs");
        return;
    }

    try {
        const reponse = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await reponse.json();
        console.log("ccc" + result);

        if (result.success) {
            showAlert("Connexion réussie", "success");
            window.location.href = "welcome.html";
        } else {
            showAlert("Erreur : " + result.message, "danger");
        }
    } catch (error) {
        console.error("Erreur serveur", error);
        alert("Impossible de se connecter pour le moment");
    }
});
