
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
    const count = await Co.count();

    const co = await Co.findAll({ where: { userId: decoded.id } });

    return co.length === 0 ? 1 : 0;
  } catch (err) {
    console.log("token error:", err.message);
    return 1;
  }
}



export const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  console.log("Middleware auth for path WHAT:", req.path);
  if ( req.path === '/api/auth/login' || req.path === '/api/auth/register' || req.path === '/api/oauth2/github' || req.path === '/api/oauth2/github/callback' || req.path == '/api/oauth2/google') {
    console.log("Public route, no auth required");
    return next() ;
  }
  if (!token && req.path !== '/' && req.path !== '/api/auth/login' && req.path !== '/api/auth/register' && req.path !== '/api/oauth2/github' && req.path !== '/api/oauth2/github/callback' && req.path !== '/api/oauth2/google') {
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