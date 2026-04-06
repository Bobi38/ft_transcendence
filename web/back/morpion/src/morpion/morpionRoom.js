import Room from './Room.js'
import { Player } from './player.js';
import GameMorp from "../models/GameMorp.js";
import m from './PlayMorpion.js' 

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
    }   

    setFirstPlayer(){
        if (!this.isState("init")) return null;

        this._first_player = !this._first_player;
        return this._first_player;
    }

    isTurnPlayer(player){
        return this._turn === player;
    }

    switchTurn() {
        const [p1, p2] = [...this._players];
        this._turn = this._turn === p1 ? p2 : p1;
    }

    getTurn() {
        return this._turn;
    }

    startGame(player) {
        if (!this._players.has(player)) {
            throw new Error("Invalid player");
        }

        if (this._first_player){
            console.log("je set turn")
            this._turn = player;
        }

        this._chrono = Date.now();
    }

    getboard(){
        return this._board;
    }

    notifyTurn(payloadCurrent = {}, payloadOthers = {}) {
        if (!this._turn) return;
        // console.log(`tu me vois          ttttttt`);
        for (const obs of this._obs) {
            obs.sendObs()
        }
        
        const basePayload = { board: this._board };

        for (const player of this._players) {
            player.send(
                player === this._turn
                    ? { ...basePayload, ...payloadCurrent }
                    : { ...basePayload, ...payloadOthers }
            );
        }
    }

    countMoves() {
        return this._board.reduce((c, v) => v !== " " ? c + 1 : c, 0);
    }

    getCurrentPlayer(current = true) {
        if (current)
            return this._turn;
        
        const other = [...this._players].find(p => p !== this._turn);
        return other;
    }

    getOther(current) {
        return [...this._players].find(p => p !== current);
    }

    isValidPlay(index) {
        return Number.isInteger(index)
            && index >= 0
            && index <= 8
            && this._board[index] === " ";
    }

    play(currentPlayer, index) {
        // console.log(String(currentPlayer));
        if (this._turn !== currentPlayer) {
            // console.log("moi pas voir de probleme")
            return false;
        }

        if (!this.isValidPlay(index)) {
            currentPlayer.send({message: m.msgs.badMove, board: this._board});
            return false;
        }

        currentPlayer.clearTurnTimer();

        const symbol = (this.countMoves() % 2 === 0)? "X" : "O";
        this._board[index] = symbol;

        const now = Date.now();

        if (this._chrono !== null) {
            const timeTour = now - this._chrono;
            currentPlayer.setPlayTime(timeTour);
        }

        this._chrono = now;

        for (const obs of this._obs){
            obs.send({
                players: this._players_names,
                other_board: this._board})
        }
        
        return true;
    }

    handleEndGame(ending, winnerId = null){
        this.clearOutTimer();

        this._ending = ending;
        if (ending === 'abort')
            this._how_win = 'abort';
        else if (ending === 'draw')
            this._how_win = 'draw';

        this.majdb(winnerId).catch(err =>
            console.error("Erreur sauvegarde DB:", err)
        );
    }

    checkVictory() {
        console.log(`start chekc victory`);
        let i = 0;
        for (let [a, b, c] of this._lines) {
            let char = this._board[a];
            if (
                char !== " " &&
                char === this._board[b] &&
                char === this._board[c]
            ) {

                this.notifyTurn(
                    { message: m.msgs.w_msg, board: this._board, turn: false },
                    { message: m.msgs.l_msg, board: this._board, turn: false });
                    
                console.log(`victoire avec ligne ${i}`);
                this._how_win = ["horizontal","vertical","diagonal_lr"][Math.floor (i / 3)];
                if (i === 7)
                    this._how_win = "diagonal_rl";
                this.handleEndGame("win", this._turn);
                // this._turn = null;
                // console.log(`avant envoie TRUE`);
                return true;
            }
            i++
        }

        if (!this._board.includes(" ")) {
            console.log(`draw : ${this}`);
            this.sendAll({message: m.msgs.draw, board: this._board, turn: false} );
            this.handleEndGame("draw");
            return true;
        }

        return false;
    }

    startTurnTimer() {
        const p = this._turn;

        if (!p) return ;
        const action = () => {
            p.send({
            message: "Dépêche-toi de jouer !",
            board: this._board
            })
        };
        console.log(`mess16`);

        p.startTurnTimer(action, 5000);
    }

    serializeBoard() {
        return this._board
        .map(cell => cell === " " ? "-" : cell)
        .join("");
    }

    async majdb (winner = null) {

        // console.log(`save DB`);
        for (const p of this._players){

            if (!(p instanceof Player)){
                console.log(`don t save with Bot`);
                for (const pl of this._players)
                    pl.disconnect(null, this._id);
                return; 
            }
        }
 
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
            // date_game: this._date_Game, ?? undefine
            // ending: this._ending, //inutile

            player_1, 
            player_2,

            time_player_1,
            time_player_2,

            nb_turn_player_1,
            nb_turn_player_2,

            map: this.serializeBoard(),
            winner: winner.getId(),
            loser
        });

        if (!winner) {                  // draw
            p1.majdb(this._id, this._how_win, 'X');
            p2.majdb(this._id, this._how_win, 'O');
        } else if (winner === p1) {     // player1 winner /  winner abort
            p1.majdb(this._id, this._how_win, 'X', 'winner');
            p2.majdb(this._id, this._how_win, 'O', 'loser');
        } else {                        // player2 winner /  winner abort
            p1.majdb(this._id, this._how_win, 'X', 'loser');
            p2.majdb(this._id, this._how_win, 'O', 'winner');
        }
    }
}


export default MorpionRoom;