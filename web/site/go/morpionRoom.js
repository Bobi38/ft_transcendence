import Room from './Room.js'
import GameMorp from "../models/GameMorp";
import { Player } from './player.js'; //utile ?
import WebSocket from "ws";


export class MorpionRoom extends Room {
    constructor (id) {
        super(id);
        this._type = "Morpion"
        this._maxPlayers = 2;
        this._player1 = null;
        this._player2 = null;
        this._howWin = null;
        this._dateGame = new Date();
        this._Ending = null;
        this._time = null;
        this._map = null;
        this._looser = null;
        this._board = Array(9).fill(" ");
        this._lines = [
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
        const players = [...this._players.keys()];
        if (!players.includes(id)) {
            throw new Error("Le joueur n'est pas dans la room");
        }

        if (players.length !== this.maxPlayers) {
            throw new Error("Il faut exactement 2 joueurs pour sélectionner player1");
        }

        this.setlock(true);
        
        this.player1 = this._players.get(id);
        this.player2 = [...this._players.keys()].find(p => p !== id);
        this.time = Date.now();
    }

    countMoves() {
        return this._board.reduce((c, v) => v !== " " ? c + 1 : c, 0);
    }

    getCurrentPlayer(current = true) {
        const moves = this.countMoves();
        const isStartTurn = (moves % 2 === 0) === current;
        return isStartTurn ? this._player1 : this._player2;
    }

    isValidPlay(index) {
        return Number.isInteger(index)
            && index >= 0
            && index <= 8
            && this.board[index] === " ";
    }

    play(currentPlayer, index) {
        if (currentPlayer !== this.getCurrentPlayer()) {
            currentPlayer.send("Ce n'est pas ton tour", this.board);
            return false;
        }

        if (index === "play"){
            currentPlayer.send( "wait wait wait", this.board);
            return false;
        }

        if (!this.isValidPlay(index)) {
            currentPlayer.send("Coup invalide", this.board);
            return false;
        }

        const symbol = currentPlayer === this.player1 ? "X" : "O";
        this.board[index] = symbol;

        const timeTour = this._chrono;
        this._chrono = Date.now();
        timeTour = this._chrono - timeTour;
        currentPlayer.setPlayTime(timeTour);

        return true;
    }

    setVictory(ending){
        this.clearTimer();

        this._EndingEnding = ending;

        this.majdb().catch(err =>
            console.error("Erreur sauvegarde DB:", err)
        );
    }

    checkVictory() {
        let i = 0;
        for (let [a, b, c] of this.lines) {
            let char = this._board[a];
            if (
                char !== " " &&
                char === this._board[b] &&
                char === this._board[c]
            ) {
                this._winner = char === "X" ? this.player1 : this.player2;
                this._looser = char === "X" ? this.player2 : this.player1;
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

        this.startTurnTimer(this.getCurrentPlayer());

        return false;
    }

    startTurnTimer(player) {
        const action = () => {
            player.send({
            mess: "⏰ Dépêche-toi de jouer !",
            board: this.board
            })
        };

        player.startTurnTimer(action, 4000);
    }

    serializeBoard() {
        return this._board
        .map(cell => cell === " " ? "-" : cell)
        .join("");
    }

    async majdb () {
        await GameMorp.create({
            howWin: this._howWin,
            dateGame: this._dateGame,
            Ending: this._Ending,
            player1: this._player1.getid(),
            player2: this.player2.getid(),
            time1: this._player1.setPlayTime(0),
            time2: this._player2.setPlayTime(0),
            map: this.serializeBoard(),
            winner: this._winner,
            looser: this._looser
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