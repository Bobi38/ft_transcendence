import { addmess } from "./wel.js";

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
        this.socket.onmessage = (event) => {
            const dataa = JSON.parse(event.data)
            // alert("Message reçu : " + dataa.mess);
            if (dataa.type === 'message'){
                alert("Message reçu : " + dataa.mess + " from " + dataa.id);
                addmess(dataa.id + " : " + dataa.mess);
            }
        }
        this.socket.onerror = (error) => {
            console.log("errr socket" + error);
        }
        this.socket.onclose = () => {
            alert ('deco');
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
