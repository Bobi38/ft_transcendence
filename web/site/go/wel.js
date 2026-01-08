import { showAlert } from '../fct1.js';

console.log("wel.js loaded");
console.log(sessionStorage.getItem('alertMessage'));



document.addEventListener('DOMContentLoaded', () => {
    const message = sessionStorage.getItem('message');
    const type = sessionStorage.getItem('type');

    if (message) {
        console.log("Message:", message);
        showAlert(message, type);
        sessionStorage.removeItem('alertMessage');
        sessionStorage.removeItem('alertType');
    }
});



const reponse = await fetch('/api/welcome', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    });
    const result = await reponse.json();
    console.log("Response from /api/welcome:", result);
// const range = document.querySelector("#prix-max");
// const affichage = document.querySelector("#valeur-prix");
// // Affiche la valeur dès le chargement
// affichage.innerText = range.value;

// // Met à jour à chaque mouvement du curseur
// range.addEventListener("input", () => {
//   affichage.innerText = range.value;
// });