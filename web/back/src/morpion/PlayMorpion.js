import { manager_room } from './ManagRoom.js';

const msgs = {
    welcome: "welcome",
    recherche: "search",
    wait: "wait wait",
    my_turn: "it s your turn",
    other_turn : "wait opposant",
    w_abort: "Abort - you win",
    l_abort: "Abort - you lose",
    w_msg: "you win",
    l_msg: "you lose",
    draw: "draw",
    second: "second player selected",
    first: "first player seleted",
    reboot: "server rebooted", // tres utile !!
    badMove: "Move alert",
}

function observator(player, gameId){
    
    console.log(`obs ${gameId}`);
    if (gameId === 1){
        const other_board = [" ", " ", " ", "X", " ", " ", "0", " ", " "];
        const players = {player_1: "martin", player_2:"jackiechan"};
        player.send({
            players,
            other_board,
        });
        return ; 
    }

    const game = manager_room.getRoom(gameId);

    if (!game){
        const list = manager_room.list;
        player.send({message: "unknow Game", list});
        return ;
    }

    game.addObs(player);
    player.sendObs();
}

function move(player, move){
    console.log(`${player.getName()}new move ${move}`);

    const game = player.getGame();

    if (!game) {
        return false;
    }
    // console.log("mess1");
    if (!game.isTurnPlayer(player)){
        player.send({message: msgs.wait, turn: false});
        return false;
    }
    // console.log("mess2");
    if (game.play(player, move)) {
        // game.notifyObs();
        console.log("mess3");
        if(game.checkVictory()){
            console.log("fini on unlocked la game");
            game.setLock(false);
            manager_room.refreshList();

            setTimeout(() => {
                //  console.log(`party register ${game}`);
                 manager_room.removeRoom(game);
            }, 10000);
            return true;
        }
        game.switchTurn();
        console.log(` joueur ${player.getId()} a jouer sur la case ${move}`)
        console.log("mess4");
        game.notifyTurn(
            {message: msgs.my_turn, turn: true},
            {message: msgs.other_turn, turn: false}
        )
        console.log("mess5");
        game.startTurnTimer();
        console.log("mess6");
        return false;
    }
}

function searchGame(player, players){
    console.log("ENTRY searchGame");

    let game = player.getGame();
    if (game){
        player.send(`you play ${game.getId()}`);
        return false;
    }
    console.log("game existant ?", game);

    game = manager_room.findOnePlace("Morpion", player);
    player.send(`new game :  you play ${game.getId()}`);
    try{
        game.setLock(true);
        console.log(` step 111111 la partie a deux joueurs`);
        game.startGame(player);
        console.log(` step 222222 le jeu peut commencer`);

        manager_room.refreshList();

        console.log('combien de joueur enregistrer', players.size);
        players.forEach(p => {p.sendList();});

        game.notifyTurn(
            {message: msgs.my_turn, turn: true},
            {message: msgs.other_turn, turn: false}
        )

        console.log("step 33333333   liste rafraichi");
        console.log("AVANT RETURN TRUE");
        return true;

    }
    catch {
        // console.log(ERREUR DANS searchGame :", e);
        console.log("premier set _Turn");
        game._turn = player;
        player.send({message: msgs.recherche, turn: false})
        return false;
    }
    return true;
}

function reboot(){
    console.log(msgs.reboot);
    manager_room.removeAll(msgs.reboot);
    manager_room.refreshList();
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

    if (!game) return false;

    if (!game.getLock()) {
        manager_room.removeRoom(game);
        return false;
    }
    const loser = player;
    let winner = game.getTurn();
    if (winner === loser){
        winner = game.getOther();
    }

    game.handleEndGame('abort', game.getTurn());
    winner.send({ message: msgs.w_abort, turn: false }); // message: "end"
    loser.send({ message: msgs.l_abort, turn: false });
    // winner.disconnect();
    // loser.disconnect();

    setTimeout(() => {manager_room.removeRoom(game);}, 10000);

    console.log("avant unlock");
    game.setLock(false);
    manager_room.dltRoomInlist(game);

    return true;
}

function updateName(player, nickname) {
    player._nick_name = nickname;

    manager_room.refreshList();
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