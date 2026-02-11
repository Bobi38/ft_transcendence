let count = 0;
let sockets = [];

export function handletruc(data, socket){
    if(sockets.includes(socket)){
        socket.send(JSON.stringify({type: "truc", mess: "deja connecte"}));
        return ;
    }
    count++;
    if (count % 2 == 1){
        sockets.push(socket);
        socket.send(JSON.stringify({type: "truc", mess: "tu es le premier"}));
        return ;
    }
    sockets.push(socket);
    socket.send(JSON.stringify({type: "truc", mess: "nous sommes deux"}));
    const other = sockets[sockets.length - 2];
    other.send(JSON.stringify({type: "truc", mess: "nous sommes deux"}));
    sockets = [];
}