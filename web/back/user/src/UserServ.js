import express from 'express';
import session from "express-session";
import http from 'http';
import path from 'path';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { initWebSFriend } from './WsFriend.js';






import friendroute from './routes/Friends/Friends.controller.js'
import Profileroute from './routes/Profile/Profile.controller.js'

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 9003;
const isDev = process.env.NODE_ENV !== 'production';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret:'coucou',
  resave: false,
  saveUninitialized: true
}))

app.use((req, res, next) => {
  console.log(`[USER_S SERVICE] ${req.method} ${req.path}`);
  next();
});

app.use('/friend', friendroute);
app.use('/profile', Profileroute);



(async () => {
  try {
    const server = http.createServer(app);
    initWebSFriend(server);
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://localhost:${PORT}`);
      if (isDev) console.log("\x1b[32m%s\x1b[0m",`Proxying front to Vite at http://localhost:5173`);
    });
  } catch (err) {
    console.error("Erreur lors de l'initialisation du serveur :", err);
    process.exit(1);
  }
})();


//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzY4MjIzMzQ5LCJleHAiOjE3NjgyNjY1NDl9.f1a8N3asudEaMpCbr0hgYuLiaZC5xliCQ0AZNbK-sSk