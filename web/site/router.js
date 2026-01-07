const express = require('express');
const router = express.Router();
const pool = require('./pool');
const jwt = require('jsonwebtoken');
const coockieParser = require('cookie-parser');
const User  = require('./models/user.js');
const Co  = require('./models/connect.js');

router.use(coockieParser());
const secret = 'bobi';

router.use((req, res, next) => {
  console.log('Vérification du token');
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
    const result = User.findAll({ where: { mail: email } });
    if (result.length === 0)
        return res.status(500).json({success: false, message: 'Email not find'});
    if (result[0].password != password)
        return res.status(500).json({success: false, message: 'Password not valid'});
    const token = jwt.sign(result[0], secret, {expiresIn: '12h'});
    const re = await Co.create({token: token, userId: result[0].id});
    await result[0].update({co: true});
    res.cookie('token', token, { httpOnly: true, secure: true, maxAge: 12 * 60 * 60 * 1000 });
    res.status(201).json({  success : true , message: 'Utilisateur connecte', user_id: result[0].id});
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
    const result = await User.create({name: name, password: password, mail: email, co: true, win: 0, total_part: 0});
    const token = jwt.sign({id: result.insertId, name: name, mail: email}, secret, {expiresIn: '12h'});
    res.cookie('token', token, { httpOnly: true, secure: true, maxAge: 12 * 60 * 60 * 1000 });
    res.status(201).json({success: true, message: 'Utilisateur ajouté', user_id: result.insertId});
  } catch (err) {
    console.error(err);
    res.status(500).json({success: false, message: 'Erreur MySQL' });
  }
});

router.post('/welcome', async (req, res) => {
  console.log("dans welcome");
  console.log(req.cookies);
  res.status(201).json({ success: true, message: 'Bienvenue' });
});

module.exports = router;