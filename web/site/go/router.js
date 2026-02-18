import express from 'express';
import bcrypt from 'bcrypt';
import fs from 'fs';
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
import session from 'express-session';
import QRCode from 'qrcode';
import {authenticator} from 'otplib';
import nodemailer from "nodemailer";
import crypto from "crypto";
import { TiMediaPlayReverse } from 'react-icons/ti';
import validator from 'validator';
import { isValidPhoneNumber } from 'libphonenumber-js';


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

router.get('/sendmail', async (req, res) => {
  try{
    console.log("JE SUIS DEDANS");
    const code = crypto.randomInt(100000, 999999).toString();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "noreply.transc@gmail.com",
        pass: "ykxu xqcc hokp zkfg"
      }});
    await transporter.sendMail({
        from: "noreply.transc@gmail.com",
        to: "voisin.titou@gmail.com",
        subject: "Votre code de connexion",
        text: `Votre code est : ${code}`
      });
    const token = req.cookies.token;
    const decoded = jwt.verify(token, secret);
    const result = await User.findOne({ where: { id: decoded.id } });
    await result.update({password_2FA: code, password_2FA_time: new Date(Date.now() + 60 * 1000)});
    return res.status(201).json({success: true, message: "message send"});
  }catch(err){
    return res.status(500).json({success:false, message: "error" + err})
  }
})

router.post("/verifCode" , async (req, res) => {
  try{
    console.log("coucou")
    const {code} = req.body;
    console.log("je suis dans verif")
    console.log(code);
    const token = req.cookies.token;
    const decoded = jwt.verify(token, secret);
    const result = await User.findOne({ where: { id: decoded.id } });
    console.log(result.password_2FA)
    if (code && code === result.password_2FA && new Date() < result.password_2FA_time){
      await result.update({password_2FA: null, password_2FA_time: null});
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
    console.log("dans update profil", user);
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
  console.log("je suis la ");
  const { name, password, email } = req.body;
  try {
    const find = await User.findAll({ where: { mail: email } });
    if (find.length != 0) {
      if (find[0].OAuth == true)
        return res.status(500).json({success: false, message: 'Email already used with OAuth, try to login with GitHub'});
      else
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
    console.log("dans logout");
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

router.get('/getpriv', async (req, res) => {
  try{
    const {tok2} = req.body;
    const tok1 = req.cookies.token;
    const id1 = jwt.verify(tok1, secret);
    const id2 = jwt.verify(tok2, secret);
    const res2 = await User.findOne({ where: { id: id2.id}});
    if (res2 === 0)
      return res.status(500).json({success: false, message: 'ERROR USER NOT FOUND'});
    const findchat = await PrivChat.findOne({where :{ [Op.or]:[{id1: id1.id, id2: id2.id},{id1: id2.id, id2: id1.id} ]}});
    if (findchat === 0)
        return res.status(500).json({success: false, message: 'ERROR CONV NOT FOUND'});
    const conv = await PrivMess.findAll({order:[['id', 'DESC']], limit: 30, where:{chatid: findchat.id}});
    const ret = maj_conv(id1.id, conv);
    res.status(201).json({success: true, message: ret});
  }catch(err){
    res.status(500).json({success: false, message: err});
  }
})


router.post('/addchat', async (req, res) => {
  try{
    console.log("JE SUIS DANS ADDDDCHAT");
    const chat = req.body;
    if (chat.send == "")
      res.status(201)({success: true});
    const tok = req.cookies.token
    const id = jwt.verify(tok, secret);
    console.log (id.id, " " , chat.message);
    await ChatG.create({contenu: chat.message, SenderId: id.id, time: chat.timer });
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

// router.get('/getchat', async (req, res) => {
//   try {
//     console.log("dans GETCHAT-----");
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



router.get('/getchat', async (req, res) => {
  try {
    console.log("dans GETCHAT-----");
    const token = req.cookies.token;
    const decoded = jwt.verify(token, secret);
    const result = await User.findAll({ where: { id: decoded.id } });
    if (result.length === 0)
        return res.status(500).json({success: false, message: 'ERROR USER NOT FOUND'});
    const conv = await ChatG.findAll({order:[['id', 'DESC']], limit: 30});
    const name = await User.findAll({attributes: ['id', 'name'], where: {co: true}});
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