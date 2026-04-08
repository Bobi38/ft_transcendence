export {default as express}  from 'express';
export { default as bcrypt } from 'bcrypt';
export { default as fs } from 'fs';
export { default as jwt } from 'jsonwebtoken';
export { default as nodemailer } from 'nodemailer';
export { default as crypto } from 'crypto';
export { default as validator } from 'validator';
import fs from 'fs';
import cookieParser from 'cookie-parser';
import express from 'express';
import jwt from 'jsonwebtoken';

import User  from '../models/user.js';
import Co  from '../models/connect.js';
import PswEmail from '../models/PssWrdEmail.js';


const router = express.Router();
export const secret = fs.readFileSync('/run/secrets/cle_pswd', 'utf-8').trim();
router.use(cookieParser());

export function tcheck_MPFA(user, host){
    const now = new Date();
    const limit = new Date(now.getTime() - 10 * 60 * 1000);
    let MPFA;
    console.log(limit);
    if (user.MPFA == true)
      MPFA = false
    else if (user.Hostlastco === null && user.Datelastco === null)
      MPFA = true;
    else if (user.Hostlastco != host)
      MPFA = true;
    else if (user.Hostlastco == host && user.Datelastco != null && (user.Datelastco < limit))
      MPFA = true;
    else if (user.Hostlastco == host && user.Datelastco != null && (user.Datelastco > limit))
      MPFA = false;
    else
      MPFA = true;
    return MPFA;
}

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
    return { success: false, message: "in get_user_from_token " + err.message };
  }
}

export {
    User,
    Co,
    PswEmail,

};


export default router;