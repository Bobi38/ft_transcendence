import Room from './Room.js'
import GameMorp from "../models/GameMorp.js";

class MorpionRoom extends Room {
    constructor (id) {
        super(id);
        this._type = "Morpion";
        this._max_players = 2;
        this._min_players = 2;
        this._first_player = false;
        this._turn = null;
        this._how_win = null;
        this._ending = null;
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
        this.player1 = null;
        this.player2 = null;
    }   

    setFirstPlayer(){
        if (this._locked) return;

        this._first_player = true;
    }

    switchTurn() {
        const [p1, p2] = [...this._players.keys()];
        this._turn = this._turn === p1 ? p2 : p1;
    }

    startGame(firstPlayerId) {
        if (!this._players.has(firstPlayerId)) {
            throw new Error("Invalid player");
        }

        if (this._first_player)
            this._turn = firstPlayerId;

        this._chrono = Date.now();
    }

    notifyTurn(payloadCurrent = {}, payloadOthers = {}) {
        if (!this._turn) return;

        for (const [id, player] of this._players.entries()) {
            const basePayload = {
                board: this._board
            };

            player.send(
                id === this._turn
                    ? { ...basePayload, ...payloadCurrent }
                    : { ...basePayload, ...payloadOthers }
            );
        }
    }
// utilisation :
// this.notifyTurn(
//     { message: "À toi de jouer", turn: true },
//     { message: "Tour adverse", turn: false }
// );

    selectPlayer1(id) {
        const players = [...this._players.keys()];
        if (!players.includes(id)) {
            throw new Error("Le joueur n'est pas dans la room");
        }

        if (players.length !== this._max_players) {
            throw new Error("Il faut exactement 2 joueurs pour sélectionner player1");
        }
        
        this.player1 = this._players.get(id);
        this.player2 = this._players.get(
            [...this._players.keys()].find(p => p !== id));

        if (!this._first_player)
            [this.player1, this.player2] = [this.player2, this.player1];

        this._chrono = Date.now();
    }

    countMoves() {
        return this._board.reduce((c, v) => v !== " " ? c + 1 : c, 0);
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
            && this._board[index] === " ";
    }

    play(currentPlayer, index) {
        console.log(String(currentPlayer));
        if (currentPlayer !== this.getCurrentPlayer()) {
            this.getPlayer(currentPlayer).send("Ce n'est pas ton tour", this._board);
            return false;
        }

        if (!this.isValidPlay(index)) {
            this.getPlayer(currentPlayer).send("Coup invalide", this._board);
            return false;
        }

        currentPlayer.clearTurnTimer();

        const symbol = currentPlayer === this.player1 ? "X" : "O";
        this._board[index] = symbol;

        const now = Date.now();

        if (this._chrono !== null) {
            const timeTour = now - this._chrono;
            this.getPlayer(currentPlayer).setPlayTime(timeTour);
        }

        this._chrono = now;

        return true;
    }

    handleEndGame(ending){
        this.clearTimer();

        this._ending = ending;

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
                this._winner = char === "X" ? this.player1 : this.player2;
                this._loser = char === "X" ? this.player2 : this.player1;
                this._winner.send({message: "tu as gagne"}, this._board);
                this._loser.send({message: "perdu"}, this._board);
                this._how_win = "HVD"[Math.floor (i / 3)];
                this.handleEndGame("W");
                return true;
            }
            i++
        }

        if (!this._board.includes(" ")) {
            this.sendAll({message: "egalite"}, this._board);
            this.handleEndGame("E");
            return true;
        }

        this.startTurnTimer(this.getCurrentPlayer());

        return false;
    }

    startTurnTimer(player) {
        const action = () => {
            player.send({
            message: "⏰ Dépêche-toi de jouer !",
            board: this._board
            })
        };

        player.startTurnTimer(action, 8000);
    }

    serializeBoard() {
        return this._board
        .map(cell => cell === " " ? "-" : cell)
        .join("");
    }

    async majdb () {
        await GameMorp.create({
            howWin: this._how_win,
            dateGame: this._date_Game,
            Ending: this._ending,
            player1: this.player1.getId(),
            player2: this.player2.getId(),
            time1: this.player1.getPlayTime(),
            time2: this.player2.getPlayTime(),
            map: this.serializeBoard(),
            winner: this._winner,
            loser: this._loser
        });
    }
}

export default MorpionRoom;