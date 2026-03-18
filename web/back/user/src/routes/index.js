export {default as express}  from 'express';
export { default as bcrypt } from 'bcrypt';
export { default as jwt } from 'jsonwebtoken';
export { default as validator } from 'validator';
export { isValidPhoneNumber } from 'libphonenumber-js';
import { Op } from 'sequelize';
export { Op };
import fs from 'fs';
import cookieParser from 'cookie-parser';
import express from 'express';


import User  from '../models/user.js';
import Friend from '../models/friend.js';

const router = express.Router();
export const secret = fs.readFileSync('/run/secrets/cle_pswd', 'utf-8').trim();
router.use(cookieParser());

export {
    User,
    Friend,
};


export default router;