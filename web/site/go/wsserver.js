import ws from 'ws';
import { WebSocketServer } from 'ws';

export function initWebSocket(server) {
  const wss = new WebSocketServer({ server, path: '/ws' });

  const clients = [];

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

    // socket.on('close', () => {
    //   console.log('Client déconnecté');
    //   const index = clients.indexOf(socket);
    //   if (index !== -1) clients.splice(index, 1);
    // });
  });
}

//socket.io
//express-ws