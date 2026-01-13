import express from 'express';
import bcrypt from 'bcrypt';
const router = express.Router();
import pool from '../pool.js';
import jwt from 'jsonwebtoken';
import coockieParser from 'cookie-parser';
import User  from '../models/user.js';
import Co  from '../models/connect.js';
import {majDb}  from '../fct.js';
import os from 'os';


router.use(coockieParser());
const location = os.networkInterfaces().eth0 ? os.networkInterfaces().eth0.find(details => details.family === 'IPv4') : {hostname: 'localhost'};
const secret = location.address;

// function checktok()

router.use((req, res, next) => {
  console.log('check token');
  if (req.path === '/login' || req.path === '/register') {
    return next();
  }
  try {
    const token = req.cookies.token;
    if (token)
      jwt.verify(token, secret);
    next();
  }catch (err) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
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
      console.log(result[0].id," avant token");
    const token = jwt.sign({id: result[0].id}, secret, {expiresIn: '12h'});
    console.log("apres token");
    const re = await Co.create({token: token, userId: result[0].id});
    await result[0].update({co: true});
    console.log("ID", result[0].id);
    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 12 * 60 * 60 * 1000 });
    res.status(201).json({  success : true , message: 'Utilisateur connecte', user_id: result[0].id});
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
    if (find.length > 0) {
      return res.status(500).json({success: false, message: 'Email already used'});
    }
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
  } catch (err) {
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
    console.log("instantclicks :", instantclicks);
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
    console.log("dans nclick");
    const token = req.cookies.token;
    const decoded = jwt.verify(token, secret);
    const result = await User.findAll({ where: { id: decoded.id } });
    if (result.length === 0)
        return res.status(500).json({success: false, message: 'ERROR USER NOT FOUND'});
    const instantclicks = result[0].total_part;
    console.log("init CLICK", instantclicks);
    res.status(201).json({ success: true, message: 'Click recu', clicks: instantclicks });
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erreur MySQL' });
  }
});


router.post('/welcome', async (req, res) => {
  console.log("dans welcome");
  console.log(req.cookies);
  res.status(201).json({ success: true, message: 'Bienvenue' });
});

export default router;