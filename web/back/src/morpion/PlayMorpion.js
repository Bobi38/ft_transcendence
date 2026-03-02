import { manager_room } from './ManagRoom.js';

const cooldowns = new Map();

export function playMorpion(message, socket){
    const id = socket.userId
    console.log(`ggggggggggg   playMorpion   ggggggggggggggg`,  id)
    if (cooldowns.has(id)) return;

    cooldowns.set(id, true);
    setTimeout(() => cooldowns.delete(id), 200);

    console.log("ca communique avec morpion", message)
    if (message === "reboot") {
        manager_room.removeAll("le serveur a reboot");
        return;
    }

    if (message === "je pars") {
        console.log("abondon de ", id);
        manager_room.removePlayer(id);
        return;
    }

    if (message === "playfirst") {
        console.log("j ai recu le message pour jouer le premier");
        // a dev
        socket.send(JSON.stringify({type: "game", message: "pas encore gerer"}))
        return;
    }

    if (message === "je veux jouer") {
        console.log("nouvelle demande");
        const game = manager_room.findOnePlace(socket, "Morpion", id);
        socket.send(JSON.stringify({type: "game", message: game.getId()}))
        return;
    }

    let game = manager_room.isInRoom(id)

    if (!game){
        console.log("nouveau joeur prend une place");
        game = manager_room.findOnePlace(socket, "Morpion", id);
        console.log(`nouveau joueur dans ${game}`);

        if (!game) {
            console.log("Impossible de trouver ou créer une partie");   
        }
        return;
    }

    if(!game.getLock()){
        if (game.play(id, message)) {
            if(game.checkVictory()){
                console.log(`fin de la partie de ${game}`);
                manager_room.removeRoom(game.getId());
            }
            return ;
        }        
        console.log("toujours en attente");
        socket.send({message: "il faut attendre"})
        return ;
    }

    console.log("st ce que la partie estlock ? ");
    if (game.getLock()){
        console.log("non");
        console.log(`debut de partie de ${game}`);
        game.selectPlayer1(id);
        game.player1.send({message: "a toi de jouer"});
        game.player2.send({message: "en attente joueur 1"});
        game.startTurnTimer(game.player1);
        return ;
    }
    console.log("oui, on joue ????");

}