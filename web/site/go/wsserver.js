import ws from 'ws';

export function initWebSocket(server) {
  const wss = new ws.Server({ server });

  const clients = [];

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