import { showAlert } from './fct.js';

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
        alert("Missing value");
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
            sessionStorage.setItem('message', "Registration successful");
            sessionStorage.setItem('type', "success");
            console.log("Success =", result.message);
            window.location.href = "welcome.html";
        } else {
            console.log("Error =", result.message);
        }
    } catch (error) {
        console.error("Server error", error);
    }
});