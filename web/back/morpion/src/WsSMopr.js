import {manager_room} from './morpion/ManagRoom.js';
import m from './morpion/PlayMorpion.js';
import { Bot } from './morpion/bot.js';
import { Player } from './morpion/player.js';
import { createWSServer } from '../common/ws/createWSServer.js';

const players = new Map();

async function setupPlayer(socket, user, players) {
  let player = players.get(user.id);

  if (!player) {
    player = await Player.create(socket);
    players.set(user.id, player);
  } else {
    player.addSocket(socket);
  }

  socket.player = player;
  return player;
}

export function initWebSMopr(server) {
  return createWSServer(server, '/ws/morp', async (socket, req, user) => {
    
    console.log('User connecté:', user.id);

    let player = await setupPlayer(socket, user, players)
    
    if (!player) return ;
    
    socket.players = players;
    
    socket.send(JSON.stringify({type: "auth_good"}));
    
    manager_room.sendList = () => {
       players.forEach(p => {p.sendList();});
    }

    socket.sendList = () => {
      players.forEach(p => {p.sendList();});
    }

    socket.addbot = () => {
      const bot = Bot.create();

      socket.players.set(bot.getId(), bot);
      m.searchGame(bot, socket.players);

      setTimeout(() => {
        console.log("clear ", bot);
        players.delete(bot.getId());
        socket.sendList();
      }, 20 * 60 * 1000);
    }
    

    socket.on('message', (message) => {
      try{
        console.log(`"socket on dans morpion" ${message}`);

        const data = JSON.parse(message);


        console.log(`${data.type}`);
        switch (data.type) {

          case "updateName":
            console.log("in update name");
            m.updateName(socket.player, data.new_name);
            socket.sendList();
            console.log(`update name ${data.new_name}`);
            break;

          case "move":
            if (m.move(socket.player, data.message))
              setTimeout(() => socket.sendList(), 2000);
            break;

          case "play":
            if (m.searchGame(socket.player, socket.players)){
              if (data.message === "bot") socket.addbot();
            }
            break ;

          case "bot":
            socket.addbot()
            break ;

          case "leave":
            m.leave(socket.player);
            socket.sendList();
            break;

          case "second":
            console.log();
            m.playSecond(socket.player);
            break ;

          case "reboot":
            socket.players.forEach(p => {p.send(m.msgs.reboot);});
            m.reboot();
            socket.players.clear();
            break ;

          case "spec":
            m.observator(socket.player, data.id)
            break ;

          default:
            console.log(`defaut de wsmorp`);
            socket.sendList();
            socket.player.sendGame();
          }
        }
        catch (err){
          console.log("err morp  ws= " + err);
        }
      }
    );

    socket.on('pong', () =>{
      socket.player._time_last_active = Date.now();
      socket.isAlive = true;
    })

    socket.on('error', (err) => {
      console.warn('WebSocket Error:', err.message);
    });

    socket.on('close', () => {

      try{
        const player = socket.player;
        console.log("morp deco :", player.getName());;
        socket.isAlive = false;

        if (!player.isInactived()) return;
        
        m.leave(player)
        players.delete(player);
        }
        catch(err){
          console.log("error close in wsMopr ", err);
        }
    });
  });
}
