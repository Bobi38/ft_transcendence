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
    reboot: "Server has rebooted", // tres utile !!
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

function searchGame(player, players){

    let game = player.getGame();
    if (game?.isState("play")){
        player.send(`you play ${game.getId()}`);
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

    // players.forEach(p => {p.sendList();});
    game.notifyTurn(
        {message: msgs.my_turn, turn: true},
        {message: msgs.other_turn, turn: false}
    )

    return false;
}

function reboot(){
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

const cooldowns = new Map();

// function morpion(message, socket){
//     const id = socket.userId;

//     if (cooldowns.has(id)) return;

//     cooldowns.set(id, true);
//     setTimeout(() => cooldowns.delete(id), 200);

//     // console.log(`connecte dans play Morpion ${message} de ${id}`)

//     let game = manager_room.isInRoom(id);

//     if (message === "reboot") {
//         manager_room.removeAll("le serveur a reboot");
//         return;
//     }

//     if (message === "je veux jouer") {
//         console.log("nouvelle demande");
//         if (game){
//             console.log("a deja une partie");
//             socket.send(JSON.stringify({type: "game", message: `ca peut etre tres long :${game}}`}))
//             return ;
//         }

//         game = manager_room.findOnePlace(socket, "Morpion", id);
//         // manager_room.lobby.removePlayer(id);
//         socket.send(JSON.stringify({type: "game", message: game.getId()}))
//         try{
//             game.setLock(true);
//             game.startGame(id);

//             game.notifyTurn(
//                 { message: "À toi de jouer", turn: true },
//                 { message: "Tour adverse", turn: false });
//         }
//         catch (err) {
//             console.log("premier set _Turn");
//             game._turn = id;
//             socket.send(JSON.stringify({type: "game", message: "recherche"}))
//         }
//         return;
//     }

//     if (!game) return ;

//     if (message === "leave") {

//         if (!game.getLock()) {
//             manager_room.removePlayer(id, "bye bye");
//             return;
//         }

//         if (id === game.getTurn())
//             game.switchTurn;
//         game.handleEndGame('abort', game.getTurn());
//         game.notifyTurn(
//             { message: "Abondon - tu as gagne", turn: false },
//             { message: "Abondon - tu as perdu", turn: false });
//         manager_room.removeRoom(game.getId());
//         return ;
//     }

//     if (message === "playSecond") {

//         if (game.setFirstPlayer())
//             socket.send(JSON.stringify({ type: "game", message: `${game} : tu joues en second` }))
//         return;
//     }

//     if (!game.getLock()) return;

//     if (!game.isTurnPlayer(id)) return;

//     console.log(`je suis dans ${game}`);
//     if (game.play(id, message)) {
//         if(game.checkVictory()){
//             console.log(`fin de la partie de ${game}`);
//             manager_room.removeRoom(game.getId());
//             return ;
//         }
//         game.switchTurn();
//         console.log(` joueur ${id} a jouer sur la case ${message}`)
//         game.notifyTurn(
//             { message: "À toi de jouer", turn: true },
//             { message: "Tour adverse", turn: false });
//         game.startTurnTimer();
//         console.log(`le changement`);
//     }

// }

export default {reboot, playSecond, leave, msgs, searchGame, move, observator, updateName}