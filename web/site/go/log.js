import { showAlert } from '../fct1.js';

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
        const reponse = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await reponse.json();

        if (result.success) {
            sessionStorage.setItem('token', result.tooken);
            sessionStorage.setItem('message', "Registration successful");
            sessionStorage.setItem('type', "success");
            window.location.href = "/go/welcome.html";
        } else {
            showAlert("Erreur : " + result.message, "danger");
        }
    } catch (error) {
        console.error("Erreur serveur", error);
        alert("Impossible de se connecter pour le moment");
    }
});
