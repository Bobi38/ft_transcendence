import ws from 'ws';
import { WebSocketServer } from 'ws';
import {chat} from '../fct.js';
import {ManagRoom} from '../ManagRoom.js';
import cookie from 'cookie' ;


function getCookie(name, cookieHeader) {
  if (!cookieHeader) return null;
  const match = cookieHeader
    .split(';')
    .map(c => c.trim())
    .find(c => c.startsWith(name + '='));
  return match ? decodeURIComponent(match.split('=')[1]) : null;
}

export function initWebSocket(server) {
  const wss = new WebSocketServer({ server, path: '/ws' });

  console.log('WebSocket server initialized on path /ws');
  wss.on('connection', async (socket, req) => {
    console.log('Nouvelle connexion WebSocket de', req.socket.remoteAddress);
    console.log('URL:', req.url);
    console.log('Headers upgrade:', req.headers.upgrade);
    console.log(req.headers.cookie)
    const token = getCookie('token', req.headers.cookie);
    if (!token) {
      socket.close();
      return;
    }

    let user;
    try {
      user = chat.decoded(token);
    } catch {
      socket.close();
      return;
    }

    if (!user) {socket.close(); return; }
    console.log("uuu-------", user);
    const useid = user.id;
    socket.userId = useid;
 
    const exist = chat.finduser(useid);
    if (exist){
      exist.socket = socket;
      console.log("user already exist");
    }
    else{
      console.log("new user, add to chat sessions");
      await chat.addtok(useid, socket, useid);
      socket.send(JSON.stringify({type: 'auth_success',id: useid,mess: 'auth ok'}));
    }
    console.log("taille =" , chat.countUser());
    socket.on('message', (message) => {          
      try{
        const data = JSON.parse(message.toString());
        console.log('=== MESSAGE REÇU ===');
        console.log('Type:', data.type);
        console.log('Contenu:', data.mess);
        console.log('===================');
        // if (data.type === 'auth'){
        //   iid = socket.userId;
        //   const use = chat.finduser(iid);
        //   if (use){
        //     use.socket = socket;
        //     console.log("user already exist");
        //     return ;
        //   }
        //   chat.addtok(iid, socket);
        //   socket.send(JSON.stringify({type: 'auth_success', id: iid, mess: 'auth goog'}));
        //   return ;
        // }
        if (data.type === 'mess'){
          console.log("je suis dans un type messsssssssss")
          const nono = socket.userId;
          const na = chat.finduser(nono);
          const ni = na.username;
          console.log ("----" , nono , "----", ni);
          console.log("taille === ", chat.countUser());
          for (const session of chat.sessions.values()){
            console.log("session ", session.userId);
            console.log("idddd " + session.userId + "   "  +  nono + "-----" + socket.username);
            if (session.socket.readyState === ws.OPEN && session.userId != nono){ //&& session.userId != nono.id
                console.log("ca va SEND from server " + nono + " to " + session.userId + "name " + session.username);
                // session.socket.send(JSON.stringify({type: "message", id: userid, mess: "JE SUIS LE SERVER " + data.mess + " from " + userid }));
                session.socket.send(JSON.stringify({type: 'message', senderid: nono, mess: data.mess, name: ni}));
            }
          }
        }
        if (data.type === 'waitRoom'){
          let message = "";
          console.log("je suis dans un type waitRoom");
          console.log("user id dans wait room " + socket.userId);
          let room = ManagRoom.isInRoom(socket.userId);
          if (!room)
            room = ManagRoom.findoneplace(socket, socket.userId);
          if (room.isFull()){
            message = "yes";
            room.setlocked(true);
          } 
          else
            message = "no";
          console.log("popopopo");
          console.log("room =", room);
          console.log("playersid size =", room.playersid.size);
          console.log("playersid =", Array.from(room.playersid.keys()));
          for (const player of room.playersid.values()){
            if (player.socket.readyState === ws.OPEN){
              console.log("ca va SEND from server waitRoom " + message + " to " + player.socket.userId);
              player.socket.send(JSON.stringify({type: 'waitRoom', mess: message}));
            }
          }
        }
        if (data.type === "in-game"){
          if (data.act === "role"){
            //objectif est de repartir les roles pour savoir qui commence et qui aura les O ou les X
            //envoyer l'id de la room pour eviter de galerer a la rechercher a chaque fois 
          }
          if (data.act === "move"){
            //mettre a jour les move et les envoyer aux joueurs
            //enregistre la partie/la map ici dans le back pour eviter les triches 
          }
          if (data.act === "win"){
            //mettre a jour la db gagant/nombre de parties jouee
            //clean room et managroom 
          }
        }

      }catch (err){
        console.log("err serv ws= " + err);
      }
      });

    // socket.on('close', () => {
    //   console.log('Client déconnecté');
    //   const index = clients.indexOf(socket);
    //   if (index !== -1) clients.splice(index, 1);
    //     console.log('Nombre de clients connectés :', clients.length);
    // });

    socket.on('error', (error) => {
      console.error('Erreur WebSocket:', error);
    });
    socket.on('close', () => {
      console.log('Utilisateur déconnecté', socket.userId);
      chat.removetok(socket.userId);
      ManagRoom.removeplayer(socket.userId);
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