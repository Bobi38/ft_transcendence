
import 
{
  User,
  Co,
  // ChatG
  // PrivMess,
  // PrivChat,
  // Friend,
  // PswEmail,
  // StatMorp,
  // GameMorp,
  // HistoryMorp,
}from './index.js'

import { bcrypt, jwt, express, secret } from './index.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  console.log("je suis dans login")
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

router.get('/logout', async (req, res) => {
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

export default router;