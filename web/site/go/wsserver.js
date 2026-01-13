import ws from 'ws';
import { WebSocketServer } from 'ws';

export function initWebSocket(server) {
  const wss = new WebSocketServer({ server });

  const clients = [];

  console.log('WebSocket server initialized');
  wss.on('connection', (socket) => {
    console.log('Nouvelle connexion WebSocket');
    clients.push(socket);

    socket.on('message', (message) => {
      console.log('Message reçu :', message.toString());
      clients.forEach((client) => {
        if (client !== socket && client.readyState === ws.OPEN) {
          client.send(message.toString());
        }
      });
    });

    socket.on('close', () => {
      console.log('Client déconnecté');
      const index = clients.indexOf(socket);
      if (index !== -1) clients.splice(index, 1);
    });
  });
}