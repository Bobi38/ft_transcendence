import { manager_room } from './ManagRoom.js';

const cooldowns = new Map();

export function playMorpion(message, socket){
    const id = socket.userId;

    if (cooldowns.has(id)) return;

    cooldowns.set(id, true);
    setTimeout(() => cooldowns.delete(id), 200);

    console.log(`connecte dans play Morpion ${message} de ${id}`)

    let game = manager_room.isInRoom(id);

    // if (!game){

    //     manager_room.lobby.addPlayer(socket, id);
    // }

    if (message === "reboot") {
        manager_room.removeAll("le serveur a reboot");
        return;
    }

    if (message === "je pars") {
        console.log("abondon de ", id);
        // if (!game){
        //     manager_room.lobby.removePlayer(id);
        //     return;
        // }
        if (!game.getLock()) {
            manager_room.removePlayer(id, "bye bye");
            return;
        }

        if (id === game.getTurn())
            game.switchTurn;
        game.handleEndGame('abort', game.getTurn());
        game.notifyTurn(
            { message: "Abondon - tu as gagne", turn: false },
            { message: "Abondon - tu as perdu", turn: false });
        manager_room.removeRoom();
    }

    if (message === "je veux jouer") {
        console.log("nouvelle demande");
        if (game){
            console.log("a deja une partie");
            socket.send(JSON.stringify({type: "game", message: `ca peut etre tres long :${game}}`}))
            return ;
        }

        game = manager_room.findOnePlace(socket, "Morpion", id);
        // manager_room.lobby.removePlayer(id);
        socket.send(JSON.stringify({type: "game", message: game.getId()}))
        try{
            game.setLock(true);
            game.startGame(id);

            game.notifyTurn(
                { message: "À toi de jouer", turn: true },
                { message: "Tour adverse", turn: false });
        }
        catch (err) {
            console.log("erreur");
            game._turn = id;
            console.log("bien ici");
            socket.send(JSON.stringify({type: "game", message: "en attente de joueur"}))
        }
        return;
    }

    if (message === "playfirst") {
        console.log("message pour jouer en second");
        if (game.setFirstPlayer())
            socket.send(JSON.stringify({ type: "game", message: `${game} : tu joues en second` }))
        return;
    }

    if (!game) return;
    // if (!game.isTurnPlayer(id)) return;

    console.log("le jeu est lock - ca joue");
    if (game.play(id, message)) {
        if(game.checkVictory()){
            console.log(`fin de la partie de ${game}`);
            manager_room.removeRoom(game.getId());
            return ;
        }
        game.switchTurn();
        game.notifyTurn(
            { message: "À toi de jouer", turn: true },
            { message: "Tour adverse", turn: false });
        game.startTurnTimer();
    }

}