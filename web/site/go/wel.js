
// import { WebSocket } from 'ws';
import { showAlert } from '../fct1.js';
import {SocketM} from './SocketManag.js';
import { HistoryC } from '../fct1.js';  

console.log("wel.js loaded");
const plus = document.querySelector('.btn-click');
const send = document.querySelector('.btn-send');
const chatDisplay = document.querySelector('#chat-display');
const to = sessionStorage.getItem('token');
// Détecte automatiquement le bon protocole et host
// const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
// const host = window.location.host; // Inclut le port si présent
// console.log(`${protocol}//${host}/ws`);
// const socket = new WebSocket(`wss://localhost:9000/ws`);
// socket.onopen = () => {
//     console.log("WeeeeeeeeeeebSocket connection established");
// };
// const id = sessionStorage('token');
// console.log(id);
// socket.onopen = () => {
//     console.log("WebSocket connection established");
//     console.log("ReadyState:", socket.readyState);
// };

// socket.onmessage = (event) => {
//     console.log("Message received via WebSocket:", event.data);
//     alert("Message reçu : " + event.data);
// };

// socket.onerror = (error) => {
//     console.error("WebSocket Error:", error);
//     alert("WebSocket Error occurred");
// };

// socket.onclose = (event) => {
//     console.log("WebSocket closed:", event.code, event.reason);
//     alert("WebSocket closed");
// };

function addmess(text){
    console.log("-----" , display);
    display.value += text + "\n";
    display.scrollTop = display.scrollHeight;

}

send.addEventListener('click', async function (){
    const mess = document.querySelector('.message');
    
    console.log("Button SEND pressed, message:", mess.value);
    // console.log("WS readyState:", socket.readyState); // 1 = OPEN
    const data = {
        type: "mess",
        mess: mess.value,
        id: to
    }
    SocketM.sendd(data);
    const message = "me : " + mess.value;
    
    chatDisplay.value += message + "\n";
    HistoryC.setHisto(chatDisplay.value);
    chatDisplay.scrollTop = chatDisplay.scrollHeight;
});



document.addEventListener('DOMContentLoaded', async function () {
    const message = sessionStorage.getItem('message');
    const type = sessionStorage.getItem('type');
    if (message) {
        console.log("Message:", message);
        showAlert(message, type);
        sessionStorage.removeItem('message');
        sessionStorage.removeItem('type');
    }
    const n = SocketM.nbco;
    console.log(n);
    // alert(sessionStorage.getItem('token'));
    if (SocketM.nb() === 0){
        SocketM.connect(to);
    }
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
    // try{
    //     const rep1 = await fetch ('/api/getchat', {
    //         method: 'GET',
    //         headers :{
    //             'Content-Type': 'application/json'
    //         },
    //         credentials: 'include'
    //     });
    //     const rest1 = await rep1.json();
    //     if (rest1.success){
    //         chatDisplay.value = rest1.message;
    //         chatDisplay.scrollTop = chatDisplay.scrollHeight;
    //     }
    //     else{
    //         throw new Error("error chatjson" , rest1.message);
    //     }
    // }catch(err){
    //     alert("error from getchat = ", err);
    // }
    if (chatDisplay.value.length == 0 && HistoryC.getHisto().length != 0)
        chatDisplay.value = HistoryC.getHisto();
    chatDisplay.scrollTop = chatDisplay.scrollHeight;
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
export {addmess};