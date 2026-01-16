
// import { WebSocket } from 'ws';
import { showAlert } from '../fct1.js';

console.log("wel.js loaded");
console.log(sessionStorage.getItem('alertMessage'));
const plus = document.querySelector('.btn-click');
const send = document.querySelector('.btn-send');
const socket = new WebSocket("wss://localhost:9000/ws");
socket.onopen = () => {
    console.log("WebSocket connection established");
};

socket.onmessage = (event) => {
    console.log("Message received via WebSocket:", event.data);
    alert("Message reçu : " + event.data);
};

send.addEventListener('click', async function (){
    const mess = document.querySelector('.message');
    console.log("Button SEND pressed, message:", mess.value);
    alert("Button SEND pressed, message:" + mess.value);
    socket.send(token + " " + mess.value);
    alert("Message sent via WebSocket");

        // let messageElem = document.createElement('div');
        // messageElem.textContent = message;
        // document.getElementById('messages').prepend(messageElem);
    // };
    // alert("before WebSocket");
    // socket.onclose = function() {
    //     alert("WebSocket connection closed");
    // }
    // socket.onerror = function(error) {
    //     console.error("WebSocket Error: ", error);
    //     alert("WebSocket Error occurred");
    // }
    // alert("after WebSocket");

});

document.addEventListener('DOMContentLoaded', async function () {
    const message = sessionStorage.getItem('message');
    const type = sessionStorage.getItem('type');
    console.log("HEEERREEEEEEEEEEEEEEEEEE");
    if (message) {
        console.log("Message:", message);
        showAlert(message, type);
        sessionStorage.removeItem('message');
        sessionStorage.removeItem('type');
    }
    const reponse = await fetch('/api/welcome', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    });
    try {
        const rep = await fetch('/api/nclick', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        const res = await rep.json();
        if (!res.success) {
            console.error('Error from /api/click GET:', rep.status);
            if (rep.status === 401) {
                window.location.href = '/';
                return;
            }
            return;
        }
        document.querySelector('#valeur-prix').textContent = res.clicks;
    } catch (err) {
        console.error('Erreur fetch /api/click:', err);
    }
});


plus.addEventListener('click', async function () {
    const data = document.querySelector('#valeur-prix');
    const valeur = data.textContent;
    console.log("Button CLICK pressed, valeur:", valeur);
    const rep = await fetch('/api/click', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({valeur}),
        credentials: 'include'
    });
    const res = await rep.json();
    console.log("Fetch CLICK done");
    console.log("Response from /api/cliccccck: ", res.clicks);
    document.querySelector('#valeur-prix').textContent = res.clicks

});



// const reponse = await fetch('/api/welcome', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         credentials: 'include'
//     });
    // const result = await reponse.json();
//     console.log("Response from /api/welcome:", result);
// const range = document.querySelector("#prix-max");
// const affichage = document.querySelector("#valeur-prix");
// // Affiche la valeur dès le chargement
// affichage.innerText = range.value;

// // Met à jour à chaque mouvement du curseur
// range.addEventListener("input", () => {
//   affichage.innerText = range.value;
// });