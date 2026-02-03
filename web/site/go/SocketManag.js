import { HistoryC } from '../fct1.js';  

class SocketManag{
    constructor(){
        this.socket = null;
        this.reco = true;
        this.nbco = 0;
    }
    connect(){
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.host; // Inclut le port si présent
        console.log(`${protocol}//${host}/ws`);
        this.socket = new WebSocket(`${protocol}//${host}/ws`);
        this.socket.onopen = () => {
            this.sendd({type: "auth",  mess: null})
        }

        this.socket.onmessage = (event) => {
            const dataa = JSON.parse(event.data);

            if (dataa.type === 'message') {
                const message = dataa.id + " : " + dataa.mess;

                chatDisplay.value += message + "\n";
                HistoryC.setHisto(chatDisplay.value);
                chatDisplay.scrollTop = chatDisplay.scrollHeight;
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
