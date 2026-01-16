import ws from 'ws';
import { WebSocketServer } from 'ws';
import {Chat} from '../fct.js';
import cookie from 'cookie' ;



export function initWebSocket(server) {
  const wss = new WebSocketServer({ server, path: '/ws' });

  const clients = [];

  console.log('WebSocket server initialized');
  // console.log('WebSocket server initialized');
  console.log(wss.readyState);
  wss.on('connection', (socket, req) => {
    console.log('Nouvelle connexion WebSocket ', req.socket.remoteAddress);
    clients.push(socket);

    console.log('Nombre de clients connectés :', clients.length);
    socket.on('message', (message) => {
      console.log('Message reçu :', message.toString());
      clients.forEach((client) => {
        if (client.readyState === ws.OPEN) {
          client.send("JE SUIS LE SERVER " + message.toString());
        }
      });
    });

    socket.on('close', () => {
      console.log('Client déconnecté');
      const index = clients.indexOf(socket);
      if (index !== -1) clients.splice(index, 1);
    });
    // socket.on('close', () => {
    //   console.log('Client déconnecté');
    //   const index = clients.indexOf(socket);
    //   if (index !== -1) clients.splice(index, 1);
    // });
  });
  }



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