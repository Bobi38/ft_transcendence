
import express from 'express';
import session from "express-session";
import http from 'http';
import path from 'path';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { fileURLToPath } from 'url';
import { createProxyMiddleware } from 'http-proxy-middleware';
// import {Server as ColyServ} from "colyseus";
// import { GameRoom } from './colyseus/GameRoom.js';
// import router from './routes/index.js';
// import router from './router.js';
import { majDb } from './fct.js';
import { initWebSocket } from './wsserver.js';
import {addDb} from './fct.js';

// Models
import './models/index.js';
import User from './models/user.js';
import './models/connect.js';
import ChatG from './models/test.js';
import './models/privchat.js';
import './models/privmess.js';


//router
import { authMiddleware } from './routes/index.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 9000;
const isDev = process.env.NODE_ENV !== 'production';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret:'coucou',
  resave: false,
  saveUninitialized: true
}))

app.use(authMiddleware);


app.use('/api/auth', createProxyMiddleware({
  target: 'http://localhost:9100',
  changeOrigin: true
}))

app.use('/api/oauth2', createProxyMiddleware({
  target: 'http://localhost:9100',
  changeOrigin: true
}))

app.use('/api/secu', createProxyMiddleware({
  target: 'http://localhost:9100',
  changeOrigin: true
}))

app.use('/api/profile', createProxyMiddleware({
  target: 'http://localhost:9003',
  changeOrigin: true
}))

app.use('/api/friend', createProxyMiddleware({
  target: 'http://localhost:9003',
  changeOrigin: true
}))

app.use('/api/chatG', createProxyMiddleware({
  target: 'http://localhost:9001',
  changeOrigin: true
}))

app.use('/api/chatP', createProxyMiddleware({
  target: 'http://localhost:9002',
  changeOrigin: true
}))

app.use('/api/game', createProxyMiddleware({
  target: 'http://localhost:2567',
  changeOrigin: true
}))

app.use('/api/morpion', createProxyMiddleware({
  target: 'http://localhost:9004',
  changeOrigin: true
}))





if (isDev) {
  console.log("JE SUIS DEV");

  const viteProxy = createProxyMiddleware({
    target: 'http://localhost:5173',
    changeOrigin: true,
    ws: true,
  });

  app.use('/', viteProxy);
} else {
  console.log("JE SUIS PROOOOOOOOOODDDDDDDDDDDd")
  // 🔹 En prod : servir le dist
  app.use(express.static(path.join(__dirname, 'site/go/dist')));//TODO prod
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'site/go/dist', 'index.html'));//TODO prod
  });
}

(async () => {
  try {
    console.log("Mise à jour de la DB...");
    await majDb();
    console.log("DB mise à jour avec succès");
    // const colyseusServer = new ColyServ({ server });
    // colyseusServer.define('game_room', GameRoom);
    addDb();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://localhost:${PORT}`);
      if (isDev) console.log("\x1b[32m%s\x1b[0m",`Proxying front to Vite at http://localhost:5173`);
    });
  } catch (err) {
    console.error("Erreur lors de l'initialisation du serveur :", err);
    process.exit(1);
  }
})();


//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzY4MjIzMzQ5LCJleHAiOjE3NjgyNjY1NDl9.f1a8N3asudEaMpCbr0hgYuLiaZC5xliCQ0AZNbK-sSk