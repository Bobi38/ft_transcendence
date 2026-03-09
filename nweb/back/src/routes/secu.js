import {fs, bcrypt, express, jwt, crypto, authenticator, nodemailer, secret, secret_tok_2fa } from './index.js';

import {User, PswEmail} from './index.js';

const router = express.Router();

router.get('/checkco', async(req, res) =>{
  console.log("dans checkco");
  res.status(201).json({success:true, message: "good token and good co"});
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

export default router;