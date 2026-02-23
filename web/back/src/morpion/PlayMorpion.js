import { manager_room } from './ManagRoom.js';

const cooldowns = new Map();

export function playMorpion(data, socket){
    if (cooldowns.has(socket)) return;

    cooldowns.set(socket, true);
    setTimeout(() => cooldowns.delete(socket), 200);

    console.log("ca communique avec morpion")
    if (data.message === "reboot") {
        console.log("demande reboot recue");
        manager_room.removeAll("le serveur a reboot");
        return;
    }

    if (data.message === "je pars") {
        console.log("abondon de ", socket.id);
        manager_room.removePlayer(socket.id);
        return;
    }

    let game = manager_room.isInRoom(socket.id)

    if (!game){
        game = manager_room.findOnePlace(socket, socket.id, "Morpion")

        if (!game) {
            console.log("Impossible de trouver ou créer une partie");
            return;
        }
    }

    if (!game.getLock()){
        console.log(`debut de partie de ${game}`);
        game.selectPlayer1(socket.id);
        game.player1.send({message: "a toi de jouer"});
        game.player2.send({message: "en attente joueur 1"});
        game.startTurnTimer(game.player1);
        return ;
    }

    if (game.play(socket.id, data.message)) {
        if(game.checkVictory()){
            console.log(`fin de la partie de ${game}`);
            manager_room.removeRoom(game.getId());
        }
    }
}