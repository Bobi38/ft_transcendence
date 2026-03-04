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
        if (this._locked) return false;

        this._first_player = true;
        return true;
    }

    isTurnPlayer(PlayerId){
        return _turn === PlayerId;
    }

    switchTurn() {
        const [p1, p2] = [...this._players.keys()];
        this._turn = this._turn === p1 ? p2 : p1;
    }

    getTurn() {
        return this._turn;
    }

    startGame(firstPlayerId) {
        if (!this._players.has(firstPlayerId)) {
            throw new Error("Invalid player");
        }

        if (this._first_player)
            this._turn = firstPlayerId;

        this._chrono = Date.now();
    }

    getboard(){
        return this._board;
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

    // selectPlayer1(id) {
    //     const players = [...this._players.keys()];
    //     if (!players.includes(id)) {
    //         throw new Error("Le joueur n'est pas dans la room");
    //     }

    //     if (players.length !== this._max_players) {
    //         throw new Error("Il faut exactement 2 joueurs pour sélectionner player1");
    //     }
        
    //     this.player1 = this._players.get(id);
    //     this.player2 = this._players.get(
    //         [...this._players.keys()].find(p => p !== id));

    //     if (!this._first_player)
    //         [this.player1, this.player2] = [this.player2, this.player1];

    //     this._chrono = Date.now();
    // }

    countMoves() {
        return this._board.reduce((c, v) => v !== " " ? c + 1 : c, 0);
    }

    getCurrentPlayer(current = true) {
        if (current)
            return this._players.get(this._turn);
        
        const otherId = [...this._players.keys()].find(id => id !== this._turn);
        return this._players.get(otherId);
    }

    getOtheriD(currentId) {
        return [...this._players.keys()].find(id => id !== currentId);
    }

    isValidPlay(index) {
        return Number.isInteger(index)
            && index >= 0
            && index <= 8
            && this._board[index] === " ";
    }

    play(currentPlayer, index) {
        console.log(String(currentPlayer));
        if (this._turn !== currentPlayer) {
            this.getPlayer(currentPlayer).send("Ce n'est pas ton tour", this._board);
            return false;
        }

        const player = this.getCurrentPlayer();

        if (!this.isValidPlay(index)) {
            player.send("Coup invalide", this._board);
            return false;
        }

        console.log("on arrive ici tout va bien")
        player.clearTurnTimer();

        const symbol = (this.countMoves() % 2 === 0)? "X" : "O";
        this._board[index] = symbol;

        const now = Date.now();

        if (this._chrono !== null) {
            const timeTour = now - this._chrono;
            player.setPlayTime(timeTour);
        }

        this._chrono = now;

        return true;
    }

    handleEndGame(ending, winnerId = null){
        this.clearOutTimer();

        this._ending = ending;

        this.majdb(winnerId).catch(err =>
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
                this.notifyTurn(
                    { message: "gagne", turn: false },
                    { message: "perdu", turn: false });

                this._how_win = "HVD"[Math.floor (i / 3)];
                this.handleEndGame("win", this._turn);
                return true;
            }
            i++
        }

        if (!this._board.includes(" ")) {
            this.sendAll({message: "egalite"}, this._board);
            this.handleEndGame("draw");
            return true;
        }

        return false;
    }

    startTurnTimer() {
        const currentPlayer = this.getCurrentPlayer();
        const action = () => {
            currentPlayer.send({
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

    async majdb (winner = null) {

        const isEven = this.countMoves() % 2 === 0;

        const p1 = isEven
            ? this.getCurrentPlayer()
            : this.getCurrentPlayer(false);

        const p2 = isEven
            ? this.getCurrentPlayer(false)
            : this.getCurrentPlayer();

        const { id: player_1, time: time_player_1, nb_turn: nb_turn_player_1 } = p1.getData();
        const { id: player_2, time: time_player_2, nb_turn: nb_turn_player_2 } = p2.getData();
        
        const loser = winner
                ? (winner === player_1 ? player_2 : player_1)
                : null;
        
        await GameMorp.create({
            how_win: this._how_win,
            date_game: this._date_Game,
            ending: this._ending,

            player_1, 
            player_2,

            time_player_1,
            time_player_2,

            nb_turn_player_1,
            nb_turn_player_2,

            map: this.serializeBoard(),
            winner,
            loser
        });
    }
}


export default MorpionRoom;