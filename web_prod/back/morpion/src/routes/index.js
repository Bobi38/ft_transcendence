export {default as express}  from 'express';
export { default as jwt } from 'jsonwebtoken';
import { Op } from 'sequelize';
export { Op };
import fs from 'fs';
import cookieParser from 'cookie-parser';
import express from 'express';

import User  from '../models/user.js';
import StatMorp from '../models/StatMorp.js';
import GameMorp from '../models/GameMorp.js';

const router = express.Router();
export const secret = fs.readFileSync('/run/secrets/cle_pswd', 'utf-8').trim();
router.use(cookieParser());


export {
    User,
    StatMorp,
    GameMorp,
};


export default router;