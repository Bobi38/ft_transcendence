import { WebSocketServer } from 'ws';
import { authenticateSocket } from './auth.js';

export function createWSServer(server, path, handler) {
  const wss = new WebSocketServer({ server, path });

  let idCounter = 0;

  wss.on('connection', (socket, req) => {
    socket.id = idCounter++;

    const user = authenticateSocket(req, socket);
    if (!user) {
      socket.close(1008, 'Unauthorized');
      return;
    }

    handler(socket, req, user, wss);
  });

  return wss;
}