import WebSocket from 'ws';

let waitingPlayer = null;
const cooldowns = new Map();
const manager = new class GameManager {
    constructor() {
        this.games = [];
    }

    startGame(player1, player2) {
        const game = new Game(player1, player2);
        this.games.push(game);

        send(player1, "Le jeu commence - à toi de jouer", game.board);
        send(player2, "Le jeu commence - attente joueur 1", game.board);

        return game;
    }

    findGame(socket) {
        return this.games.find(game => game.players.includes(socket));
    }

    removeGame(game) {
        game.clearTimer();
        this.games = this.games.filter(g => g !== game);
    }
};

const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

class Game {
    constructor(player1, player2) {
        this.players = [player1, player2];
        this.board = Array(9).fill(" ");
        this.start = true;
        this.turnTimer = null;
    }

    countMoves() {
        return this.board.reduce((c, v) => v !== " " ? c + 1 : c, 0);
    }

    getCurrentPlayer() {
        const moves = this.countMoves();
        const isStartTurn = moves % 2 === 0;
        return isStartTurn === this.start
            ? this.players[0]
            : this.players[1];
    }

    isValidPlay(index) {
        return Number.isInteger(index)
            && index >= 0
            && index <= 8
            && this.board[index] === " ";
    }

    play(currentPlayer, index) {
        if (currentPlayer !== this.getCurrentPlayer()) {
            send(currentPlayer, "Ce n'est pas ton tour", this.board);
            return false;
        }

        if (!this.isValidPlay(index)) {
            send(currentPlayer, "Coup invalide", this.board);
            return false;
        }

        const symbol = currentPlayer === this.players[0] ? "0" : "1";
        this.board[index] = symbol;
        return true;
    }

    checkVictory() {
        for (let [a, b, c] of lines) {
            if (
                this.board[a] !== " " &&
                this.board[a] === this.board[b] &&
                this.board[a] === this.board[c]
            ) {
                return this.board[a];
            }
        }

        if (!this.board.includes(" ")) return "draw";

        return null;
    }

    clearTimer() {
        if (this.turnTimer) {
            clearTimeout(this.turnTimer);
            this.turnTimer = null;
        }
    }

    startTimer() {
        this.clearTimer();
        const opponent = this.players.find(p => p !== this.getCurrentPlayer());
        this.turnTimer = setTimeout(() => {
            send(opponent, "⏰ Dépêche-toi de jouer !", this.board);
        }, 4000);
    }
}

function send(socket, mess, board = null) {
    if (!socket || socket.readyState !== WebSocket.OPEN) return;

    socket.send(JSON.stringify({
        type: "truc",
        mess,
        board,
    }));
}

function reboot() {
    manager.games.forEach(game => {
        game.players.forEach(player => send(player, "Le serveur a rebooté"));
        game.clearTimer();
    });

    if (waitingPlayer) send(waitingPlayer, "Le serveur a rebooté");

    waitingPlayer = null;
    manager.games = [];
}

export function handletruc(data, socket) {

    if (cooldowns.has(socket)) return;
    cooldowns.set(socket, true);
    setTimeout(() => cooldowns.delete(socket), 300);

    if (data.mess === "reboot") {
        reboot();
        return;
    }

    if (data.mess === "je pars") {
        handleTrucDisconnect(socket);
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
                const winner = result === "0" ? game.players[0] : game.players[1];
                const loser = winner === game.players[0] ? game.players[1] : game.players[0];

                send(winner, "🎉 Tu as gagné !", game.board);
                send(loser, "💀 Tu as perdu !", game.board);
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

    if (!waitingPlayer) {
        waitingPlayer = socket;
        send(socket, "En attente d'un second joueur...");
    } else {
        manager.startGame(waitingPlayer, socket);
        waitingPlayer = null;
    }
}

export function handleTrucDisconnect(socket) {
    send(socket, "bye bye");

    if (waitingPlayer === socket) {
        waitingPlayer = null;
        return;
    }

    const game = manager.findGame(socket);
    if (!game) return;

    const opponent = game.players.find(p => p !== socket);

    send(opponent, "L'adversaire s'est déconnecté - victoire");
    
    manager.removeGame(game);
}

