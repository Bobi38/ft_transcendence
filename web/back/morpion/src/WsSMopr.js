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
        players.delete(bot.getId());
        socket.sendList();
      }, 20 * 60 * 1000);
    }

    manager_room.sendList = () => {
       players.forEach(p => {p.sendList();});
    }
    

    socket.on('message', (message) => {
      try{

        const player = socket.player;

        player.IAmActif();
        const data = JSON.parse(message);

        switch (data.type) {

          case "updateName":
            m.updateName(socket.player, data.new_name);
            socket.sendList();
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
        socket.isAlive = false;

        setTimeout(() => {
          if (!player.isInactived()) return;
          m.leave(player)
          players.delete(player);}, 20 * 1010);
        }
        catch(err){
          console.log("error close in wsMopr ", err);
        }
    });
  });
}
