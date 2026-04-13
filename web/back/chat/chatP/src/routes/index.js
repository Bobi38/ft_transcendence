export {default as express}  from 'express';
export { default as jwt } from 'jsonwebtoken';
import { Op } from 'sequelize';
export { Op };
import fs from 'fs';
import cookieParser from 'cookie-parser';
import express from 'express';
import jwt from 'jsonwebtoken';

import User  from '../models/user.js';
import PrivMess from '../models/privmess.js';
import PrivChat from '../models/privchat.js';
import {decrypt} from './crypt.js'

const router = express.Router();
export const secret = fs.readFileSync('/run/secrets/cle_pswd', 'utf-8').trim();
router.use(cookieParser());

export function maj_conv(id, conv, namelst){
  const  tableau = [];

    for (let i = conv.length - 1; i >= 0; i--) {
        let name;
        let monMs;
        if (conv[i].SenderId == id){
            name = "me";
            monMs = true;
        } else {
            console.log("namelst ", namelst.length);
            const user = namelst.find(u => u.id === conv[i].SenderId);
            name = user ? user.name : "unknown";
            monMs = false;
        }
        const mess = decrypt(conv[i].contenu);

        const jour = String(conv[i].time.getDate()).padStart(2, '0');
        const mois = String(conv[i].time.getMonth() + 1).padStart(2, '0');
        const heure = String(conv[i].time.getHours() + 2).padStart(2, '0');
        const minute = String(conv[i].time.getMinutes()).padStart(2, '0');

        const resultat = `${jour}-${mois} ${heure}:${minute}`;
        tableau.push({monMsg: monMs, message: mess, login: name, timer: resultat})
    }
    return tableau;
};

export function errorHandler(message, code, res) {
  return res.status(code).json({ success: false, message: message });
}

export async function get_user_from_token(token) {
  try {
    const decoded = jwt.verify(token, secret);
    const result = await User.findOne({ where: { id: decoded.id } });
    if (!result) {
      return { success: false, message: 'User not found' };
    }
    return { success: true, user: result };
  } catch (err) {
    return { success: false, message: "in get_user_from_token: " + err.message };
  }
}

export {
    User,
    PrivMess,
    PrivChat,
};


export default router;