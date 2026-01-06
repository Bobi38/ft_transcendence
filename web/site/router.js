const express = require('express');
const router = express.Router();
const pool = require('./pool');
const jwt = require('jsonwebtoken');
const coockieParser = require('cookie-parser');

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
    const [result] = await pool.execute(
      'SELECT * FROM user_co WHERE mail = ?',
      [email]
    );

    if (result.length === 0)
        return res.status(500).json({success: false, message: 'Email not find'});
    // console.log("result[0] =", result[0].mail + " " + result[0].password);

    if (result[0].password != password)
        return res.status(500).json({success: false, message: 'Password not valid'});
    const token = jwt.sign(result[0], secret, {expiresIn: '12h'});
    console.log("token =", token);
    res.cookie('token', token, { httpOnly: true, secure: true, maxAge: 12 * 60 * 60 * 1000 });
    res.status(201).json({  success : true , message: 'Utilisateur connecte', user_id: result[0].id});
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erreur MySQL' });
  }
});

router.post('/register', async (req, res) => {
  console.log("je suis la ");
//   console.log(req.body);
  const { name, password, email } = req.body;
  try {
    const [find] = await pool.execute(
      'SELECT * FROM user_co WHERE mail = ?',
      [email]
    );
    if (find.length > 0) {
      return res.status(500).json({success: false, message: 'Email already used'});
    }
    const [result] = await pool.execute(
      'INSERT INTO user_co (name, password, mail, win, total_part) VALUES (?, ?, ?, ?, ?)',
      [name, password, email, 0, 0]
    );
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