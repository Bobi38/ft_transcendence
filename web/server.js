// import express from 'express';
// import http from 'http';
// import path from 'path';
// import cookieParser from 'cookie-parser';
// import dotenv from 'dotenv';
// import bcrypt from 'bcrypt';
// import { fileURLToPath } from 'url';

// import router, { checktok } from './site/go/router.js';
// import { majDb } from './site/fct.js';
// import { initWebSocket } from './site/go/wsserver.js';

// // Models
// import './site/models/index.js';
// import User from './site/models/user.js';
// import './site/models/connect.js';
// import ChatG from './site/models/test.js';
// import './site/models/privchat.js';
// import './site/models/privmess.js';



// dotenv.config();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const PORT = process.env.PORT || 9000;

// const app = express();


// app.use(express.json());
// app.use(cookieParser());
// app.use('/api', router);




// app.get("/", async (req, res) => {
//   console.log ("iiiii");
//   const count = await User.count();
//   if (count === 0){
//     const CrypPass = await bcrypt.hash('tt', 10);
//     const CrypPassNi = await bcrypt.hash('12', 10);
//     await User.create({name: 'toto', password: CrypPass, mail: 'toto@test.c', co: false, win: 0, total_part: 100});
//     await User.create({name: 'titi', password: CrypPass, mail: 'titi@test.c', co: false, win: 0, total_part: 0});
//     await User.create({name: 'ni', password: CrypPassNi, mail: 'ni@g.fr', co: false, win: 50, total_part: 0});
//     await ChatG.create({contenu: ""});
//     majDb();
//   }
//   if (req.cookies.token){
//     const valid = await checktok(req.cookies.token);
//     if (valid === 0){
//       console.log("token valid in /");
//       return  res.sendFile(path.join(__dirname, "site",  "./go/welcome.html"));
//     }
//     else{
//       res.clearCookie('token');
//       console.log("token invalid in /");
//       res.sendFile(path.join(__dirname, 'site/go/dist', 'index.html'));
//       // return res.sendFile(path.join(__dirname, "site",  "./go/index2.html"));
//     }
//   }
//   else{
//     console.log("no token");
//     res.sendFile(path.join(__dirname, 'site/go/dist', 'index.html'));
//     // res.sendFile(path.join(__dirname, "site",  "./go/index2.html"));
//   }
// });

// app.use(express.static(path.join(__dirname, 'site/go/dist')));

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'site/go/dist', 'index.html'));
// });

// (async () => {
//   try {
//     console.log("Mise à jour de la DB...");
//     await majDb();
//     console.log("DB mise à jour avec succès");

//     const server = http.createServer(app);
//     initWebSocket(server);

//     server.on('upgrade', (request, socket, head) => {
//       // console.log('Upgrade request pour:', request.url);
//       // console.log('Headers:', request.headers);
//     });

//     server.listen(PORT, '0.0.0.0', () => {
//       console.log(`Server running on http://localhost:${PORT}`);
//     });

//   } catch (err) {
//     console.error("Erreur lors de l'initialisation du serveur :", err);
//     process.exit(1);
//   }
// })();

import express from 'express';
import session from "express-session";
import http from 'http';
import path from 'path';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { fileURLToPath } from 'url';
import { createProxyMiddleware } from 'http-proxy-middleware';

import router, { checktok } from './site/go/router.js';
import { majDb } from './site/fct.js';
import { initWebSocket } from './site/go/wsserver.js';
import {addDb} from './site/fct.js';

// Models
import './site/models/index.js';
import User from './site/models/user.js';
import './site/models/connect.js';
import ChatG from './site/models/test.js';
import './site/models/privchat.js';
import './site/models/privmess.js';

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
app.use('/api', router);

if (isDev) {
  
  console.log("JE SUIS DEVVVVVVVVVv")
  app.use('/', async (req,res) => createProxyMiddleware({target: 'http://localhost:5173',changeOrigin: true, ws: true,})
    );
} else {
  console.log("JE SUIS PROOOOOOOOOODDDDDDDDDDDd")
  // 🔹 En prod : servir le dist
  app.use(express.static(path.join(__dirname, 'site/go/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'site/go/dist', 'index.html'));
  });
}

(async () => {
  try {
    console.log("Mise à jour de la DB...");
    await majDb();
    console.log("DB mise à jour avec succès");

    const server = http.createServer(app);
    initWebSocket(server);
    addDb();
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://localhost:${PORT}`);
      if (isDev) console.log(`Proxying front to Vite at http://localhost:5173`);
    });
  } catch (err) {
    console.error("Erreur lors de l'initialisation du serveur :", err);
    process.exit(1);
  }
})();


//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzY4MjIzMzQ5LCJleHAiOjE3NjgyNjY1NDl9.f1a8N3asudEaMpCbr0hgYuLiaZC5xliCQ0AZNbK-sSk