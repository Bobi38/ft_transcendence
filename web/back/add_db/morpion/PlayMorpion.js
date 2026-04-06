import { log } from 'console';
import { manager_room } from './ManagRoom.js';

const msgs = {
    welcome: "Welcome to Morpion!",
    recherche: "Searching for a game...",
    wait: "It's not your turn",
    my_turn: "It's your turn",
    other_turn : "Waiting for opponent",
    w_abort: "Other player aborted - you win",
    l_abort: "You aborted the game - you lose",
    w_msg: "Congratulations, you won!",
    l_msg: "You'll beat them next time! You lost",
    draw: "It's a draw!",
    second: "You are playing second",
    first: "You are playing first",
    reboot: "Server has rebooted", // tres utile !!
    badMove: "Move alert",
}

function move(player, move){
    console.log(`new move ${move}`);

    const game = player.getGame();

    if (!game) {
        //voir pour indique la 
        return ;
    }
    // console.log("mess1");
    if (!game.isTurnPlayer(player)){
        player.send({message: msgs.wait, turn: false});
        return ;
    }
    // console.log("mess2");
    if (game.play(player, move)) {
        // console.log("mess3");
        if(game.checkVictory()){
            console.log(`end of ${game}`);
            setTimeout(() => {
                 console.log(`party register ${game}`);
                 manager_room.removeRoom(game);
            }, 10000);
            return ;
        }
        game.switchTurn();
        console.log(` joueur ${player.getId()} a jouer sur la case ${move}`)
        // console.log("mess4");
        game.notifyTurn(
            {message: msgs.my_turn, turn: true},
            {message: msgs.other_turn, turn: false}
        )
        // console.log("mess5");
        game.startTurnTimer();
        // console.log("mess6");
    }
}

function searchGame(player){
    console.log(`new search game de ${player}`);
    let game = player.getGame();
    if (game){
        player.send(`You are playing game ${game.getId()}`);
        return ;
    }

    game = manager_room.findOnePlace("Morpion", player);
    player.send(`New game : you are playing game ${game.getId()}`);
    try{
        game.setLock(true);
        game.startGame(player);

        game.notifyTurn(
            {message: msgs.my_turn, turn: true},
            {message: msgs.other_turn, turn: false}
        )
    }
    catch {
            console.log("premier set _Turn");
            game._turn = player;
            player.send({message: msgs.recherche, turn: false})
    }
}

function reboot(){ // non utilise
    console.log(msgs.reboot);
    manager_room.removeAll(msgs.reboot);
    return;
}

function playSecond(player){
    console.log(`call play second`);
    const game = player.getGame();
    if (!game) return;

    if (!game.setFirstPlayer())
        player.send(`${game} : ${msgs.first}`);
    else
        player.send(`${game} : ${msgs.second}`);
}

function leave(player){
    console.log(`${player} ask to leave`);
    const game = player.getGame();

    if (!game) return;

    if (!game.getLock()) {
        manager_room.removeRoom(game);
        return;
    }
    const loser = player;
    let winner = game.getTurn();
    if (winner === loser){
        winner = game.getOther();
    }

    game.handleEndGame('abort', game.getTurn());
    winner.send({ message: "end", turn: false });
    loser.send({ message: "end", turn: false });
    winner.disconnect(msgs.w_abort);
    loser.disconnect(msgs.l_abort);

    setTimeout(() => {manager_room.removeRoom(game);}, 10000);
}

export default {morpion, reboot, playSecond, leave, msgs, searchGame, move}