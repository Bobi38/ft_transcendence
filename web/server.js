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
import wss from 'ws';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use((req, res, next) => {
  // console.log('Fichier demandé :', req.url);
  // console.log('Méthode HTTP :', req.method);
  next();
});

majDb();

const server = http.createServer(app);

// Initialise le WebSocket depuis un module séparé
initWebSocket(server);

// autorise l'accès aux fichiers statiques
app.use(express.static(path.join(__dirname, 'site')));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "site",  "./go/index2.html"));
});


app.listen(PORT, () => {
  console.log("Server running on http://localhost:9000");
});