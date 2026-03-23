const paths = {
    chat: "/ws/chatG",
    priv: "/ws/chatP",
    morp: "/ws/morp",
    friend: "/ws/friend",
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
        this.attempt = {
            chat : 0,
            priv : 0,
            morp : 0,
            friend : 0,
            pong : 0
        };
        this.queue = {
            chat : [],
            priv : [],
            morp : [],
            friend : [],
            pong : []
        };
        this.listeners = {
            chat: new Map(),
            pong: new Map(),
            friend: new Map(),
            morp: new Map(),
            priv: new Map(),
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
        this.socket[name].onopen = () => {
            this.sendd(name,{type: "auth",  mess: null});
            console.log("WebSocket connecté avec succès.");
            this.flushQueue(name);
        }

        this.socket[name].onmessage = (event) => {
            if (!event.data) {return;}
            const dataa = JSON.parse(event.data);
            console.log("Message reçu via WebSocket[CHATG]:", dataa.type, dataa.mess);
            // if (dataa.type === 'message') {
                console.log("Message reçu de type message via WebSocket:", dataa.mess);
                this.listeners[name].forEach(cb => cb(dataa));
            // }
            if (dataa.type === 'ping'){
                console.log("receive PING ", name)
                const data = {
                    type: 'pong',
                }
                this.sendd(name, data)
            }
            if (dataa.type === 'auth_good')
                this.attempt[name] = 0;
            if (dataa.type === 'co_good' && name === "friend"){
                this.flushQueue(name);
            }
        }
        this.socket[name].onerror = (error) => {
            console.log("errr socket" + error);
        }
        this.socket[name].onclose = (event) => {    
            if (event.code == 1008){
                document.cookie = "token=; Max-Age=0; path=/;";
                return ;
            }
            this.attempt[name]++;
            if (this.attempt[name] > 10)
                return ;
            if (this.reco[name])
                setTimeout(() => this.connectsocket(name), 1000);
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

    sendd (name, data){
        console.log("sendd called with data:", data);
        const socket = this.socket[name];
        if (!socket){
            console.log("pas de socket pour " + name);
            return ;
        }
        console.log("coucou je suis dans sendd" + " " + socket.readyState);

        if (socket.readyState !== WebSocket.OPEN) {
            console.log("proble de socket :envoie impossible");
            this.queue[name].push(data);
            return;
        }
        console.log("envoi du message via WebSocket:", data, " to socket:", name);
        socket.send(JSON.stringify(data));
    }
    
    disconnect(name){
        this.reco[name] = false;
        this.sendd(this.socket[name], {type: "logout"});
        if (this.socket[name]){
            this.socket[name].close();
            this.socket[name] = null;
        }
    }

    flushQueue(name){
        const socket = this.socket[name];
        const q = this.queue[name];

        while(q.length > 0){
            const msg = q.shift();
            this.sendd(name, msg);
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
