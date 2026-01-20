import { showAlert } from '../fct1.js';

const form = document.getElementById('regist');

console.log("regist.js loaded");

form.addEventListener('submit', async (event) => {
    event.preventDefault();

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
            window.location.href = "/";
        } else {
            showAlert(result.message, 'danger');
        }
    } catch (error) {
        console.error("Server error", error);
    }
});