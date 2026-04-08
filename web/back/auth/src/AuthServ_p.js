import express from 'express';
import session from "express-session";
import path from 'path';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import { fileURLToPath } from 'url';

//router
import authroute from './routes/auth/auth.controller.js'
import oauth2route from './routes/Oauth/Oauth2.controller.js'
import securoute from './routes/secu/secu.controller.js'

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 9005;
const isDev = process.env.NODE_ENV !== 'production';
const SECSESSION = process.env.SEC_SESSION

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: SECSESSION,
  resave: false,
  saveUninitialized: true
}))

app.use((req, res, next) => {
  console.log(`[AUTH SERVICE] ${req.method} ${req.path}`);
  next();
});

app.use('/auth', authroute);
app.use('/oauth2', oauth2route);
app.use('/secu', securoute);

(async () => {
  try {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://localhost:${PORT}`);
      if (isDev) console.log("\x1b[32m%s\x1b[0m",`Proxying front to Vite at http://localhost:5173`);
    });
  } catch (err) {
    console.error("Error while initializing server :", err);
    process.exit(1);
  }
})();
