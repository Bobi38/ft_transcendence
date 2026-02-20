import { Room } from './Room.js'
import GameMorp from "../models/GameMorp";
import WebSocket from "ws";

// class Room {
//     constructor (id) {
//         this.id = id;
//         this.playersid = new Map();
//         this.maxPlayers = null;
//         this.locked = false;
//         this.timer = null;
//         this.winner = null;
//         this.looser = null;
//     }
// }

export class MorpionRoom extends Room {
    constructor (id) {
        super(id);
        this.maxPlayers = 2;
        this.player1 = null;
        this.player2 = null;
        this.howWin = null;
        this.dateGame = new Date();
        this.Ending = null;
        this.time = null;
        this.time1 = 0;
        this.time2 = 0;
        this.map = null;
        this.board = Array(9).fill(" ");
        this.turnTimer = null;
        this.lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
    }

    selectPlayer1(id) {
        const players = [...this.playersid.keys()];

        if (!players.includes(id)) {
            throw new Error("Le joueur n'est pas dans la room");
        }

        if (players.length !== this.maxPlayers) {
            throw new Error("Il faut exactement 2 joueurs pour sélectionner player1");
        }
        
        this.player1 = id;
        this.player2 = [...this.playersid.keys()].find(p => p !== id);
        this.time = Date.now();
    }

    countMoves() {
        return this.board.reduce((c, v) => v !== " " ? c + 1 : c, 0);
    }

    getCurrentPlayer(current = true) {
        const moves = this.countMoves();
        const isStartTurn = (moves % 2 === 0) === current;
        return isStartTurn ? this.player1 : this.player2;
    }

    isValidPlay(index) {
        return Number.isInteger(index)
            && index >= 0
            && index <= 8
            && this.board[index] === " ";
    }

    play(currentPlayer, index) {
        if (currentPlayer !== this.getCurrentPlayer()) {
            this.send(currentPlayer, "Ce n'est pas ton tour", this.board);
            return false;
        }

        if (index === "play"){ //peut etre une veille fonction
            this.send(currentPlayer, "wait wait wait", this.board);
            return false;
        }

        if (!this.isValidPlay(index)) {
            this.send(currentPlayer, "Coup invalide", this.board);
            return false;
        }

        const symbol = currentPlayer === this.player1 ? "X" : "O";
        this.board[index] = symbol;

        const stopChrono = this.time;
        this.time = Date.now();
        stopChrono = this.time - stopChrono;
        if (symbol === "X")
            time1 += stopChrono;
        else
            time2 += stopChrono;

        return true;
    }

    setVictory(ending){
        this.clearTimer();

        this.time1 = 1;
        this.time2 = 2;
        this.Ending = ending;

        this.majdb().catch(err =>
            console.error("Erreur sauvegarde DB:", err)
        );
    }

    checkVictory() {
        let i = 0;
        for (let [a, b, c] of this.lines) {
            let char = this.board[a];
            if (
                char !== " " &&
                char === this.board[b] &&
                char === this.board[c]
            ) {
                this.winner = char === "X" ? this.player1 : this.player2;
                this.looser = char === "X" ? this.player2 : this.player1;
                this.howWin = "HVD"[Math.floor (i / 3)];
                this.setVictory("W");
                return true;
            }
            i++
        }

        if (!this.board.includes(" ")) {
            this.setVictory("E");
            return true;
        }

        return false;
    }

    clearTurnTimer() {
        if (this.turnTimer) {
            clearTimeout(this.turnTimer);
            this.turnTimer = null;
        }
    }

    startTurnTimer() {
        this.clearTurnTimer();
        const opponent = this.getCurrentPlayer(false);
        this.turnTimer = setTimeout(() => {
            this.send(opponent, "⏰ Dépêche-toi de jouer !", this.board);
        }, 4000);
    }

    serializeBoard() {
        return this.board
        .map(cell => cell === " " ? "-" : cell)
        .join("");
    }

    async majdb () {
        await GameMorp.create({
            howWin: this.howWin,
            dateGame: this.dateGame,
            Ending: this.Ending,
            player1: this.player1,
            player2: this.player2,
            time1: this.time1,
            time2: this.time2,
            map: this.serializeBoard(),
            winner: this.winner
        });
    }

    send(socket, mess, board = null) {
        if (!socket || socket.readyState !== WebSocket.OPEN) return;
    
        socket.send(JSON.stringify({
            type: "room",
            mess,
            board,
        }));
    }

    sendAll(mess) {
        if (!mess) return;

        this.playersid.forEach(e => {
            this.send(e.socket, mess, this.board);
        });
    }
}