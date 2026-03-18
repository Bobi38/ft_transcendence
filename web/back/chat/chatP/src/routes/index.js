export {default as express}  from 'express';
export {jwt} from 'jsonwebtoken';
import { Op } from 'sequelize';
export { Op };
import fs from 'fs';
import cookieParser from 'cookie-parser';
import express from 'express';

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
        tableau.push({monMsg: monMs, message: mess, login: name, timer: conv[i].time})
    }
    return tableau;
};

export {
    User,
    PrivMess,
    PrivChat,
};


export default router;