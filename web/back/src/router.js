import express from 'express';
import bcrypt from 'bcrypt';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import coockieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from "nodemailer";
import crypto from "crypto";
import validator from 'validator';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { Op, where } from "sequelize";
import os from 'os';
import session from 'express-session';
import QRCode from 'qrcode';
import {authenticator} from 'otplib';
import { error, time } from 'console';

import pool from './pool.js';
import {majDb}  from './fct.js';

import User  from './models/user.js';
import Co  from './models/connect.js';
import ChatG from './models/test.js';
import PrivMess from './models/privmess.js';
import PrivChat from './models/privchat.js';
import Friend from './models/friend.js';
import PswEmail from './models/PssWrdEmail.js';
import StatMorp from './models/StatMorp.js';
import GameMorp from './models/GameMorp.js';


const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.use(coockieParser());
// const location = os.networkInterfaces().eth0 ? os.networkInterfaces().eth0.find(details => details.family === 'IPv4') : {hostname: 'localhost'};
// const secret = location.address;
const secret = fs.readFileSync('/run/secrets/cle_pswd', 'utf-8').trim();
const secret_chat = fs.readFileSync('/run/secrets/cle_chat', 'utf-8').trim();
const secret_tok_2fa = "toto";


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

function maj_conv(id, conv, namelst){
  const  tableau = [];

  for (let i = conv.length - 1; i >= 0; i--) {
    let name;
    let monMs;
    if (conv[i].SenderId == id){
      name = "me";
      monMs = true;
    }
    else{
      console.log("namelst ", namelst.length);
      const user = namelst.find(u => u.id === conv[i].SenderId);
      name = user ? user.name : "unknown";
      monMs = false;
    }
    tableau.push({monMsg: monMs, message: conv[i].contenu, login: name, timer: conv[i].time})
  }
  return tableau;
};

router.use(async (req, res, next) => {
  const token = req.cookies.token;
  console.log("Middleware auth for path:", req.path);
  if (!token && req.path !== '/' && req.path !== '/login' && req.path !== '/register' && req.path !== '/github' && req.path !== '/github/callback') {
    return res.status(401).json({ success: false, redirect: true});
  }
  if (req.path === '/' || req.path === '/login' || req.path === '/register' || req.path === '/github' || req.path === '/github/callback') {
    console.log("Public route, no auth required");
    return next() ;
  }
  const valid = await checktok(token);
  if (valid === 1) {
    console.log("token not valid");
    res.clearCookie('token');
    return res.status(401).json({ success: false, redirect: true});
  }

  console.log("token valid");
  next();
});

function CheckName(req, res, next){
  console.log("je suis dan middel checkname");
  if (req.session.nameNeedUpdate)
      return res.status(201).json({success: true, message: req.session.username});
  next();
}

router.get('/send_mail', async (req, res) => {
  try{
    const token = req.cookies.token;
    const decoded = jwt.verify(token, secret);
    const result = await User.findOne({ where: { id: decoded.id } });
    console.log("JE SUIS DEDANS");
    const code = crypto.randomInt(100000, 999999).toString();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "noreply.transc@gmail.com",
        pass: "ykxu xqcc hokp zkfg"
      }});
    await transporter.send_mail({
        from: "noreply.transc@gmail.com",
        to: result.mail,
        subject: "Votre code de connexion",
        text: `Votre code pour finalier votre connexion est : ${code}`
      });
    const CrypPass = await bcrypt.hash(code, 10);
    const check = await PswEmail.findOne({ where: { idUser: decoded.id, type: 1 } });
    if (check)
      await check.destroy();
    await result.createCode({type: 1, Code : CrypPass, DateCreate: new Date()});  
    return res.status(201).json({success: true, message: "message send"});
  }catch(err){
    return res.status(500).json({success:false, message: "error" + err})
  }
})

router.get('/recupPswd', async (req, res) => {
  try{
    const token = req.cookies.token;
    const decoded = jwt.verify(token, secret);
    const result = await User.findOne({ where: { id: decoded.id } });
    const code = crypto.randomInt(100000, 999999).toString();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "noreply.transc@gmail.com",
        pass: "ykxu xqcc hokp zkfg"
      }});
    await transporter.send_mail({
        from: "noreply.transc@gmail.com",
        to: result.mail,
        subject: "Votre code de connexion",
        text: `Votre code pour finalier votre connexion est : ${code}`
      });
    const CrypPass = await bcrypt.hash(code, 10);
    const check = await PswEmail.findOne({ where: { idUser: decoded.id, type: 2 } });
    if (check)
      await check.destroy();
    await result.createCode({type: 2, Code : CrypPass, DateCreate: new Date()});  
    return res.status(201).json({success: true, message: "message send"});
  }catch(err){
    return res.status(500).json({success:false, message: "error" + err})
  }
})

router.post("/maila2f_check_code" , async (req, res) => {
  try{
    console.log("API /maila2f_check_code called")
    const {code} = req.body;
    console.log("API /maila2f_check_code je suis dans verif")
    console.log(code);
    const token = req.cookies.token;
    const decoded = jwt.verify(token, secret);
    const result = await User.findOne({ where: { id: decoded.id }, include: {model: PswEmail, as: 'code' , where :{type: 1}} });
    console.log(result.code.Code)
    if (code && code === result.code.Code && new Date() < result.code.DateCreate + 60 * 1000){
      const co = await result.getCode({where: {type: 1}});
      await co.destroy();
      return res.status(201).json({success: true, message:"good"});
    }
    else
      return res.status(500).json({success: true, message:"wrong"})
  }catch(err){
    return res.status(500).json({success: false, message: err});
  }
})

// router.get('/qrimage', async(req, res) => {
//   try{
//     const token = req.cookies.token;
//     const decoded = jwt.verify(token, secret);
//     const result = await User.findAll({ where: { id: decoded.id } });
//     const secret_qr = authenticator.generateSecret();
//     const otpauth = authenticator.keyuri(decoded.id, 'Try 2FA', secret_qr);
//     const image = await QRCode.toDataURL(otpauth);
//     console.log("otpauth ", otpauth);
//     res.status(201).json({success: true, message: image});
//   }
//   catch(err){
//   res.status(500).json({success: false, message: err});
//   }
// });

// router.post('/valide2FA', async(req,res) => {
//   try{
//     const { code } = req.body;
//     const 
//   }
// } )


router.get('/getname', CheckName, async(req, res) =>{
  try{
    const token = req.cookies.token;
    const decoded = jwt.verify(token, secret);
    const result = await User.findAll({ where: { id: decoded.id } });
    result[0].name = req.session.username;
    req.session.nameNeedUpdate = false;
    res.status(201).json({success: true, name: result[0].name});
  }catch(err){
    res.status(501).json({success: false, message: 'Err mysql getname'});
  }
});

router.get('/checkco', async(req, res) =>{
  console.log("dans checkco");
  res.status(201).json({success:true, message: "good token and good co"});
})

router.get('/profile', async(req, res) =>{
  try{
    const token = req.cookies.token;
    const decoded = jwt.verify(token, secret);
    const result = await User.findOne({ where: { id: decoded.id } });
    const data ={
      login: result.name,
      login42: result.Log42,
      email: result.mail,
      tel: result.phoneNumber,
      location: result.adress
    }
    res.status(201).json({success: true, message: data});
  }catch(err){
    res.status(501).json({success: false, message: 'Err mysql getname'});
  }
});

router.post('/updateProfil', async(req, res) => {
  try{
    const user = req.body
    console.log("API /updateProfil dans update profil", user);
    const token = req.cookies.token;
    const decoded = jwt.verify(token, secret);
    const result = await User.findOne({ where: { id: decoded.id } });
    console.log(user.email)
    if (validator.isEmail(user.email)){
      console.log("email valid");
      await result.update({mail: user.email})
    }
    if (isValidPhoneNumber(user.tel)){
        console.log("phone number valid");
      await result.update({phoneNumber: user.tel})
    }
    console.log()
    if (user.login && user.login.length < 128){
      console.log("login good");
      await result.update({name: user.login})
    }
    if (user.login42 && user.login42.length < 128){
      console.log("login42 valid");
      await result.update({Log42: user.login42});
    }
    if (user.location && user.location.length < 256){
      console.log("adress good");
      await result.update({adress: user.location});
    }
    res.status(201).json({success: true, message: "good"})
  }catch(err){
    res.status(500).json({success: false, message: "error updateProfil " , err});
  }
});

router.post('/majPass', async(req,res) => {
  try{
    const data = req.body;
    const token = req.cookies.token;
    const decoded = jwt.verify(token, secret);
    const result = await User.findOne({ where: { id: decoded.id } });
    console.log("data pass= ", data.Pass);
    if (data.Pass){
      const CrypPass = await bcrypt.hash(data.Pass, 10);
      await result.update({password: CrypPass});
      return res.status(201).json({success: true, message: "goog"});
    }
    return res.status(500).json({success: false, message: "password empty"});
  }catch(err){
    res.status(500).json({success: false, message: "error majpass ", err});
  }
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("Api /login called");
    const result = await User.findAll({ where: { mail: email } });
    if (result.length === 0)
        return res.status(500).json({success: false, message: 'Email not find'});
    const DecrypPass = await bcrypt.compare(password, result[0].password);
    if (!DecrypPass)
        return res.status(500).json({success: false, message: 'Password not valid'});
    const iid = await Co.findAll({where: { userId: result[0].id}})
    // if (iid.length != 0)
    //     return res.status(500).json({success:false, message: 'User already log'});
      console.log("Api /login " + result[0].id," avant token");
    const token = jwt.sign({id: result[0].id}, secret, {expiresIn: '12h'});
    console.log("Api /login " + "apres token");
    if (iid.length === 0)
      await Co.create({token: token, userId: result[0].id});
    console.log("Api /login " + "TAILLE= " , Co.length);
    await result[0].update({co: true});
    console.log("Api /login " + "ID", result[0].id);
    req.session.username = result[0].name;
    req.session.nameNeedUpdate = false;
    res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'lax', maxAge: 12 * 60 * 60 * 1000 });
    res.status(201).json({  success : true , message: 'Utilisateur connecte', user_id: result[0].id, tooken: token});
    majDb();
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erreur MySQL' });
  }
});


router.post('/register', async (req, res) => {
    console.log("Api /register called");
  const { name, password, email } = req.body;
  try {
    const find = await User.findAll({ where: { mail: email } });
    if (find.length != 0) {
      if (find[0].OAuth == true)
        return res.status(500).json({success: false, message: 'Email already used with OAuth, try to login with GitHub'});
      else
        return res.status(500).json({success: false, message: 'Email already used'});
    }
    console.log("Api /register av");
    const CrypPass = await bcrypt.hash(password, 10);

    const result = await User.create({name: name, password: CrypPass, mail: email, co: false, win: 0, total_part: 0});
    console.log("Api /register ID", result.insertId);
    res.status(201).json({success: true, message: 'Utilisateur ajouté', user_id: result.insertId});
    majDb();
  } catch (err) {
    console.error(err);
    res.status(500).json({success: false, message: 'Erreur MySQL' });
  }
});

router.post('/logout', async (req, res) => {
  try {
    console.log("Api /logout called");
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
    console.log("Api /click called");
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
    // console.log("Api /nclick called");
    const token = req.cookies.token;
    const decoded = jwt.verify(token, secret);
    const result = await User.findAll({ where: { id: decoded.id } });
    if (result.length === 0)
        return res.status(500).json({success: false, message: 'ERROR USER NOT FOUND'});
    const instantclicks = result[0].total_part;
    // console.log("Api /nclick init", instantclicks);
    res.status(201).json({ success: true, message: 'Click recu', clicks: instantclicks });
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erreur MySQL' });
  }
});


router.post('/add_message_private', async (req, res) => {
  try{
	console.log("in add 1");
    const data = req.body;
    const tok1 = req.cookies.token;
    const id1 = jwt.verify(tok1, secret);
    const res1 = await User.findOne({ where: {id: id1.id}});
    const id2 = await User.findOne({ where: { name: data.id}});
	console.log("in add 2");
    if (res1 === 0 || id2 === 0)
      return res.status(500).json({success: false, message: 'ERROR USER NOT FOUND'});
    let findchat = await PrivChat.findOne({where :{ [Op.or]:[{id1: id1.id, id2: id2.id},{id1: id2.id, id2: id1.id} ]}});
    if (findchat === 0)
        findchat = await PrivChat.create({id1: id1.id, id2: id2.id});
	console.log("in add 3");
	console.log("dATA ", data.message, id1.id, findchat.id, data.time);
    await PrivMess.create({SenderId: id1.id, contenu: data.message, ChatId: findchat.id, time: data.time});
	console.log("GOOOOOD");
    res.status(201).json({success: true});
  }catch(err){
    res.status(500).json({success: false, message: err});
  }
});

router.post('/get_chat_private', async (req, res) => {
    try{
        const {token} = req.body;
        const my_token = req.cookies.token;
        const id1 = jwt.verify(my_token, secret);
        const id2 = await User.findOne({ where: { name: token}});
        if (id2 === 0)
            return res.status(500).json({success: false, message: 'ERROR USER NOT FOUND'});
        const findchat = await PrivChat.findOne({where :{ [Op.or]:[{id1: id1.id, id2: id2.id},{id1: id2.id, id2: id1.id} ]}});
        if (findchat === 0)
            return res.status(500).json({success: false, message: 'ERROR CONV NOT FOUND'});
        const conv = await PrivMess.findAll({order:[['id', 'DESC']], limit: 30, where:{chatid: findchat.id}});
        const name = await User.findAll({attributes: ['id', 'name'], where: {id: id2.id}});
        let ret = "";
        if (conv.length - 1 != 0)
            ret = maj_conv(id1.id, conv, name);
        res.status(201).json({success: true, message: ret});
    }catch(err){
        res.status(500).json({success: false, message: err});
    }
})


router.post('/add_message_global', async (req, res) => {
  try{
    console.log("Api /add_message_global called");
    const chat = req.body;
    if (chat.send == "")
      res.status(201)({success: true});
    const tok = req.cookies.token
    const id = jwt.verify(tok, secret);
    console.log (id.id, " " , chat.message);
    await ChatG.create({contenu: chat.message, SenderId: id.id, time: chat.time });
    console.log("buuuuug");
    // console.log('chat= ', chat);
    // const achat = await ChatG.findByPk(1);
    // console.log('before----' , achat.contenu);
    // let n = achat.contenu || '';
    // n += chat.message + '\n';
    // achat.contenu = n;
    // await achat.save();
    // console.log('mise a jour good');
    // const bchat = await ChatG.findByPk(1);
    // console.log('after----', bchat.contenu);
    return res.status(201).json({success: true});
  }catch(err){
    return res.status(501).json({success: false, message: err});
  }
})

// router.get('/get_chat_global', async (req, res) => {
//   try {
//     console.log("dans get_chat_global-----");
//     const token = req.cookies.token;
//     const decoded = jwt.verify(token, secret);
//     const result = await User.findAll({ where: { id: decoded.id } });
//     if (result.length === 0)
//         return res.status(500).json({success: false, message: 'ERROR USER NOT FOUND'});
//     const conv = await ChatG.findByPk(1);
//     const ret = conv.contenu;
//     res.status(201).json({ success: true, message: ret});
//   }
//   catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: 'Erreur MySQL' });
//   }
// });



router.get('/get_chat_global', async (req, res) => {
  try {
    console.log("dans get_chat_global-----");
    const token = req.cookies.token;
    const decoded = jwt.verify(token, secret);
    const result = await User.findAll({ where: { id: decoded.id } });
    if (result.length === 0)
        return res.status(500).json({success: false, message: 'ERROR USER NOT FOUND'});
    const conv = await ChatG.findAll({order:[['id', 'DESC']], limit: 30});
    const name = await User.findAll({attributes: ['id', 'name']});
    let ret = "";
    console.log("conv ", conv.length);
    if (conv.length - 1 != 0)
      ret = maj_conv(result[0].id, conv, name);
    // console.log ("ret ", ret);
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

router.get('/github',  async (req, res) => {
  console.log("dans github");
  const clientiD = 'Ov23liKAY6PJhfRJ6mf8';
  const redirectUri = 'http://localhost:9000/api/github/callback';
  const githubAuthUrl = `https://github.com/login/oauth/authorize` + `?client_id=${clientiD}` +`&redirect_uri=${redirectUri}` +`&scope=user:email`;
  console.log("github auth url ", githubAuthUrl);
  res.redirect(githubAuthUrl);
});




router.get('/github/callback', async (req, res) => {
  const code = req.query.code; 
  console.log("je suis dams github callback");
  console.log("GitHub callback code:", code);

  const params = new URLSearchParams();
  params.append("client_id", 'Ov23liKAY6PJhfRJ6mf8');
  params.append("client_secret", '15e78a3fa1121b8d51fe7dd0c8bf512a88358289');
  params.append("code", code);


  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { "Accept": "application/json" },
    body: params,
  });

  // res.status(201).json({ success: true, message: 'Bienvenue copain' });
  const data = await response.json();
  const accessToken = data.access_token;
  console.log("GitHub access token:", accessToken);

  const userRes = await fetch("https://api.github.com/user", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const user = await userRes.json();
  console.log("GitHub user info:", user);
  const emailuse = await fetch ("https://api.github.com/user/emails", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const email = await emailuse.json();
  console.log("GitHub user email:", email);
  const result = await User.findAll({ where: { mail: email[0].email } });
  let token = "";
  if (result.length === 0) {
    const newUser = await User.create({name: user.login, password: null, mail: email[0].email, OAuth:true,  co: true, win: 0, total_part: 0});
    console.log("New user created:", newUser);
    token = jwt.sign({id: newUser.id}, secret, {expiresIn: '12h'});
    const re = await Co.create({token: token, userId: newUser.id});
  }
  else {
    await result[0].update({co: true});
    console.log("Existing user logged in:", result[0].name);
    token = jwt.sign({id: result[0].id}, secret, {expiresIn: '12h'});
    const re = await Co.create({token: token, userId: result[0].id});
  }
  res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'lax', maxAge: 12 * 60 * 60 * 1000 });
  res.redirect('http://localhost:5173');
});


router.get('/fetch_conv', async (req, res) => {
    console.log("API fetch_conv called")
    try{
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ success: false, message: "Token manquant" });
        const decoded = jwt.verify(token, secret);
        const result = await User.findOne({ where: { id: decoded.id } });
        if (!result) return res.status(404).json({ success: false, message: "Utilisateur introuvable" });
        
        console.log("rest   ", result.id);   
      const chats = await PrivChat.findAll({
        where: { [Op.or]: [{ id1: result.id }, { id2: result.id }] },
        attributes: ['id'], // On ne garde que l'ID du chat
        include: [
          { 
            model: User, 
            as: 'user1', 
            attributes: ['id', 'name', 'co'] 
          },
          { 
            model: User, 
            as: 'user2', 
            attributes: ['id', 'name', 'co'] 
          },
          {
            model: PrivMess,
            as: 'PrivMesses',
            attributes: ['contenu', 'time'], // On limite les champs du message
            limit: 1,
            order: [['id', 'DESC']]
          }
        ],
        order: [['id', 'DESC']]
      });

      // Nettoyage pour n'avoir qu'un objet plat par discussion
      const cleanChats = chats.map(chat => {
        const isUser1 = chat.user1.id === result.id;
        const interlocuteur = isUser1 ? chat.user2 : chat.user1;
        const lastMsg = chat.PrivMesses[0] || null;

        return {
          UserId: chat.id,
          login: interlocuteur.name,
          isOnline: interlocuteur.co,
          lastMessage: lastMsg ? lastMsg.contenu : '',
          time: lastMsg ? lastMsg.time : null
        };
      });
        // const chats = await PrivChat.findAll({where: {[Op.or]: [{ id1: result.id },{ id2: result.id }]},include: [  { model: User, as: 'user1', attributes: ['id', 'name', 'co'] },{ model: User, as: 'user2', attributes: ['id', 'name', 'co'] },{model: PrivMess,limit: 1,order: [['id', 'DESC']]}]});
        console.log("API fetch_conv chat 0.5 ", chats)
        console.log("API fetch_conv chat 1 ", chats[0].dataValues)
        console.log("API fetch_conv chat 1 ", chats[0].PrivMesses[0].contenu)
        console.log("API fetch_conv chat 2 ", chats[1].PrivMesses[0].contenu)
        console.log("API fetch_conv test join ", chats[0].user1.name);
        return res.status(201).json({success: true, message: cleanChats});
    }catch(err){
        console.log("API fetch_conv error: ",err);
        return res.status(500).json({success: false, message: err});
    }
});


//const result = await GameMorp.findAll({where: {[Op.or]: [{Player1: decoded.id}, {Player2: decoded.id}]}}, {limit: 5, offset: past, order:[['id', 'DESC']]})
router.get('/get_morpion_stat/:page', async (req, res) => {
    try{
        console.log("API get_morpion_stat(1) called");
        const page = parseInt(req.params.page) || -1;
        console.log("API get_morpion_stat(1) params ", page);
        // if (page == -1) throw error


// router.get('/get_morpion_stat', async (req, res) => {
        // const page = parseInt(req.query.page) || -1;
        // console.log("API get_morpion_stat(1) query ", page);
        // if (page == -1) throw error



        const token = req.cookies.token;
        const decoded = jwt.verify(token, secret);
        console.log("API get_morpion_stat(2)");
        const resultStats = await StatMorp.findOne({where: {idUser: decoded.id}});
        console.log("API get_morpion_stat(3)");
        // const resultHistory = await HistoryMorp.findAll({where: {[Op.or]: [{Id1: decoded.id}, {Id2: decoded.id}]}}, {limit: 5, offset: page - 1, order:[['id', 'DESC']]})
        // console.log("API get_morpion_stat(4)");
        const stat = {
            AllGame: resultStats.nbGame,
            AllWin: resultStats.Win,
            AllLost: resultStats.Lost,
            AllDraw: resultStats.Draw,
            AllAbort: resultStats.Abort,
            Diag:{
              Win: resultStats.WinDiag,
              Lost: resultStats.LostDiag,
            },
            Vert:{
              Win: resultStats.WinVert,
              Lost: resultStats.LostVert,
            },
            Horiz:{
              Win: resultStats.WinHoriz,
              Lost: resultStats.LostHoriz,
            },
            WinCroix: resultStats.WinCroix,
            WinCercle: resultStats.WinCercle,
            LostCroix: resultStats.LostCroix,
            LostCercle: resultStats.LostCercle,
        }
        console.log("API get_morpion_stat(5)");
        return res.status(201).json({success: true, stat_user: stat, history: undefined});

    }catch(err){
        return res.status(500).json({success: false, message: err });
    }
})


// router.get('/all_friend', async (req, res) => {
//   try{
//     const token = req.cookies.token;
//     const decoded = jwt.verify(token, secret);
//     console.log("1 f");
// //     const result = await User.findByPk(decoded.id, {
// //   include: [
// //     { model: User, as: 'Friends', through: { where: { State: true }, attributes: [] } },
// //     { model: User, as: 'FriendOf', through: { where: { State: true }, attributes: [] } }
// //   ]
// // });
// const result = await User.findAll({
// 					where: { id: decoded.id },
// 					include: [{
// 						model: User,
// 						as: 'Friends',els
// 						attributes: ['id', 'name', 'co'],
// 						through: { where: { State: true }, attributes: [] },
// 						required: false
//           },
// 					{
// 						model: User,
// 						as: 'FriendOf',
// 						attributes: ['id', 'name', 'co'],
// 						through: { where: { State: true }, attributes: [] },
// 						required: false
// 					},]});
//     console.log("2 f");
//     console.log("here ", result[0].Friends[0].name, result[0].FriendOf[0].name, result[0].FriendOf[0].co);
//     return res.status(201).json({success: true, message: result});
//   }catch(err){
//     return res.status(500).json({success: false, message: "err all_friend back ", err});
//   }
// })

router.get('/add_friend', async (req, res) => {
	try{
		const name = req.query.name;
		if (!name)
			return res.status(400).json({success: false, message: "no name"});

		const token = req.cookies.token;
  	const decoded = jwt.verify(token, secret);
		const result = await User.findOne({ where: { id: decoded.id } });

    const name_friend = await User.findOne({where: {name: name}});
		if (!name_friend)
			return res.status(404).json({success: false, message: undefined});

    const relation = await Friend.findAll({where: {[Op.or]: [{Friend1: result.id, Friend2: name_friend.id}, {Friend1: name_friend.id, Friend2: result.id}]}})
		if (relation.length > 0)
			return res.status(409).json({success: false, message: name});

    await Friend.create({Friend1: decoded.id, Friend2: name_friend.id, State: false, WhoAsk: decoded.id});
		return res.status(201).json({success: true});
	}catch(err){
		return res.status(500).json({success: false, message: "err back add_friend ", err});
	}
})

router.get('/dlt_friend', async (req, res) => {
	try{
		const name = parseInt(req.query.name) || null;
		if (!name)
			return res.status(400).json({success: false, message: "no name"});

		const token = req.cookies.token;
  	const decoded = jwt.verify(token, secret);
		const result = await User.findOne({ where: { id: decoded.id } });

    const name_friend = await User.findOne({where: {name: name}});
		if (!name_friend)
			return res.status(404).json({success: false, message: "exist"});

    const relation = await Friend.destroy({where: {[Op.or]: [{Friend1: result.id, Friend2: name_friend.id}, {Friend1: name_friend.id, Friend2: result.id}]}})
		if (relation === 0)
			return res.status(409).json({success: false, message: "relation"});

    return res.status(201).json({success: true});
	}catch(err){
		return res.status(500).json({success: false, message: "err back add_friend ", err});
	}
})

export {secret_chat};
export {secret};
export { checktok };
export default router;

/*
jsson{[
  login: "lzozo"
  message: "salut tout le monde c'est david la farge"
  monMsg: true
  timesamp: date..
  ],
}
*/

/* 
<div id={json.monMsg}>
  <div>json.login</div><div>json.timesamp</div> 
  <p>json.message</p>
</div>
*/

/*
adress
telephone
date de naissance
photo
*/

//rdata[0].