import {manager_room as manager, manager_room} from './ManagRoom.js';

const cooldowns = new Map();

export function morpionGame(cmd, socket) {
    console.log("ca va les filles")
    if (cooldowns.get(socket) === cmd) return;
    cooldowns.set(socket, cmd);
    setTimeout(() => cooldowns.delete(socket), 1000);

    if (cmd === "reboot") {
        manager.removeAll("reboot")
        return ;
    }

    if (cmd === "je pars") {
        console.log("j ai recu le message depart");
        manager.removePlayer(socket);
        return;
    }

    if (cmd === "playfirst") {
        console.log("j ai recu le message pour jouer le premier");
        // a dev
        send(socket, "ok tu joueras en premier");
        return;
    }

    const game = manager.findGame(socket);

    if (game) {
        const index = +cmd;
        if (!game.play(socket, index)) return;

        const result = game.checkVictory();

        if (result) {
            game.clearTimer();

            if (result === "draw") {
                game.players.forEach(p => send(p, "Égalité !", game.board));
            } else {
                // const winner = result === "0" ? game.players[0] : game.players[1];
                // const loser = winner === game.players[0] ? game.players[1] : game.players[0];

                send(game.winner, "Tu as gagné !", game.board);
                send(game.looser, "Tu as perdu !", game.board);
            }

            manager.removeGame(game);
            return;
        }

        const opponent = game.players.find(p => p !== socket);
        send(socket, "Bien joué, attends ton adversaire", game.board);
        send(opponent, "À toi de jouer !", game.board);

        game.startTimer();
        return;
    }
}