import express from 'express';
import session from "express-session";
import http from 'http';
import path from 'path';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { initWebSChat } from './WsSChatP.js';




//router
import chatProute from './routes/ChatP.controller.js'


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 9002;
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
  console.log(`[CHATP SERVICE] ${req.method} ${req.path}`);
  next();
});
app.use('/', chatProute);


(async () => {
  try {
    const server = http.createServer(app);
    initWebSChat(server);
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://localhost:${PORT}`);
      if (isDev) console.log("\x1b[32m%s\x1b[0m",`Proxying front to Vite at http://localhost:5173`);
    });
  } catch (err) {
    console.error("Erreur lors de l'initialisation du serveur :", err);
    process.exit(1);
  }
})();
