import ws from 'ws';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import { WebSocketServer } from 'ws';
import {manager_room} from './morpion/ManagRoom.js';
import m from './morpion/PlayMorpion.js';
import { Player } from './morpion/player.js';

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
  console.log('WebSocket server initialized on path /ws');
  wss.on('connection', async (socket, req) => {
    try{
      //passe toujours par ici
      console.log(`pour comprendre what is conenction ?`);
      const iid = idd++;
      socket.id = iid;
      console.log(req.headers.cookie)
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
        console.log(`new clt`);
        player = new Player(socket)
        players.set(useid, player);
      }
      else{
        console.log(`deja connu`);
        player.addSocket(socket);
      }
      socket.player = player;
      socket.players = players;

      socket.send(JSON.stringify({type: "auth_good"}));
    }catch(err){
      console.log("err debut wsss ", err);
    }

    socket.on('message', (message) => {
      try{
        console.log(`"socket on dans morpion" ${message}`);

        const data = JSON.parse(message);
        console.log(`${data.type}`);
        switch (data.type) {
          case "game": //move
            m.morpion(data.message, socket, socket.userId);
            break ;

          case "move":
            m.move(socket.player, data.message);
            break ;

          case "play":
            m.searchGame(socket.player);
            break ;

          case "leave":
            m.leave(socket.player);
            break ;

          case "second":
            m.playSecond(socket.player); //ok a tster
            break ;

          case "reboot":
            console.log(m.msgs.reboot);
            socket.players.forEach(p => {p.send(m.msgs.reboot);});
            m.reboot();
            socket.players.clear();
            break ;

          case "obs":
            socket.player.send({list: manager_room.getList()});
            break ;

          case "obs":


          default:
            socket.player.send();
            console.log(`defaut : ca c est etrange gere ca :${data.type}`);
          }
        }
        catch (err){
          console.log("err morp  ws= " + err);
        }
      });


      //   if (data.type === "logout")
      //     socket.GoLogout = true;

      //   if (data.type === 'game') {
      //     console.log(`game : recu ${data.message}`);
      //     morpion(data.message, socket, socket.userId);
      //     return ;
      //   }

      //   if (data.type === 'morpion'){
      //     console.log("probleme num1 si tu me vois, personne ne doit connaitre ce type");
      //     let message = "";
      //     console.log("je suis dans un type waitRoom");
      //     console.log("user id dans wait room " + socket.userId);
      //     let room = manager_room.isInRoom(socket.userId);
      //     if (!room)
      //       room = manager_room.findOnePlace(socket, socket.userId);
      //     if (room.isFull()){
      //       message = "yes";
      //     }
      //     else
      //       message = "wait";
      //     console.log("popopopo");
      //     console.log("room =", room);
      //     console.log("playersid size =", room.playersid.size);
      //     console.log("playersid =", Array.from(room.playersid.keys()));
      //     for (const player of room.playersid.values()){
      //       if (player.socket.readyState === ws.OPEN){
      //         console.log("ca va SEND from server waitRoom " + message + " to " + player.socket.userId);
      //         player.socket.send(JSON.stringify({type: 'waitRoom', mess: message}));
      //       }
      //     }
      //   }
      //   if (data.type === "in-game"){
      //     console.log("probleme num2 si tu me vois, personne ne doit connaitre ce type");
      //     if (data.act === "role"){
      //       //objectif est de repartir les roles pour savoir qui commence et qui aura les O ou les X
      //       //envoyer l'id de la room pour eviter de galerer a la rechercher a chaque fois
      //     }
      //     if (data.act === "move"){
      //       //mettre a jour les move et les envoyer aux joueurs
      //       //enregistre la partie/la map ici dans le back pour eviter les triches
      //     }
      //     if (data.act === "win"){
      //       //mettre a jour la db gagant/nombre de parties jouee
      //       //clean room et managerRoom
      //     }
      //   }
      //   if (data.type === "pong")
      //     socket.isAlive = true


    socket.on('pong', () =>{
      console.log("i m in PONG")
      socket.isAlive = true;
    })
    socket.on('error', (err) => {
      // if (err.code === 'WS_ERR_INVALID_CLOSE_CODE' || err.code === 'WS_ERR_INVALID_UTF8') return;
      console.warn('WebSocket Error:', err.message);
    });
    socket.on('close', () => {
      console.log("user deco ");
      // try{
      //   if (socket.cleanedUp) return; // déjà traité
      //   socket.cleanedUp = true;

      //   const id = socket.userId;
      //   if (!id) return;
      // // console.log("CLOSE EVENT", code, reason);
      // // console.log("bool deco ", socket.GoLogout)
      //   if (socket.GoLogout == true){
      //     console.log('Utilisateur déconnNNNNecté', socket.id);
      //     // chat.removetokBySocketId(socket.id);
      //     manager_room.removePlayer(socket.userId);
      //   }
      //   else{
      //     setTimeout(() => {
      //       const id = socket.userId
      //       const reco = chat.finduserId(id)
      //       if (!reco){
      //         console.log('Utilisateur ne s est pas reco', socket.id);
      //         // chat.removetokBySocketId(socket.id);
      //         manager_room.removePlayer(socket.userId);
      //       }
      //     }, 2500)
      //   }
      // }catch(err){
      //   console.log("error close in ws back ", err);
      // }
  });
  });
  // setInterval(() => {
  //   console.log('Intervalle ping : je vérifie toutes les sockets');
  //   for (const session of chat.sessions.values()){
  //     const so = session.socket;
  //     console.log(session.socket.id);
  //     if (!so.isAlive) {
  //       console.log('Socket morte', so.id);
  //       chat.removetokBySocketId(so.id);
  //       manager_room.removePlayer(so.userId);
  //       // so.terminate();
  //     } else {
  //       session.socket.isAlive = false;
  //       session.socket.send(JSON.stringify({ type: 'ping' }));
  //     }
  //   }
  // }, 100000);
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