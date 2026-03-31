import express from 'express';
import session from "express-session";
import path from 'path';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import { fileURLToPath } from 'url';

//router
import authroute from './routes/auth_p.js'
import oauth2route from './routes/Oauth2_p.js'
import securoute from './routes/secu_p.js'

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 9005;
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
  console.log(`[AUTH SERVICE] ${req.method} ${req.path}`);
  next();
});

app.use('/', authroute);
app.use('/', oauth2route);
app.use('/', securoute);

(async () => {
  try {
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