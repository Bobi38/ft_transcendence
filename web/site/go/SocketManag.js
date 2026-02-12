
class SocketManag{
    constructor(){
        this.socket = null;
        this.reco = true;
        this.nbco = 0;
        this.listeners = {
            chat: [],
            game: [],
            room: [],
        };
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
            console.log("Message reçu via WebSocket:", dataa.type, dataa.mess);
            if (dataa.type === 'message') {
                this.listeners.chat.forEach(cb => cb(dataa));
            }
            if (dataa.type === 'game') {
                this.listeners.game.forEach(cb => cb(dataa));
            }
            if (dataa.type === 'waitRoom') {
                console.log("Message reçu de type waitRoom via WebSocket:", dataa.mess);
                this.listeners.room.forEach(cb => cb(dataa));
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
    
    onChat(cb) {
        if (!this.listeners.chat.includes(cb))
            this.listeners.chat.push(cb);
    }

    offChat(cb) {
        this.listeners.chat = this.listeners.chat.filter(listener => listener !== cb);
    }

    offGame(cb) {
        this.listeners.game = this.listeners.game.filter(listener => listener !== cb);
    }

    offRoom(cb) {
        this.listeners.room = this.listeners.room.filter(listener => listener !== cb);
    }

    onGame(cb) {
        this.listeners.game.push(cb);
    }

    onRoom(cb) {
        if (!this.listeners.room.includes(cb))
            this.listeners.room.push(cb);
    }

    nb(){
        return this.nbco;
    }

    sendd (data){
        console.log("coucou je suis dans sendd" + " " + this.socket.readyState);
        if (this.socket && this.socket.readyState == WebSocket.OPEN){
            console.log("envoi du message via WebSocket:", data);
            this.socket.send(JSON.stringify(data));
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
