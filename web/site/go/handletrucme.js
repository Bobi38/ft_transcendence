let sockets = [];
let games = [];
let nbGames = -1;
let nbPlayers = -1;

class clientOutError extends Error{
    constructor(message, index){
        super(message);
        this.name = "clientOutError";
        this.index = index;
    }
}

function sendTruc(index, mess){
    let socket = sockets[index];

    if (!socket)
        return ;

    if (socket.readyState != WebSocket.OPEN)
        throw new clientOutError("Socket closed", index);

    socket.send(JSON.stringify({
        type: "truc",
        mess,
    }))
};

function reboot(){
    sockets.forEach((_, index) => {
        sendTruc(index, "ca a reboot");
    });
    sockets = [];
    games = [];
    nbGames = -1;
    nbPlayers = -1;
}

function startgame(){
    try {
        sendTruc(nbPlayers - 1, "ffff le jeu commence");
        sendTruc(nbPlayers - 0, "ffff en attente mouvement player 1");
        games.push(Array(9).fill(" "));
        games++;
        return 1;
    }
    catch (err){
        if (err instanceof(clientOutError)){
            nbPlayers--;
            sockets.splice(err.index, 1);
        }
        else
            throw (err)
    }
    return 0;
}

function closeGame(index, mess){
    let second = index % 2 ? index - 1 : index + 1;
    try{
        sendTruc(second, "gggg abandon - you win")
        sendTruc(index, mess)
    }
    catch (err) {
        console.log(err.message)
    }
    if (nbPlayers % 2 === 0){
        games.splice(index / 2, 1);
        nbGames--;
        nbPlayers--;
    }
    nbPlayers--;
    sockets.splice(index < second ? index : second, 2);
}

export function handletruc(data, socket){
    if (data.mess === "reboot") {
        return reboot();
    }

    const index  = sockets.indexOf(socket);
    if (index === -1){
        if (data.mess === "reboot") {
            return ;
    }
        sockets.push(socket);
        nbPlayers++;
        
        if (nbPlayers % 2 === 1 && startgame()){
            console.log("on a associe deux joueurs");
            return ;
        }
        return sendTruc(nbPlayers - 1, "tttttt en attente second joueur");
    }

    if (data.mess === "reboot") {
        return reboot();
    }

    if (data.mess === "je pars"){
        return closeGame(index, "ggggg - has left");
    }

    console.log("nouvelle demande de jeu ", sockets.length);
    if (sockets.length % 2 === 1)
        sendTruc(index, "en attente 2eme joueur");
    else 
        sendTruc(index, "ca brouille tout ce double");
}
