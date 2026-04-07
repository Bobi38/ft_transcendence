
import express from 'express';
import session from "express-session";
import path from 'path';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { createProxyMiddleware } from 'http-proxy-middleware';


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


const pong3dProxy = createProxyMiddleware({
  target: 'http://pong3d:2567',
  changeOrigin: true,
  ws: true,
  pathRewrite: {
    '^/api/pong3d': '',
  },
});

app.use('/api/pong3d', pong3dProxy);

app.use('/api/morpion', createProxyMiddleware({
  target: 'http://morpion:9004',
  changeOrigin: true
}))


app.use((req, res) => { res.status(404).json({ error: "Not found" }); });


(async () => {
  try {
    // console.log("Mise à jour de la DB...");
    // await majDb();
    // console.log("DB mise à jour avec succès");
    // addDb();
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://localhost:${PORT}`);
      if (isDev) console.log("\x1b[32m%s\x1b[0m",`Proxying front to Vite at http://localhost:5173`);
    });
    server.on('upgrade', (req, socket, head) => {
      if (req.url.startsWith('/api/pong3d')) {
        pong3dProxy.upgrade(req, socket, head);
      }
    });
  } catch (err) {
    console.error("Error while initializing server :", err);
    process.exit(1);
  }
})();


//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzY4MjIzMzQ5LCJleHAiOjE3NjgyNjY1NDl9.f1a8N3asudEaMpCbr0hgYuLiaZC5xliCQ0AZNbK-sSk