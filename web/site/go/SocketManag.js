import { HistoryC } from '../fct1.js';  

class SocketManag{
    constructor(){
        this.socket = null;
        this.reco = true;
        this.nbco = 0;
        this.queue = [];
        this.listeners = {
            chat: [],
            game: [],
            room: [],
            truc: [],
            auth: [],
        };
    }
    connect(){
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.host; // Inclut le port si présent
        console.log(`${protocol}//${host}/ws`);
        this.socket = new WebSocket(`${protocol}//${host}/ws`);
        this.socket.onopen = () => {
            this.sendd({type: "auth",  mess: "connecte"})
        while (this.queue.length > 0) {
            const msg = this.queue.shift();
            this.socket.send(JSON.stringify(msg));
            }
        }

        this.socket.onmessage = (event) => {
            const dataa = JSON.parse(event.data);
            console.log("Message reçu via WebSocket:", dataa.type, dataa.mess);
            if (dataa.type === 'message') {
                this.listeners.chat.forEach(cb => cb(dataa));
            }
            if (dataa.type === 'game') {
                this.listeners.game.forEach(cb => cb(dataa));
            }
            if (dataa.type === 'room') {
                this.listeners.room.forEach(cb => cb(dataa));
            }
            if (dataa.type === 'truc') {
                this.listeners.truc.forEach(cb => cb(dataa));
            }
            if (dataa.type === 'auth-success'){
                this.listeners.auth.forEach(cb => cb(dataa));
            }
        
        };
        this.socket.onerror = (error) => {
            console.log("errr socket" + error);
        }
        this.socket.onclose = () => {
            // alert ('deco');
            if (this.reco) {
                this.nbco++;
                setTimeout(() => this.connect(), 50);
            }
        }
        this.nbco++;
    }
    
    onChat(cb) {
        if (!this.listeners.chat.includes(cb))
            this.listeners.chat.push(cb);
    }

    offChat(cb) {
        this.listeners.chat = this.listeners.chat.filter(listener => listener !== cb);
    }

    offtruc(cb) {
        this.listeners.truc = this.listeners.truc.filter(listener => listener !== cb);
    }


    onGamee(cb) {
        this.listeners.game.push(cb);
    }

    ontruc(cb) {
        this.listeners.truc.push(cb);
    }

    onRoom(cb) {
        this.listeners.room.push(cb);
    }

    onAuth(cb) {
        this.listeners.auth.push(cb);
    }

    state(){
        return this.socket.readyState;
    }

    nb(){
        return this.nbco;
    }

    sendd (data){
        console.log("coucou je suis dans sendd", data.mess, " ", this.socket.readyState);
        if (this.socket && this.socket.readyState == WebSocket.OPEN){
            console.log("envoi du message via WebSocket:", data);
            this.socket.send(JSON.stringify(data));
        }
        else {
             this.queue.push(data);
        }
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
