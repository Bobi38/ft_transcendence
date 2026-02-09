import { HistoryC } from '../fct1.js';  

// class SocketManag{
//     constructor(){
//         this.socket = null;
//         this.reco = true;
//         this.nbco = 0;
//         this.listeners = {
//             message: [],
//             game: [],
//             room: [],
//         };
//     }
//     connect(){
//         const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
//         const host = window.location.host; // Inclut le port si présent
//         console.log(`${protocol}//${host}/ws`);
//         this.socket = new WebSocket(`${protocol}//${host}/ws`);
//         this.socket.onopen = () => {
//             this.sendd({type: "auth",  mess: null})
//         }

//         this.socket.onmessage = (event) => {
//             const dataa = JSON.parse(event.data);

//             if (dataa.type === 'message') {
//                 this.listeners.message.forEach(cb => cb(dataa));
//             }
//             if (dataa.type === 'game') {
//                 this.listeners.game.forEach(cb => cb(dataa));
//             }
//             if (dataa.type === 'room') {
//                 this.listeners.room.forEach(cb => cb(dataa));
//             }
//         };
//         this.socket.onerror = (error) => {
//             console.log("errr socket" + error);
//         }
//         this.socket.onclose = () => {
//             // alert ('deco');
//             if (this.reco)
//                 this.nbco++;
//                 setTimeout(() => this.connect(), 50);
//         }
//         this.nbco++;
        
//     }
    
//     onChat(cb) {
//         if (!this.listeners.chat.includes(cb))
//             this.listeners.chat.push(cb);
//     }

//     offChat(cb) {
//         this.listeners.chat = this.listeners.chat.filter(listener => listener !== cb);
//     }

//     onGmae(cb) {
//         this.listeners.game.push(cb);
//     }

//     onRoom(cb) {
//         this.listeners.room.push(cb);
//     }

//     nb(){
//         return this.nbco;
//     }

//     sendd (data){
//         console.log("coucou je suis dans sendd");
//         if (this.socket && this.socket.readyState == WebSocket.OPEN){
//             console.log("envoi du message via WebSocket:", data);
//             this.socket.send(JSON.stringify(data));
//         }
//     }
//     disco(){
//         this.reco = false;
//         this.id = null;
//         if (this.socket){
//             this.socket.close();
//             this.socket = null;
//         }
//     }
// }

class SocketManag{
    constructor(){
        this.socket = null;
        this.id = null;
        this.reco = true;
        this.nbco = 0;
    }
    connect(token){
        console.log("totot " , token);
        if (token)
            this.id = token;
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.host; // Inclut le port si présent
        console.log(`${protocol}//${host}/ws`);
        this.socket = new WebSocket(`${protocol}//${host}/ws`);
        this.id = token;
        this.socket.onopen = () => {
            if (this.id)
                this.sendd({type: "auth", id: this.id,  mess: null})
        }

    const chatDisplay = document.getElementById("chat-display");

    this.socket.onmessage = (event) => {
        const dataa = JSON.parse(event.data);

        if (dataa.type === 'message') {
          const message = dataa.id + " : " + dataa.mess;
          setDisplayedMessages((prev) => [...prev, dataa.id + ": " + dataa.mess]);
        }
    };
        this.socket.onerror = (error) => {
            console.log("errr socket" + error);
        }
        this.socket.onclose = () => {
            // alert ('deco');
            if (this.reco)
                this.nbco++;
                setTimeout(() => this.connect(), 50);
        }
        this.nbco++;
        
    }
    
    nb(){
        return this.nbco;
    }

    sendd (data){
        console.log("coucou");
        if (this.socket && this.socket.readyState == WebSocket.OPEN)
            this.socket.send(JSON.stringify(data));
    }
    disco(){
        this.reco = false;
        this.id = null;
        if (this.socket){
            this.socket.close();
            this.socket = null;
        }
    }
}

export const SocketM = new SocketManag();
