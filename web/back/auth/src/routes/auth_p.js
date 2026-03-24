
import 
{
  User,
  Co,
}from './index_p.js'

import { bcrypt, jwt, express, validator, secret} from './index_p.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  console.log("je suis dans la nouvelle route login")
  const { email, password, host } = req.body;

  try {
    console.log("Api /login called");
    if (!email || !password || !host) {
      return res.status(400).json({ success: false, message: 'Missing fields' });
    }
    // if (!validator.isEmail(email)){
    //   return res.status(400).json({ success: false, message: 'Invalid email format' });
    // }
    const result = await User.findAll({ where: { mail: email } });
    if (result.length === 0)
        return res.status(404).json({success: false, message: 'Email not find'});
    const DecrypPass = await bcrypt.compare(password, result[0].password);
    if (!DecrypPass)
        return res.status(404).json({success: false, message: 'Password not valid'});
    const iid = await Co.findAll({where: { userId: result[0].id}})
    // if (iid.length != 0)
    //     return res.status(500).json({success:false, message: 'User already log'});
      console.log("Api /login " + result[0].id," avant token");
    const token = jwt.sign({id: result[0].id}, secret, {expiresIn: '12h'});
    console.log("Api /login apres token");
    if (iid.length === 0)
      await Co.create({token: token, userId: result[0].id});
    console.log(result[0].Hostlastco + " " + host)
    console.log(result[0].Datelastco)
    // const now = new Date();
    // const limit = new Date(now.getTime() - 10 * 60 * 1000);
    let MPFA;
    // console.log(limit);
    // if (result[0].Hostlastco === null && result[0].Datelastco === null)
    //   MPFA = true;
    // else if (result[0].Hostlastco != host)
    //   MPFA = true;
    // else if (result[0].Hostlastco == host && result[0].Datelastco != null && (result[0].Datelastco < limit))
    //   MPFA = true;
    // else if (result[0].Hostlastco == host && result[0].Datelastco != null && (result[0].Datelastco > limit))
    //   MPFA = false;
    // else
    //   MPFA = true;
    // console.log(MPFA);
    // if (MPFA == false)
      await result[0].update({co: true,Hostlastco: host, Datelastco: new Date()});
    // req.session.username = result[0].name;
    // req.session.nameNeedUpdate = false;
    res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'lax', maxAge: 12 * 60 * 60 * 1000 });
    res.status(201).json({  success : true , message: 'Utilisateur connecte', token: token, username: result[0].name, MPFA: MPFA });
    // majDb();
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erreur MySQL' });
  }
});


router.post('/register', async (req, res) => {
    console.log("Api /register called");
    const { name, password, email } = req.body;
    try {
      console.log("1")
      if (!name || !password || !email) {
        return res.status(400).json({ success: false, message: 'Missing fields' });
      }
        const find = await User.findAll({ where: { mail: email } });
        if (find.length != 0) {
          if (find[0].OAuth == true)
            return res.status(409).json({success: false, message: 'Email already used with OAuth, try to login with GitHub'});
          else
            return res.status(409).json({success: false, message: 'Email already used'});
        }
        const nam = await User.findAll({where :{name: name}})
        if (nam.length != 0)
            return res.status(409).json({success: false, message: 'Name already used'})
        console.log("Api /register av");
        const CrypPass = await bcrypt.hash(password, 10);
        console.log("3")
        const result = await User.create({name: name, password: CrypPass, mail: email, co: false, win: 0, total_part: 0});
        console.log("Api /register ID", result.insertId);
        res.status(201).json({success: true, message: 'Utilisateur ajouté', user_id: result.insertId});
        // majDb();
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
    await result[0].update({co: false});
    await Co.destroy({ where: { userId: decoded.id } });
    res.clearCookie('token');
    res.status(201).json({ success: true, message: 'Utilisateur deconnecte' });
    
    // majDb();
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erreur MySQL' });
  }
});

export default router;