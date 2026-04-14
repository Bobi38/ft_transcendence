
import bcrypt from 'bcrypt';
import { encrypt } from './routes/crypt.js';

import sequelize from './models/index.js';
//model
import User from './models/user.js';
import Friend from './models/friend.js';
import PrivChat from './models/privchat.js';
import PrivMess from './models/privmess.js';
import chatG from './models/chatG.js';
import GameMorp from './models/GameMorp.js';
import StatMorp from './models/StatMorp.js';
import Connect from './models/connect.js';

import GamePong3D from './models/GamePong3D.js';
import StatPong3D from './models/StatPong3D.js';
import PswEmail from './models/PssWrdEmail.js';

// // creatdb
// import { CreatGameMorp } from './seedmorp.js';

async function createGameMorp() {

    const games = [];
    const stats = {};

    const HOW_WIN = ["horizontal", "vertical", "diagonal_lr", "diagonal_rl", "abort", "draw"];

    // init stats
    for (let i = 1; i <= 5; i++) {
        stats[i] = {
            total_game: 0,
            time_played: 0,
            nb_turn_played: 0,

            type_X_horizontal_winner: 0,
            type_X_horizontal_loser: 0,
            type_X_vertical_winner: 0,
            type_X_vertical_loser: 0,
            type_X_diagonal_winner: 0,
            type_X_diagonal_loser: 0,
            type_X_abort_winner: 0,
            type_X_abort_loser: 0,
            type_X_draw: 0,

            type_O_horizontal_winner: 0,
            type_O_horizontal_loser: 0,
            type_O_vertical_winner: 0,
            type_O_vertical_loser: 0,
            type_O_diagonal_winner: 0,
            type_O_diagonal_loser: 0,
            type_O_abort_winner: 0,
            type_O_abort_loser: 0,
            type_O_draw: 0,
        };
    }

    for (let i = 0; i < 20; i++) {

        let p1 = Math.floor(Math.random() * 5) + 1;
        let p2;

        do {
            p2 = Math.floor(Math.random() * 5) + 1;
        } while (p2 === p1);

        const how_win = HOW_WIN[Math.floor(Math.random() * HOW_WIN.length)];

        const isDraw = how_win === "draw";
        const isAbort = how_win === "abort";

        let winner = null;
        let loser = null;

        if (!isDraw) {
            const p1Wins = Math.random() < 0.5;
            winner = p1Wins ? p1 : p2;
            loser = p1Wins ? p2 : p1;
        }

        const winnerType = winner === p1 ? "X" : "O";
        const loserType = loser === p1 ? "X" : "O";

        const turns1 = Math.floor(Math.random() * 5) + 3;
        const turns2 = Math.floor(Math.random() * 5) + 3;

        const time1 = Math.floor(Math.random() * 30) + 5;
        const time2 = Math.floor(Math.random() * 30) + 5;

        // stats de base
        stats[p1].total_game++;
        stats[p2].total_game++;

        stats[p1].time_played += time1;
        stats[p2].time_played += time2;

        stats[p1].nb_turn_played += turns1;
        stats[p2].nb_turn_played += turns2;

        const typeKey = how_win.startsWith("diagonal") ? "diagonal" : how_win;

        if (isDraw) {
            stats[p1].type_X_draw++;
            stats[p2].type_O_draw++;
        } else if (isAbort) {
            stats[winner][`type_${winnerType}_abort_winner`]++;
            stats[loser][`type_${loserType}_abort_loser`]++;
        } else {
            stats[winner][`type_${winnerType}_${typeKey}_winner`]++;
            stats[loser][`type_${loserType}_${typeKey}_loser`]++;
        }

        games.push({
            how_win,
            date_game: new Date(),
            player_1: p1,
            player_2: p2,
            winner,
            loser,
            time_player_1: time1,
            time_player_2: time2,
            nb_turn_player_1: turns1,
            nb_turn_player_2: turns2,
            map: "random_map"
        });
    }

    try {
        // 1. insert games
        await GameMorp.bulkCreate(games);

        // 2. increment stats (clé par clé)
        for (const userId in stats) {
            await StatMorp.increment(stats[userId], {
                where: { idUser: userId }
            });
        }

        console.log("✅ Games + stats incrémentées !");
    } catch (err) {
        console.error("❌ Erreur :", err);
    }
}

async function createGamePong() {

    const games = [];
    const stats = {};

    // init stats (SANS idUser ici, juste les increments)
    for (let i = 1; i <= 5; i++) {
        stats[i] = {
            total_game: 0,
            time_played: 0,
            win: 0,
            lose: 0,
            abortwinner: 0,
            abortloser: 0
        };
    }

    for (let i = 0; i < 20; i++) {

        let player1 = Math.floor(Math.random() * 5) + 1;
        let player2;

        do {
            player2 = Math.floor(Math.random() * 5) + 1;
        } while (player2 === player1);

        const isAbort = Math.random() < 0.2; // 20% abandon

        let score1 = 0;
        let score2 = 0;
        let winner = null;
        let loser = null;

        if (!isAbort) {
            const player1Wins = Math.random() < 0.5;

            score1 = player1Wins ? 3 : Math.floor(Math.random() * 3);
            score2 = player1Wins ? Math.floor(Math.random() * 3) : 3;

            winner = player1Wins ? player1 : player2;
            loser = player1Wins ? player2 : player1;
        } else {
            // abandon
            const player1Wins = Math.random() < 0.5;
            winner = player1Wins ? player1 : player2;
            loser = player1Wins ? player2 : player1;

            stats[winner].abortwinner++;
            stats[loser].abortloser++;
        }

        const startDate = new Date();
        startDate.setMinutes(startDate.getMinutes() - Math.floor(Math.random() * 120));

        const duration = Math.floor(Math.random() * 600) + 60;
        const endDate = new Date(startDate.getTime() + duration * 1000);

        // stats communes
        stats[player1].total_game++;
        stats[player2].total_game++;

        stats[player1].time_played += duration;
        stats[player2].time_played += duration;

        // win / lose seulement si pas abort
        if (!isAbort) {
            stats[winner].win++;
            stats[loser].lose++;
        }

        games.push({
            id_player_1: player1,
            score_1: score1,
            id_player_2: player2,
            score_2: score2,
            winner,
            loser,
            abortwinner: isAbort ? winner : null,
            abortloser: isAbort ? loser : null,
            date_game_start: startDate,
            date_game_end: endDate,
            time: duration
        });
    }

    try {
        // 1. insert games
        await GamePong3D.bulkCreate(games);

        // 2. increment stats existantes
        for (const userId in stats) {
            await StatPong3D.increment(stats[userId], {
                where: { idUser: userId }
            });
        }

        console.log("✅ Pong games + stats incrémentées !");
    } catch (error) {
        console.error("❌ Erreur :", error);
    }
}

async function CreatUser() {

    const CrypPass = await bcrypt.hash('tt', 10);
    const toto = await User.create({name: 'tr1', password: CrypPass, mail: 'tr1@yopmail.com', co: false, MPFA: false});
    const titi = await User.create({name: 'tr2', password: CrypPass, mail: 'tr2@yopmail.com', co: false, MPFA: false});
    const tata = await User.create({name: 'tr3', password: CrypPass, mail: 'tr3@yopmail.com', co: false, MPFA: false});
    const tutu = await User.create({name: 'tr4', password: CrypPass, mail: 'tr4@yopmail.com', co: false});
    const ni = await User.create({name: 'tr5', password: CrypPass, mail: 'tr5@yopmail.com', co: false});
    const no = await User.create({name: 'tr6', password: CrypPass, mail: 'tr6@yopmail.com', co: false});
    const na = await User.create({name: 'tr7', password: CrypPass, mail: 'tr7@yopmail.com', co: false});
}

async function fullmess(mess, Conv){
    for (let i = 0; i < 5; i++){
        const con = encrypt(mess + i);
        if (i % 2 == 0)
            await PrivMess.create({ChatId: Conv.id, SenderId: Conv.id1, contenu: con, time: new Date()})
        else
            await PrivMess.create({ChatId: Conv.id, SenderId: Conv.id2, contenu: con, time: new Date()})
        Conv.lastmess = new Date();
        await Conv.save();
    }
}

async function CreatPrivMess(){
    const toto = await User.findOne({where :{name: 'tr1'}})
    const tata = await User.findOne({where :{name: 'tr3'}})
    const titi = await User.findOne({where :{name: 'tr2'}})
    const Conv1 = await PrivChat.create({id1: toto.id, id2:tata.id});
    const Conv2 = await PrivChat.create({id1: titi.id, id2:tata.id});
    const Conv3 = await PrivChat.create({id1: toto.id, id2:titi.id});

    await fullmess("message numero ", Conv1);
    await fullmess("mess number ", Conv2);
    await fullmess("El ultimo numero ", Conv3);
}

async function CreatFriend(){
  await Friend.create({Friend1: 1, Friend2: 2, State: true, WhoAsk: 1});
  await Friend.create({Friend1: 1, Friend2: 3, State: false, WhoAsk: 1});
  await Friend.create({Friend1: 4, Friend2: 1, State: false, WhoAsk: 4});
  await Friend.create({Friend1: 5, Friend2: 1, State: true, WhoAsk: 5});
}




async function addDb(){
  const count = await User.count();
    if (count === 0){
      await CreatUser();
      console.log("User created");
      await CreatPrivMess();
      console.log("PrivMess created");
      await CreatFriend();
      console.log("Friend created");
      await createGamePong();
      console.log("game Pong good")
      await createGameMorp();
      console.log("game morp good")
    }
    
}

export {addDb};