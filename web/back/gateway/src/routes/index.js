
import fs from 'fs';
import cookieParser from 'cookie-parser';
import express from 'express';
import jwt from 'jsonwebtoken';

import Co  from '../models/connect.js';

const router = express.Router();
export const secret = fs.readFileSync('/run/secrets/cle_pswd', 'utf-8').trim();
router.use(cookieParser());

async function checktok(tokenn) {
  if (!tokenn) {
    console.log("no token provided");
    return 1;
  }
  try {
    const decoded = jwt.verify(tokenn, secret);
    const co = await Co.findAll({ where: { userId: decoded.id } });

    return co.length === 0 ? 1 : 0;
  } catch (err) {
    console.log("token error:", err.message);
    return 1;
  }
}

const publicRoutes = [
  '/',
  '/api/auth/session',
  '/api/oauth2/github',
  '/api/oauth2/github/callback',
  '/api/oauth2/google',
  '/api/secu/recovery_password',
  '/api/secu/recoverypassword_check_code',
  '/api/secu/majPswd',
  '/api/secu/cookie',
  '/api/secu/checkco',
  '/api/secu/send_mail',
  '/api/secu/maila2f_check_code'
];

export const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;

  const is_route_public = publicRoutes.find((element) => element === req.path);

  console.log("Middleware auth for path WHAT:", req.path);
  if (is_route_public || req.path === '/api/auth/user') {
    console.log("Public route, no auth required");
    return next() ;
  }
  if (!token && (!is_route_public || req.path !== '/api/auth/register')) {
    return res.status(401).json({ success: false, redirect: true});
  }
  const valid = await checktok(token);
  if (valid === 1) {
    console.log("token not valid");
    res.clearCookie('token');
    return res.status(401).json({ success: false, redirect: true});
  }
  return next();
}

export default router;