export {default as express}  from 'express';
export { default as bcrypt } from 'bcrypt';
export { default as fs } from 'fs';
export { default as jwt } from 'jsonwebtoken';
import { Op } from 'sequelize';
export { Op };
import fs from 'fs';
import cookieParser from 'cookie-parser';
import express from 'express';

import User  from '../models/user.js';
import StatPong3D from '../models/StatPong3D.js';
import GamePong3D from '../models/GamePong3D.js';

const router = express.Router();
export const secret = fs.readFileSync('/run/secrets/cle_pswd', 'utf-8').trim();
router.use(cookieParser());

export {
    User,
    StatPong3D,
    GamePong3D,
}


export default router;