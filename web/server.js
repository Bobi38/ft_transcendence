import express  from 'express';
const app = express();
import path from "path";
const PORT = process.env.PORT || 9000;
import stuffRoutes from './site/go/router.js';
import  pool  from './site/pool.js';
import sequelize from './site/models/index.js';
import './site/models/user.js';
import './site/models/connect.js';
import dotenv from 'dotenv';
dotenv.config();
app.use(express.json());
app.use('/api', stuffRoutes);
import {majDb} from './site/fct.js';
import { fileURLToPath } from 'url';
import { initWebSocket } from './site/go/wsserver.js';
import ws from 'ws';
import http from 'http';
import cookieParser from 'cookie-parser';
import fs from 'fs';




const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use((req, res, next) => {
  // console.log('Fichier demandé :', req.url);
  // console.log('Méthode HTTP :', req.method);
  next();
});

majDb();
app.use(cookieParser());

const server = http.createServer(app);
initWebSocket(server);
server.on('upgrade', (request, socket, head) => {
  console.log('Upgrade request received for:', request.url);
  console.log('Headers:', request.headers);
});
// autorise l'accès aux fichiers statiques
app.use(express.static(path.join(__dirname, 'site')));

app.get("/", (req, res) => {
  console.log('coooooo', req.cookies.token);
  if (req.cookies.token){
    res.sendFile(path.join(__dirname, "site",  "./go/welcome.html"));
  }
  else{
    console.log("no token");
    res.sendFile(path.join(__dirname, "site",  "./go/index2.html"));
  }
});


app.listen(PORT, () => {
  console.log("Server running on http://localhost:9000");
});

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzY4MjIzMzQ5LCJleHAiOjE3NjgyNjY1NDl9.f1a8N3asudEaMpCbr0hgYuLiaZC5xliCQ0AZNbK-sSk