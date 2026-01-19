class SocketManag{
    constructor(){
        this.socket = null;
        this.id = null;
        this.reco = true;
        this.nbco = 0;
    }
    connect(token = null){
        if (token)
            this.token = token;
        this.socket = new WebSocket(`wss://localhost:9000/ws`);
        this.id = token;
        this.socket.onopen = () => {
            if (this.id)
                this.send({type: "auth", mess: this.id})
        }
        this.socket.onmessage = (event) => {
            alert("Message reçu : " + event.data);
        }
        this.socket.onerror = (error) => {
            console.log("errr socket" + error);
        }
        this.socket.onclose = () => {
            console.log ('deco');
            if (this.reco)
                this.nbco++;
                setTimeout(() => this.connect(), 50);
        }
        this.nbco++;
        


    }
    
    nb(){
        return this.nbco;
    }

    send (data){
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
