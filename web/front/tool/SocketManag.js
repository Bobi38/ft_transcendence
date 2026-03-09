const paths = {
    chat: "/ws/chatG",
    priv: "/ws/chatP",
    morp: "/ws/morp",
    pong: "/ws/goat"
};


class SocketManag{
    constructor(){
        console.log("Création de SocketManag");
        this.socket = {
            chat : null,
            priv : null,
            morp : null,
            friend : null,
            pong : null
        };
        this.reco = {
            chat : true,
            priv : true,
            morp : true,
            friend : true,
            pong : true
        };
        this.listeners = {
            chat: new Map(),
            game: new Map(),
            room: new Map(),
            priv: new Map(),
            friend: new Map()
        };
    }

    connectsocket(name){
        if (this.socket[name] && this.socket[name].readyState === WebSocket.OPEN) {return;}
        if (this.socket[name] && this.socket[name].readyState === WebSocket.CONNECTING){return ;}
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.host;
        console.log(`${protocol}//${host}${paths[name]}`);
        this.socket[name] = new WebSocket(`${protocol}//${host}${paths[name]}`);
        console.log("Tentative de connexion au WebSocket...");
        this.socket[name].onopen = () => {this.sendd(this.socket[name],{type: "auth",  mess: null})}

        this.socket[name].onmessage = (event) => {
            if (!event.data) {return;}
            const dataa = JSON.parse(event.data);
            console.log("Message reçu via WebSocket[CHATG]:", dataa.type, dataa.mess);
            // if (dataa.type === 'message') {
                console.log("Message reçu de type message via WebSocket:", dataa.mess);
                this.listeners[name].forEach(cb => cb(dataa));
            // }
            if (dataa.type === 'ping'){
                console.log("receive PING")
                const data = {
                    type: 'pong',
                }
                this.sendd(this.socket[name], data)
            }
        }
        this.socket[name].onerror = (error) => {
            console.log("errr socket" + error);
        }
        this.socket[name].onclose = () => {          
            if (this.reco[name])
                setTimeout(() => this.connectsocket(name), 300);
        }
    }

    on(type,  handle, id){
        if (!this.listeners[type]) return;
        this.listeners[type].set(id, handle);
    }

    off(type, id){
        if (!this.listeners[type]) return;
    this.listeners[type].delete(id);
    }

    sendd (socket, data){
        if (!socket)return ;
        console.log("coucou je suis dans sendd" + " " + socket.readyState);

        if (!socket || socket.readyState !== WebSocket.OPEN) {
            console.log("proble de socket :envoie impossible");
            return;
        }
        else
        {
            console.log("envoi du message via WebSocket:", data);
            socket.send(JSON.stringify(data));
        }
    }
    
    disconnect(name){
        this.reco[name] = false;

        if (this.socket[name]){
            this.socket[name].close();
            this.socket[name] = null;
        }
    }


    getState(name){
        if (this.socket[name])
            return this.socket[name].readyState;
        return null;
    }
}

const SocketM = new SocketManag();

export default SocketM;
