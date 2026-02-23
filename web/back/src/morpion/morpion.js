import {manager_room as manager} from '../ManagRoom.js';
import WebSocket from 'ws';
import User from '../models/user.js'

const cooldowns = new Map();

export function morpionGame(cmd, socket) {

    if (cooldowns.get(socket) === cmd) return;
    cooldowns.set(socket, cmd);
    setTimeout(() => cooldowns.delete(socket), 1000);

    if (cmd === "reboot") {
        manager.removeAll("reboot")
        return ;
    }

    if (data.mess === "je pars") {
        handleTrucDisconnect(socket);
        return;
    }

    if (data.mess === "play") {
        connectNewGame(socket);
        return;
    }

    const game = manager.findGame(socket);

    if (game) {
        const index = +data.mess;
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