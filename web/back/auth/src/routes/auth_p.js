
import 
{
  User,
  Co,
}from './index_p.js'

import { bcrypt, jwt, express, validator, secret, tcheck_MPFA} from './index_p.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  console.log("je suis dans la nouvelle route login")
  const { email, password, host } = req.body;

  try {
    console.log("Api /login called");
    if (!email || !password || !host) {
      return res.status(400).json({ success: false, message: 'Missing fields' });
    }
    if (!validator.isEmail(email)){
      console.log("Api /login called Invalid email format",email);
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }
    const result = await User.findAll({ where: { mail: email } });
    if (result.length === 0)
        return res.status(401).json({success: false, message: 'Email not found'});
    const DecrypPass = await bcrypt.compare(password, result[0].password);
    if (!DecrypPass)
        return res.status(401).json({success: false, message: 'Password not valid'});
    const iid = await Co.findAll({where: { userId: result[0].id}})
      console.log("Api /login " + result[0].id," avant token");
    const token = jwt.sign({id: result[0].id}, secret, {expiresIn: '12h'});
    console.log("Api /login apres token");
    if (iid.length === 0)
      await Co.create({token: token, userId: result[0].id});
    console.log(result[0].Hostlastco + " " + host)
    console.log(result[0].Datelastco)
    let MPFA;
    MPFA = tcheck_MPFA(result[0], host);
    console.log("MPFA " + MPFA);
    await result[0].update({MPFA: MPFA});
    await result[0].update({co: true,Hostlastco: host, Datelastco: new Date()});
    res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'lax', maxAge: 12 * 60 * 60 * 1000 });
    res.status(201).json({  success : true , message: 'User connected', token: token, username: result[0].name, MPFA: MPFA });
  } catch (err) {
    //console.error(err);
    res.status(500).json({ success: false, message: 'MySQL error', err});
  }
});


router.post('/register', async (req, res) => {
    console.log("Api /register called");
    const { name, password, email } = req.body;
    try {
      if (!name || !password || !email) {
        return res.status(400).json({ success: false, message: 'Missing necessary field' });
      }
      if (!validator.isEmail(email)){
        return res.status(400).json({ success: false, message: "Le format de l'email est invalide" });
      }
      const find = await User.findAll({ where: { mail: email } });
      if (find.length != 0) {
        if (find[0].OAuth == true)
          return res.status(409).json({success: false, message: 'Email deja utilise via Github ou Gmail'});
        else
          return res.status(409).json({success: false, message: 'Email deja utilise'});
      }
        const nam = await User.findAll({where :{name: name}})
        if (nam.length != 0)
            return res.status(409).json({success: false, message: 'Nom deja utilise'})
        console.log("Api /register av");
        const CrypPass = await bcrypt.hash(password, 10);
        const result = await User.create({name: name, password: CrypPass, mail: email, co: false, win: 0, total_part: 0});
        console.log("Api /register ID", result.insertId);
        res.status(201).json({success: true, message: 'Utilisateur ajouté', user_id: result.insertId});
    } catch (err) {
        res.status(500).json({success: false, message: 'Erreur MySQL' + err });
    }
});

router.get('/logout', async (req, res) => {
  try {
    console.log("Api /logout called");
    const token = req.cookies.token;
    const decoded = jwt.verify(token, secret);
    const result = await User.findAll({ where: { id: decoded.id } });
    await result[0].update({co: false, MPFA: true});
    await Co.destroy({ where: { userId: decoded.id } });
    res.clearCookie('token');
    res.status(201).json({ success: true, message: 'Utilisateur deconnecte' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erreur MySQL' });
  }
});

export default router;