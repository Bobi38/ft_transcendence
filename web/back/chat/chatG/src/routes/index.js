export {default as express}  from 'express';
export { default as bcrypt } from 'bcrypt';
export { default as jwt } from 'jsonwebtoken';
import fs from 'fs';

import express from 'express';


import User  from '../models/user.js';
import ChatG from '../models/test.js';
import {decrypt} from './crypt.js'

const router = express.Router();
export const secret = fs.readFileSync('/run/secrets/cle_pswd', 'utf-8').trim();
export const secret_chat = fs.readFileSync('/run/secrets/cle_chat', 'utf-8').trim();




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
        tableau.push({monMsg: monMs, message: mess, login: name, timer: conv[i].time})
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
    return { success: false, message: err.message };
  }
}

export {
    User,
    ChatG,

};


export default router;