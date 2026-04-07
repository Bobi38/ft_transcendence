import jwt from 'jsonwebtoken';
import { getCookie } from './cookies.js';
import fs from 'fs';

const secret = fs.readFileSync('/run/secrets/cle_pswd', 'utf-8').trim();

export function authenticateSocket(req, socket) {
  const token = getCookie('token', req.headers.cookie);
  if (!token) return null;

  try {
    const user = jwt.verify(token, secret);

    socket.userId = user.id;
    socket.isAlive = true;
    socket.cleanedUp = false;
    socket.GoLogout = false;

    return user;
  } catch {
    return null;
  }
}