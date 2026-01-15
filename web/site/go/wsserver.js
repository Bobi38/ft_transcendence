import ws from 'ws';
import { WebSocketServer } from 'ws';
import {chatt} from './router.js';

export function initWebSocket(server) {
  const wss = new WebSocketServer({ server, path: '/ws' });
  // console.log('WebSocket server initialized');
  console.log(wss.readyState);
  wss.on('connection', (socket, req) => {
    console.log('Nombre de clients connectés :', chatt.countUser());
    socket.on('message', (message) => {
      console.log('Message reçu :', message.toString());
      for (const session of chatt.sessions.values()) {
          const wsClient = session.socket;
          console.log (session.token === data.message ? 1 : 0);
          if (wsClient.readyState === wsClient.OPEN) {
            wsClient.send(message.toString());
        }
      }
      });
  });
}



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