export {default as express}  from 'express';
export { default as bcrypt } from 'bcrypt';
export { default as fs } from 'fs';
export { default as jwt } from 'jsonwebtoken';
export { default as nodemailer } from 'nodemailer';
export { default as crypto } from 'crypto';
import fs from 'fs';
import cookieParser from 'cookie-parser';
import express from 'express';

import User  from '../models/user.js';
import Co  from '../models/connect.js';
import PswEmail from '../models/PssWrdEmail.js';


const router = express.Router();
export const secret = fs.readFileSync('/run/secrets/cle_pswd', 'utf-8').trim();
router.use(cookieParser());

export {
    User,
    Co,
    PswEmail,

};


export default router;