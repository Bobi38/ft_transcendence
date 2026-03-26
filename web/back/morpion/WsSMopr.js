
import {manager_room} from './src/morpion/ManagRoom.js';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import { WebSocketServer } from 'ws';
import m from './src/morpion/PlayMorpion.js';
import { Bot } from './src/morpion/bot.js';
import { Player } from './src/morpion/player.js';

const secret = fs.readFileSync('/run/secrets/cle_pswd', 'utf-8').trim();

function getCookie(name, cookieHeader) {
  if (!cookieHeader) return null;
  const match = cookieHeader
    .split(';')
    .map(c => c.trim())
    .find(c => c.startsWith(name + '='));
  return match ? decodeURIComponent(match.split('=')[1]) : null;
}

const players = new Map();

export function initWebSMopr(server) {
  const wss = new WebSocketServer({ server, path: '/ws/morp' });

  let idd = 0;
  // console.log('WebSocket server initialized on path /ws');
  wss.on('connection', async (socket, req) => {
    try{

      const iid = idd++;
      socket.id = iid;
      // console.log(req.headers.cookie)
      const token = getCookie('token', req.headers.cookie);
      if (!token) {
        return;
      }
      
      let user = jwt.verify(token, secret);
      
      if (!user) {socket.close(1008, 'Unauthorized'); return;}
      // // console.log("uuu-------", user);
      const useid = user.id;
      socket.userId = useid;
      socket.GoLogout = false;
      socket.cleanedUp = false;
      socket.isAlive = true;
      
      let player = players.get(useid);
      if (!player) {
        // console.log(`new clt`);
        player = await Player.create(socket);
        players.set(useid, player);
        player.list = manager_room.list;
        setTimeout(() => player.send({message: m.msgs.welcome}), 100);
      }

      else{
        // console.log(`deja connu`);
        player.addSocket(socket);
      }
      socket.player = player;

      socket.players = players;

      socket.send(JSON.stringify({type: "auth_good"}));
    }catch(err){
      console.log("err debut wsss ", err);
    }

    socket.sendList = () => {
      players.forEach(p => {p.sendList();});
    }

    socket.on('message', (message) => {
      try{
        console.log(`"socket on dans morpion" ${message}`);

        const data = JSON.parse(message);


        console.log(`${data.type}`);
        switch (data.type) {

          case "updatename":
            m.updateName(socket.player, data.new_name);
            // socket.players.forEach(p => {p.sendList();});
            socket.sendList();
            break;

          case "move":
            if (m.move(socket.player, data.message))
              socket.sendList();
            break;

          case "play":
            if (m.searchGame(socket.player, socket.players)){
              console.log('recu true');
              // if (!socket.players)
              //   console.log('probleme player');
              // console.log('combien de joueur enregistrer', socket.players.size);
              // socket.players.forEach(p => {p.sendList();});
            }
            break ;

          case "bot":
            const bot = Bot.create();
            const players = socket.players;

            players.set(bot.getId(), bot);
            console.log("creation bot", players.size);
            m.searchGame(bot, players);

            setTimeout(() => {
              console.log("clear ", bot);
              players.delete(bot);
            }, 120000);
            break ;

          case "leave":
            if(m.leave(socket.player));
              socket.players.forEach(p => {p.sendList();});
            break;

          case "second":
            console.log();
            m.playSecond(socket.player);
            break ;

          case "reboot":
            // console.log(m.msgs.reboot);
            socket.players.forEach(p => {p.send(m.msgs.reboot);});
            m.reboot();
            socket.players.clear();
            break ;

          case "spec":
            m.observator(socket.player, data.id)
            // socket.player.send({list: manager_room.getList()});
            break ;

          default:
            console.log(`defaut de wsmorp`);
            socket.sendList();
            socket.player.send();
            // console.log(`defaut : ca c est etrange gere ca :${data.type}`);
          }
        }
        catch (err){
          console.log("err morp  ws= " + err);
        }
      });

    socket.on('pong', () =>{
      // console.log("i m in PONG")
      socket.isAlive = true;
    })
    socket.on('error', (err) => {
      // if (err.code === 'WS_ERR_INVALID_CLOSE_CODE' || err.code === 'WS_ERR_INVALID_UTF8') return;
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



// export function initWebSocket(server) {
//   const wss = new WebSocketServer({ server, path: '/ws' });

//   const clients = [];

//   console.log('WebSocket server initialized on path /ws');
  
//   wss.on('connection', (socket, req) => {
//     console.log('Nouvelle connexion WebSocket de', req.socket.remoteAddress);
//     console.log('URL:', req.url);
//     console.log('Headers upgrade:', req.headers.upgrade);
    
//     clients.push(socket);
//     console.log('Nombre de clients connectés :', clients.length);
    
//     // Test: envoie un message de bienvenue
//     socket.send("Connexion établie!");
    
//     socket.on('message', (message) => {
//       console.log('=== MESSAGE REÇU ===');
//       console.log('Type:', typeof message);
//       console.log('Contenu:', message.toString());
//       console.log('===================');
      
//       clients.forEach((client) => {
//         if (client.readyState === ws.OPEN) {
//           client.send("JE SUIS LE SERVER " + message.toString());
//         }
//       });
//     });

//     socket.on('close', () => {
//       console.log('Client déconnecté');
//       const index = clients.indexOf(socket);
//       if (index !== -1) clients.splice(index, 1);
//       console.log('Nombre de clients connectés :', clients.length);
//     });

//     socket.on('error', (error) => {
//       console.error('Erreur WebSocket:', error);
//     });
//   });
  
//   wss.on('error', (error) => {
//     console.error('Erreur WebSocketServer:', error);
//   });
// }



// export function initWebSocket(server) {
//   const wss = new WebSocketServer({ server, path: '/ws' });

//   const chat = new Chat();

//   // server.on('upgrade', (req, socket, head) => {
    
//   // })
//   console.log('WebSocket server initialized');
//   // console.log('WebSocket server initialized');
//   console.log(wss.readyState);
//   wss.on('connection', (socket, req) => {
//     console.log('Nouvelle connexion WebSocket ', req.socket.remoteAddress);
//     const toto = cookie.parse(req.headers.cookie || '');
//     console.log ("f------ ", toto.token);
//     if (chat.finduser(toto.token) === null)
//         chat.addtok(toto.token, socket);
//     console.log("taille === ", chat.countUser());
//     socket.on('message', (message) => {
//       console.log("JE SUIS LA");
//       console.log('Message reçu :', message.toString());
//       for(const session of chat.sessions.values()){
//         const clientSo = session.socket;
//         if (clientSo.readyState === clientSo.OPEN)
//             clientSo.send("REP TO SERV === " , message.toString() );
//       }
//     });

//     // socket.on('close', () => {
//     //   console.log('Client déconnecté');
//     //   const index = clients.indexOf(socket);
//     //   if (index !== -1) clients.splice(index, 1);
//     // });
//     // socket.on('close', () => {
//     //   console.log('Client déconnecté');
//     //   const index = clients.indexOf(socket);
//     //   if (index !== -1) clients.splice(index, 1);
//     // });
//   });
//   }


// export function initWebSocket(server) {
//   const wss = new WebSocketServer({ server, path: '/ws' });

//   console.log(wss.readyState);
//   wss.on('connection', (socket, req) => {
//     console.log("INSIDE");
//     socket.on('message', (message) => {
//       console.log("totototo");
//       const data = JSON.parse(message);
//       console.log("dans server----------------------" , chatt.countUser())
//       console.log('Message reçu :', message.toString());
//       for (const session of chatt.sessions.values()) {
//         const wsClient = session.socket;
//         console.log (session.token === data.message ? 1 : 0);
//         if (wsClient.readyState === wsClient.OPEN) {
//           wsClient.send(message.toString());
//       }
//       }
//     });

//     // socket.on('close', () => {
//     //   console.log('Client déconnecté');
//     //   const index = clients.indexOf(socket);
//     //   if (index !== -1) clients.splice(index, 1);
//     // });
//   });
// }

//socket.io
//express-ws