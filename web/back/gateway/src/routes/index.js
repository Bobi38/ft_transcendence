
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
const authRouter = [
	'/',
	'/api/secu/recovery/password',
	'/api/secu/recupPswd_check_code',
	'/api/secu/majPswd',
	'/api/secu/cookie',
	'/api/oauth2/github',
	'/api/oauth2/github/callback',
	'/api/oauth2/google',
	'/api/auth/login',
	'/api/auth/register',
	'/api/auth/logout',
  '/api/secu/checkco',
];


export const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  console.log("Middleware auth for path WHAT:", req.path);
  if ( req.path === '/' || req.path === '/api/auth/session' || req.path === '/api/auth/user' || req.path === '/api/oauth2/github' 
    || req.path === '/api/oauth2/github/callback' || req.path === '/api/oauth2/google' || req.path === '/api/secu/recovery_password' 
    || req.path === '/api/secu/recoverypassword_check_code' || req.path === '/api/secu/majPswd' || req.path === '/api/secu/cookie' 
    || req.path === '/api/secu/checkco'           || req.path === "/api/secu/send_mail" || req.path === '/api/secu/maila2f_check_code') {
    console.log("Public route, no auth required");
    return next() ;
  }
  if (!token && req.path !== '/' && req.path !== '/api/auth/session' && req.path !== '/api/auth/register' && req.path !== '/api/oauth2/github' 
    && req.path !== '/api/oauth2/github/callback' && req.path !== '/api/oauth2/google' && req.path !== '/api/secu/recovery_password' 
    && req.path !== '/api/secu/recoverypassword_check_code' && req.path !== '/api/secu/majPswd' && req.path !== '/api/secu/cookie'
    && req.path !== '/api/secu/checkco'           && req.path !== "/api/secu/send_mail" && req.path !== '/api/secu/maila2f_check_code') {
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