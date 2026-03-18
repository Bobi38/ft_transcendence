
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
import { majDb } from './CreatDB.js';
import { addDb } from './CreatDB.js';


//router
import { authMiddleware } from './routes/index.js';

dotenv.config();
const host = process.env.VITE_DEV_HOST;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 9000;
const isDev = process.env.NODE_ENV !== 'production';

const app = express();

// app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret:'coucou',
  resave: false,
  saveUninitialized: true
}))

app.use(authMiddleware);

app.use('/api/auth', createProxyMiddleware({
  target: 'http://auth:9005',
  changeOrigin: true,
  selfHandleResponse: false,
}));

app.use('/api/oauth2', createProxyMiddleware({
  target: 'http://auth:9005',
  changeOrigin: true
}))

app.use('/api/secu', createProxyMiddleware({
  target: 'http://auth:9005',
  changeOrigin: true
}))

app.use('/api/profile', createProxyMiddleware({
  target: 'http://user_service:9003',
  changeOrigin: true
}))

app.use('/api/friend', createProxyMiddleware({
  target: 'http://user_service:9003',
  changeOrigin: true
}))

app.use('/api/chatG', createProxyMiddleware({
  target: 'http://chatg_service:9001',
  changeOrigin: true
}))

app.use('/api/chatP', createProxyMiddleware({
  target: 'http://chatp_service:9002',
  changeOrigin: true
}))

app.use('/api/pong3d', createProxyMiddleware({
  target: 'http://pong3d:2567',
  changeOrigin: true
}))

app.use('/api/morpion', createProxyMiddleware({
  target: 'http://morpion:9004',
  changeOrigin: true
}))

if (!isDev) {
  app.use('/ws/chatG', createProxyMiddleware({
    target: 'ws://chatg_service:9001',
    changeOrigin: true,
    ws: true,
  }));

  app.use('/ws/chatP', createProxyMiddleware({
    target: 'ws://chatp_service:9002',
    changeOrigin: true,
    ws: true,
  }));

  app.use('/ws/friend', createProxyMiddleware({
    target: 'ws://user_service:9003',
    changeOrigin: true,
    ws: true,
  }));

  app.use('/ws/morp', createProxyMiddleware({
    target: 'ws://morpion:9004',
    changeOrigin: true,
    ws: true,
  }));

  app.use('/ws/goat', createProxyMiddleware({
    target: 'http://pong3d:2567',
    changeOrigin: true,
    ws: true,
    pathRewrite: {'^/ws/goat' : ''},
  }));
}

app.use((req, res) => { res.status(404).json({ error: "Not found" }); });


(async () => {
  try {
    console.log("Mise à jour de la DB...");
    await majDb();
    console.log("DB mise à jour avec succès");
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