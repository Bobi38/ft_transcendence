import express from 'express';
import http from 'http';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { initWebSMopr } from './WsSMopr.js';

//router
import Morpionroute from './routes/Morpion.controller.js'


dotenv.config();

const PORT = process.env.PORT || 9004;
const isDev = process.env.NODE_ENV !== 'production';

const app = express();

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

app.use(cookieParser());


app.use((req, res, next) => {
  console.log(`[MORP SERVICE] ${req.method} ${req.path}`);
  next();
});

app.use('/', Morpionroute);

// 404
app.use((req, res) => {
	res.status(404).json({ error: 'Not found' });
});

// error handler
app.use((err, req, res, next) => {
	if (err.type === 'entity.too.large') {
		return res.status(413).json({ error: 'Payload too large' });
	}
	console.error(err);
	res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

(async () => {
  try {
    const server = http.createServer(app);
    initWebSMopr(server);
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://localhost:${PORT}`);
      if (isDev) console.log("\x1b[32m%s\x1b[0m",`Proxying front to Vite at http://localhost:5173`);
    });
  } catch (err) {
    console.error("Erreur lors de l'initialisation du serveur :", err);
    process.exit(1);
  }
})();
