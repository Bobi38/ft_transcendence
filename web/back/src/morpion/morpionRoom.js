import Room from './Room.js'
import GameMorp from "../models/GameMorp.js";

class MorpionRoom extends Room {
    constructor (id) {
        super(id);
        this._type = "Morpion"
        this._maxPlayers = 2;
        this._player1 = null;
        this._player2 = null;
        this._howWin = null;
        this._Ending = null;
        this._time = null;
        this._map = null;
        this._loser = null;
        this._board = Array(9).fill(" ");
        this._chrono = null;
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

        if (players.length !== this._maxPlayers) {
            throw new Error("Il faut exactement 2 joueurs pour sélectionner player1");
        }

        this.setlock(true);
        
        this._player1 = this._players.get(id);
        this._player2 = this._players.get(
            [...this._players.keys()].find(p => p !== id));
        this._chrono = Date.now();
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
            && this._board[index] === " ";
    }

    play(currentPlayer, index) {
        if (currentPlayer !== this.getCurrentPlayer()) {
            currentPlayer.send("Ce n'est pas ton tour", this._board);
            return false;
        }

        if (!this.isValidPlay(index)) {
            currentPlayer.send("Coup invalide", this._board);
            return false;
        }

        currentPlayer.clearTurnTimer();

        const symbol = currentPlayer === this._player1 ? "X" : "O";
        this._board[index] = symbol;

        const now = Date.now();

        //init _chrono au debut de la partie
        if (this._chrono !== null) {
            const timeTour = now - this._chrono;
            currentPlayer.setPlayTime(timeTour);
        }

        this._chrono = now;

        return true;
    }

    setVictory(ending){
        this.clearTimer();

        this._Ending = ending;

        this.majdb().catch(err =>
            console.error("Erreur sauvegarde DB:", err)
        );
    }

    checkVictory() {
        let i = 0;
        for (let [a, b, c] of this._lines) {
            let char = this._board[a];
            if (
                char !== " " &&
                char === this._board[b] &&
                char === this._board[c]
            ) {
                this._winner = char === "X" ? this._player1 : this._player2;
                this._loser = char === "X" ? this._player2 : this._player1;
                this._howWin = "HVD"[Math.floor (i / 3)];
                this.setVictory("W");
                return true;
            }
            i++
        }

        if (!this._board.includes(" ")) {
            this.setVictory("E");
            return true;
        }

        this.startTurnTimer(this.getCurrentPlayer());

        return false;
    }

    // avertissement avant timeoout
    startTurnTimer(player) {
        const action = () => {
            player.send({
            mess: "⏰ Dépêche-toi de jouer !",
            board: this._board
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
            player1: this._player1.getId(),
            player2: this._player2.getId(),
            time1: this._player1.getPlayTime(),
            time2: this._player2.getPlayTime(),
            map: this.serializeBoard(),
            winner: this._winner,
            loser: this._loser
        });
    }
}

export default MorpionRoom;