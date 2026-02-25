
class SocketManag{
    constructor(){
        console.log("Création de SocketManag");
        this.socket = null;
        this.reco = true;
        this.nbco = 0;
        this.listeners = {
            chat: new Map(),
            game: [],
            room: [],
            priv: [],
        };
    }

    connect(){
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            console.log("WebSocket déjà connecté.");
            return;
        }
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.host; // Inclut le port si présent
        console.log(`${protocol}//${host}/ws`);
        this.socket = new WebSocket(`${protocol}//${host}/ws`);
        console.log("Tentative de connexion au WebSocket...");
        this.socket.onopen = () => {
            this.sendd({type: "auth",  mess: null})
        }

        this.socket.onmessage = (event) => {
            if (!event.data) {console.log("qwerty14");return;}
            const dataa = JSON.parse(event.data);
            console.log("Message reçu via WebSocket:", dataa.type, dataa.mess);
            if (dataa.type === 'message') {
                console.log("Message reçu de type message via WebSocket:", dataa.mess);
                console.log("Listeners chat:", this.listeners.chat);
                console.log("Nombre de listeners chat:", this.listeners.chat.size);
                this.listeners.chat.forEach(cb => cb(dataa));
            }
            if (dataa.type === 'game') {
                this.listeners.game.forEach(cb => cb(dataa));
            }
            if (dataa.type === 'waitRoom') {
                console.log("Message reçu de type waitRoom via WebSocket:", dataa.mess);
                this.listeners.room.forEach(cb => cb(dataa));
            }
            if (dataa.type === 'priv_mess') {
                console.log("Message reçu de type priv_mess via WebSocket:", dataa.mess);
                this.listeners.priv.forEach(cb => cb(dataa));
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
    
    onPriv(cb) {
        if (!this.listeners.priv.includes(cb))
            this.listeners.priv.push(cb);
    }

    onChat(cb, name) {
        if (!this.listeners.chat.has(name)){
            console.log("Ajout d'un listener chat:", cb);
            console.log("Listeners chat avant ajout:", this.listeners.chat);
            this.listeners.chat.set(name, cb);
            console.log("Listeners chat après ajout:", this.listeners.chat);
        }
    }

    offPriv(cb) {
        this.listeners.priv = this.listeners.priv.filter(listener => listener !== cb);
    }
    
    // offChat(cb) {
    //     this.listeners.chat = this.listeners.chat.filter(listener => listener !== cb);
    // }

    offChat(name) {
        this.listeners.chat.delete(name);
    }

    offGame(cb) {
        this.listeners.game = this.listeners.game.filter(listener => listener !== cb);
    }

    offRoom(cb) {
        this.listeners.room = this.listeners.room.filter(listener => listener !== cb);
    }
 
    offPriv(cb){
        this.listeners.priv = this.listeners.priv.filter(listener => listener !== cb);
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
        if (this.socket.readyState == WebSocket.OPEN)
            this.socket.close();
        this.socket = null;
    }
    getState(){
        if (this.socket)
            return this.socket.readyState;
        return null;
    }
}

export const SocketM = new SocketManag();
