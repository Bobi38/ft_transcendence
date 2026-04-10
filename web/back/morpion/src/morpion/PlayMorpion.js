import { manager_room as managerRoom } from './ManagRoom.js';

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
    reboot: "Server has rebooted",
    badMove: "Move alert",
}

function observator(player, gameId){

    const game = managerRoom.getRoom(gameId);

    if (!game){
        const list = managerRoom.list;
        player.send({message: "unknow Game", list});
        return ;
    }

    game.addObs(player);
    player.sendObs();
}

function move(player, move){

    const game = player.getGame();

    if (!game) return false;

    if (game.isState("end")){
        p.sendList();
        player.disconnect("game over", game.getId())
        return false;
    }

    if (!game.isTurnPlayer(player) || game.isState("init")){
        const adverse = game.getOther(player)

        if (!adverse.isInactived()){
            leave(adverse);
        }
        else{
            player.send({message: msgs.wait, turn: false});
        }
        return false;
    }

    if (game.play(player, move)) {
        if(game.checkVictory()){
            game.setEnd();
            managerRoom.refreshList();

            setTimeout(() => {
                 managerRoom.removeRoom(game);
            }, 10000);
            return true;
        }

        game.switchTurn();
        if (game.isState("play"))
            game.notifyTurn(
                {message: msgs.my_turn, turn: true},
                {message: msgs.other_turn, turn: false}
            )
        if (game.isState("end")) {
            return true;
        }
        game.startTurnTimer();
        return false;
    }
}

function searchGame(player){

    let game = player.getGame();
    if (game?.isState("play")){
        player.sendMessage();
        return false;
    }

    game = managerRoom.findOnePlace("Morpion", player);

    if (!game.setLock()) {
        game._turn = player;
        player.send({message: msgs.recherche, turn: false})
        return true;
    }

    game.startGame(player);

    managerRoom.refreshList();

    game.notifyTurn(
        {message: msgs.my_turn, turn: true},
        {message: msgs.other_turn, turn: false}
    )

    return false;
}

function reboot(){

    if (process.env.STATUS !== "DEV") return;

    managerRoom.removeAll(msgs.reboot);
    managerRoom.refreshList();

    return;
}

function playSecond(player){
    const game = player.getGame();
    if (!game) return;

    if (!game.setFirstPlayer())
        player.send(`${game} : ${msgs.first}`);
    else
        player.send(`${game} : ${msgs.second}`);
}

function leave(player){

    const game = player.getGame();

    if (!game) return false;

    if (game.isState("init")) {
        managerRoom.removeRoom(game);
        return false;
    }

    managerRoom.abortedRoom(player);
}

function updateName(player, nickname) {
    player._nickName = nickname;

    managerRoom.refreshList();
}

export default {reboot, playSecond, leave, msgs, searchGame, move, observator, updateName}