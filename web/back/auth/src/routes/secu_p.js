import {bcrypt, express, jwt, crypto,  nodemailer, validator, secret } from './index_p.js';

import {User, PswEmail} from './index_p.js';

const router = express.Router();

router.get('/checkco', async(req, res) =>{
  try{
    let MPFA;
    console.log("dans checkco");
    const token = req.cookies.token;
    const decoded = jwt.verify(token, secret);
    const result = await User.findOne({ where: { id: decoded.id } });
    MPFA = result.MPFA;
    if (result.co == true)
      return res.status(200).json({success:true, message: "good token and good co", MPFA: MPFA, token: token});
    else
      return res.status(403).json({success: false, message: "not co completed", MPFA: MPFA});
}catch(err){
       return res.status(501).json({success: false, message: "error back /checkco " + err});
}
})

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
    await transporter.sendMail({
        from: "noreply.transc@gmail.com",
        to: result.mail,
        subject: "Votre code de connexion",
        text: `Votre code pour finalier votre connexion est : ${code}`
      });
    const CrypPass = await bcrypt.hash(code, 10);
    const check = await PswEmail.findOne({ where: { idUser: decoded.id, type: 1 } });
    if (check)
      await check.destroy();
    console.log("in /send_mail " + code + " " + CrypPass);
    await result.createCode({type: 1, Code : CrypPass, DateCreate: new Date()});  
    return res.status(201).json({success: true, message: "message send"});
  }catch(err){
    return res.status(500).json({success:false, message: "error" + err})
  }
})

router.post('/recupPswd', async (req, res) => {
  try{
    const {mail} = req.body;
    console.log("in recup " + mail);
    if (!validator.isEmail(mail)){
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }
    const result = await User.findOne({ where: { mail: mail } });
    if (!result)
      return res.status(401).json({success: false, message: "Cet email n'existe pas"});
    const code = crypto.randomInt(100000, 999999).toString();
    console.log("2")
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "noreply.transc@gmail.com",
        pass: "ykxu xqcc hokp zkfg"
      }});
        console.log("3")
    await transporter.sendMail({
        from: "noreply.transc@gmail.com",
        to: result.mail,
        subject: "Votre code de connexion",
        text: `Votre code pour changer de mot de passe est : ${code}`
      });

    const CrypPass = await bcrypt.hash(code, 10);
    const check = await PswEmail.findOne({ where: { idUser: mail, type: 2 } });
    if (check)
      await check.destroy();

    await result.createCode({type: 2, Code : CrypPass, DateCreate: new Date()});
    console.log("enddd")  
    return res.status(201).json({success: true, message: "message send"});
  }catch(err){
    return res.status(500).json({success:false, message: "error" + err})
  }
})

router.post('/maila2f_check_code' , async (req, res) => {
  try{
    console.log("API /maila2f_check_code called")
    const {code, host} = req.body;
    if (!code || !host) {
      return res.status(400).json({ success: false, message: 'Missing fields' });
    }
    console.log("API /maila2f_check_code je suis dans verif")
    console.log(code);
    const token = req.cookies.token;
    const decoded = jwt.verify(token, secret);
    const result = await User.findOne({ where: { id: decoded.id }, include: {model: PswEmail, as: 'code' , where :{type: 1}} });
    console.log(result.code[0].Code)
    const limit = new Date(result.code[0].DateCreate.getTime() + 60 * 1000);
    const isValid = await bcrypt.compare(code, result.code[0].Code);
    console.log(limit);
    if (code && isValid == true && (new Date() < limit)){
      const co = result.code[0];
      await co.destroy();
      await result.update({co: true,Hostlastco: host, Datelastco: new Date()});
      return res.status(201).json({success: true, message:"good"});
    }
    else
      return res.status(400).json({success: true, message:"wrong code"})
  }catch(err){
    return res.status(500).json({success: false, message: "back check_code" + err});
  }
})

router.post('/recupPswd_check_code' , async (req, res) => {
  try{
    console.log("API /maila2f_check_code called")
    const {code, host, mail} = req.body;
    if (!code || !host) {
      return res.status(400).json({ success: false, message: 'Missing fields' });
    }
    console.log("API /maila2f_check_code je suis dans verif")
    console.log(code);
    const result = await User.findOne({ where: { mail: mail }, include: {model: PswEmail, as: 'code' , where :{type: 2}} });
    console.log(result.code[0].Code)
    const limit = new Date(result.code[0].DateCreate.getTime() + 60 * 1000);
    const isValid = await bcrypt.compare(code, result.code[0].Code);
    console.log(limit);
    if (code && isValid == true && (new Date() < limit)){
      const co = result.code[0];
      await co.destroy();
      await result.update({co: true,Hostlastco: host, Datelastco: new Date()});
      return res.status(201).json({success: true, message:"good"});
    }
    else
      return res.status(400).json({success: true, message:"wrong code"})
  }catch(err){
    return res.status(500).json({success: false, message: "back check_code" + err});
  }
})

router.post('/majPswd', async(req,res) => {
  try{
    const {new_pswd} = req.body;
    const token = req.cookies.token;
    if (!token)
      return res.status(400).json({success: false, message: "token invalid"});
    const decoded = jwt.verify(token, secret);
    const result = await User.findOne({ where: { id: decoded.id } });
    if (!result){
      res.clearCookie('token');
      return res.status(400).json({success: false, message: "token invalid"});
    }
    console.log("data pass= ", data.Pass);
    if (data.Pass){
      const CrypPass = await bcrypt.hash(new_pswd, 10);
      await result.update({password: CrypPass});
      return res.status(201).json({success: true, message: "goog"});
    }
    return res.status(400).json({success: false, message: "Veuillez remplir la case (nouveau mot de passe)"});
  }catch(err){
    res.status(500).json({success: false, message: "error majpass ", err});
  }
})

export default router;