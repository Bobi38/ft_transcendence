export {default as express}  from 'express';
export { default as bcrypt } from 'bcrypt';
export { default as fs } from 'fs';
export { default as jwt } from 'jsonwebtoken';
export { default as cookieParser } from 'cookie-parser';
export { default as path } from 'path';
export { fileURLToPath } from 'url';
export { default as nodemailer } from 'nodemailer';
export { default as crypto } from 'crypto';
export { default as validator } from 'validator';
export { isValidPhoneNumber } from 'libphonenumber-js';
import { Op } from 'sequelize';
export { Op };
export { default as os } from 'os';
export { default as session } from 'express-session';
export { default as QRCode } from 'qrcode';
export { authenticator } from 'otplib';
export { error, time } from 'console';
export { majDb } from '../fct.js'
import fs from 'fs';
import cookieParser from 'cookie-parser';
import express from 'express';
import jwt from 'jsonwebtoken';

import User  from '../models/user.js';
import Co  from '../models/connect.js';
import ChatG from '../models/test.js';
import PrivMess from '../models/privmess.js';
import PrivChat from '../models/privchat.js';
import Friend from '../models/friend.js';
import PswEmail from '../models/PssWrdEmail.js';
import StatMorp from '../models/StatMorp.js';
import GameMorp from '../models/GameMorp.js';
import HistoryMorp from '../models/HistoryMorp.js';
import {decrypt} from '../crypt.js'

const router = express.Router();
export const secret = fs.readFileSync('/run/secrets/cle_pswd', 'utf-8').trim();
export const secret_chat = fs.readFileSync('/run/secrets/cle_chat', 'utf-8').trim();
export const secret_tok_2fa = "toto";
router.use(cookieParser());


async function checktok(tokenn) {
  if (!tokenn) {       // <-- vérifie d’abord si le token existe
    console.log("no token provided");
    return 1;          // 1 = invalide
  }

  try {
    const decoded = jwt.verify(tokenn, secret); // ok, token existe
    const count = await Co.count();
    // console.log("taille table", count, "userId =", decoded.id);
    const co = await Co.findAll({ where: { userId: decoded.id } });
    // console.log("check tok", co.length);
    return co.length === 0 ? 1 : 0;
  } catch (err) {
    console.log("token error:", err.message);
    return 1;
  }
}

export function maj_conv(id, conv, namelst){
  const  tableau = [];

  for (let i = conv.length - 1; i >= 0; i--) {
    let name;
    let monMs;
    if (conv[i].SenderId == id){
      name = "me";
      monMs = true;
    }
    else{
      console.log("namelst ", namelst.length);
      const user = namelst.find(u => u.id === conv[i].SenderId);
      name = user ? user.name : "unknown";
      monMs = false;
    }
    const mess = decrypt(conv[i].contenu);
    tableau.push({monMsg: monMs, message: mess, login: name, timer: conv[i].time})
  }
  return tableau;
};



export const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  console.log("Middleware auth for path:", req.method, req.originalUrl);
  console.log("Middleware auth for path WHAT:", req.path);
  console.log("Headers:", req.headers.origin);
  console.log("tototo ", token);
  if (!token && req.path !== '/' && req.path !== '/api/auth/login' && req.path !== '/api/auth/register' && req.path !== '/api/oauth2/github' && req.path !== '/api/oauth2/github/callback') {
    return res.status(401).json({ success: false, redirect: true});
  }
  if (req.path === '/' || req.path === '/api/auth/login' || req.path === '/api/auth/register' || req.path === '/api/oauth2/github' || req.path === '/api/oauth2/github/callback') {
    console.log("Public route, no auth required");
    return next() ;
  }
  const valid = await checktok(token);
  if (valid === 1) {
    console.log("token not valid");
    res.clearCookie('token');
    return res.status(401).json({ success: false, redirect: true});
  }

  console.log("token valid");
  next();
}

function CheckName(req, res, next){
  console.log("je suis dan middel checkname");
  if (req.session.nameNeedUpdate)
      return res.status(201).json({success: true, message: req.session.username});
  next();
}

export {
    // secret_chat,
    // secret,
    // checktok,
    User,
    Co,
    ChatG,
    PrivMess,
    PrivChat,
    Friend,
    PswEmail,
    StatMorp,
    GameMorp,
    HistoryMorp,
};


export default router;