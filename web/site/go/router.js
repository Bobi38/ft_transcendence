import express from 'express';
import bcrypt from 'bcrypt';
const router = express.Router();
import pool from '../pool.js';
import jwt from 'jsonwebtoken';
import coockieParser from 'cookie-parser';
import User  from '../models/user.js';
import Co  from '../models/connect.js';
import ChatG from '../models/test.js';
import PrivMess from '../models/privmess.js';
import PrivChat from '../models/privchat.js';
import {majDb}  from '../fct.js';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.use(coockieParser());
// const location = os.networkInterfaces().eth0 ? os.networkInterfaces().eth0.find(details => details.family === 'IPv4') : {hostname: 'localhost'};
// const secret = location.address;
const secret = 'toto';

async function checktok(tokenn) {
  if (!tokenn) {       // <-- vérifie d’abord si le token existe
    console.log("no token provided");
    return 1;          // 1 = invalide
  }

  try {
    const decoded = jwt.verify(tokenn, secret); // ok, token existe
    const count = await Co.count();
    // console.log("taille table", count, "userId =", decoded.id);
    const co = await Co.findAll({ where: { userId: decoded.id } });
    // console.log("check tok", co.length);
    return co.length === 0 ? 1 : 0;
  } catch (err) {
    console.log("token error:", err.message);
    return 1;
  }
}


router.use(async (req, res, next) => {
  const token = req.cookies.token;
  // console.log("Middleware auth for path:", req.path);
  if (!token && req.path !== '/' && req.path !== '/login' && req.path !== '/register' ) {
    return res.status(401).json({ success: false, redirect: true});
  }
  if (!token && (req.path === '/' || req.path === '/login' || req.path === '/register')) {
    return next() ;
  }
  const valid = await checktok(token);
  if (valid === 1) {           
    console.log("token not valid");
    res.clearCookie('token');  
    return res.status(401).json({ success: false, redirect: true});
  }

  // console.log("token valid");
  next();                  
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("ccccc suis la ");
    const result = await User.findAll({ where: { mail: email } });
    console.log("rafter");
    console.log(result.length);
    if (result.length === 0)
        return res.status(500).json({success: false, message: 'Email not find'});
    const DecrypPass = await bcrypt.compare(password, result[0].password);
    if (!DecrypPass)
        return res.status(500).json({success: false, message: 'Password not valid'});
    const iid = await Co.findAll({where: { userId: result[0].id}})
    if (iid.length != 0)
        return res.status(500).json({success:false, message: 'User already log'});
      console.log(result[0].id," avant token");
    const token = jwt.sign({id: result[0].id}, secret, {expiresIn: '12h'});
    console.log("apres token");
    const re = await Co.create({token: token, userId: result[0].id});
    console.log ("TAILLE= " , Co.length);
    await result[0].update({co: true});
    console.log("ID", result[0].id);
    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 12 * 60 * 60 * 1000 });
    res.status(201).json({  success : true , message: 'Utilisateur connecte', user_id: result[0].id, tooken: token});
    majDb();
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erreur MySQL' });
  }
});

router.post('/register', async (req, res) => {
  console.log("je suis la ");
  const { name, password, email } = req.body;
  try {
    const find = User.findAll({ where: { mail: email } });
    if (find.length != 0) {
      return res.status(500).json({success: false, message: 'Email already used'});
    }
    console.log("av");
    const CrypPass = await bcrypt.hash(password, 10);

    const result = await User.create({name: name, password: CrypPass, mail: email, co: false, win: 0, total_part: 0});
    console.log("ID", result.insertId);
    res.status(201).json({success: true, message: 'Utilisateur ajouté', user_id: result.insertId});
    majDb();
  } catch (err) {
    console.error(err);
    res.status(500).json({success: false, message: 'Erreur MySQL' });
  }
});

router.post('/logout', async (req, res) => {
  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, secret);
    const result = await User.findAll({ where: { id: decoded.id } });
    if (result.length === 0)
        return res.status(500).json({success: false, message: 'User not find'});
    await result[0].update({co: false});
    await Co.destroy({ where: { userId: decoded.id } });
    res.clearCookie('token');
    res.status(201).json({ success: true, message: 'Utilisateur deconnecte' });
    
    majDb();
  } catch (err) {function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}
    console.error(err);
    res.status(500).json({ success: false, message: 'Erreur MySQL' });
  }
});

router.post('/click', async (req, res) => {
  try {
    console.log("dans click");
    console.log(req.body);
    const token = req.cookies.token;
    const decoded = jwt.verify(token, secret);
    const result = await User.findAll({ where: { id: decoded.id } });
    if (result.length === 0)
        return res.status(500).json({success: false, message: 'ERROR USER NOT FOUND'});
    const instantclicks = result[0].total_part;
    // console.log("instantclicks :", instantclicks);
    await result[0].update({total_part: instantclicks + 1});
    majDb();
    res.status(201).json({ success: true, message: 'Click recu', clicks: instantclicks + 1 });
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erreur MySQL' });
  }
});

router.get('/nclick', async (req, res) => {
  try {
    // console.log("dans nclick");
    const token = req.cookies.token;
    const decoded = jwt.verify(token, secret);
    const result = await User.findAll({ where: { id: decoded.id } });
    if (result.length === 0)
        return res.status(500).json({success: false, message: 'ERROR USER NOT FOUND'});
    const instantclicks = result[0].total_part;
    // console.log("init CLICK", instantclicks);
    res.status(201).json({ success: true, message: 'Click recu', clicks: instantclicks });
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erreur MySQL' });
  }
});


router.post('/addpriv', async (req, res) => {
  try{
    const {tok2 , mess} = req.body;
    const tok1 = req.cookies.token;
    const id1 = jwt.verify(tok1, secret);
    const id2 = jwt.verify(tok2, secret);
    const res1 = await User.findOne({ where: {id: id1.id}});
    const res2 = await User.findOne({ where: { id: id2.id}});
    if (res1 === 0 || res2 === 0)
      return res.status(500).json({success: false, message: 'ERROR USER NOT FOUND'});
    const findchat = await PrivChat.findOne({where :{ [Op.or]:[{id1: id1.id, id2: id2.id},{id1: id2.id, id2: id1.id} ]}});
    if (findchat === 0)
        findchat = await PrivChat.create({id1: id1.id, id2: id2.id});
    await PrivMess.create({idSend: id1.id, conv: mess, ChatId: findchat.id});
    res.status(201).json({success: true});
  }catch(err){
    res.status(500).json({success: false, message: err});
  }
});

// une route get pour recuperer une conversation a 2
// une route post pour metre a jour la conversation generale

router.get('/getchat', async (req, res) => {
  try {
    // console.log("dans nclick");
    const token = req.cookies.token;
    const decoded = jwt.verify(token, secret);
    const result = await User.findAll({ where: { id: decoded.id } });
    if (result.length === 0)
        return res.status(500).json({success: false, message: 'ERROR USER NOT FOUND'});
    const conv = await ChatG.findByPk(1);
    const ret = conv.contenu;
    res.status(201).json({ success: true, message: ret});
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erreur MySQL' });
  }
});

router.post('/welcome', async (req, res) => {
  // console.log("COOOOUUUUUUU_________________");
  res.status(201).json({ success: true, message: 'Bienvenue' });
});

export {secret}
export { checktok };
export default router;