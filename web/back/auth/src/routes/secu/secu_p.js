import {bcrypt, express, jwt, crypto,  nodemailer, validator, secret } from '../index_p.js';

import {User, PswEmail} from '../index_p.js';

const router = express.Router();

router.get('/checkco', async(req, res) =>{
    try{
        let MPFA;
        console.log("API /api/secu/checkco");
        const token = req.cookies.token;
        const decoded = jwt.verify(token, secret);
        const result = await User.findOne({ where: { id: decoded.id } });
        MPFA = result.MPFA;
        console.log("API /api/secu/checkco " + MPFA + " co " + result.co);
        if (result.co == true && MPFA == false)
            return res.status(200).json({success: true, message: "token ok", MPFA: MPFA, token: token});
        else
            return res.status(403).json({success: false, message: "not co completed", MPFA: MPFA});
    }catch(err){
        return res.status(501).json({success: false, message: "error back /api/secu/checkco" + err});
    }
})

router.post('/send_mail', async (req, res) => {
    try{
        console.log("API /api/secu/send_mail");
        const token = req.cookies.token;
        const decoded = jwt.verify(token, secret);
        const result = await User.findOne({ where: { id: decoded.id } });
        const code = crypto.randomInt(100000, 999999).toString();
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: "noreply.transc@gmail.com",
              pass: "ykxu xqcc hokp zkfg"
            }
        });
        await transporter.sendMail({
            from: "noreply.transc@gmail.com",
            to: result.mail,
            subject: "Votre connection code",
            text: `Your code to finalize connection is : ${code}`
        });
        const CrypPass = await bcrypt.hash(code, 10);
        const check = await PswEmail.findOne({ where: { idUser: decoded.id, type: 1 } });
        if (check)
          await check.destroy();
        console.log("API /api/secu/send_mail " + code + " " + CrypPass);
        await result.createCode({type: 1, Code : CrypPass, DateCreate: new Date()});  
        return res.status(201).json({success: true, message: "message sent"});
    }catch(err){
        return res.status(500).json({success:false, message: "error" + err})
    }
})

router.post('/recovery/password', async (req, res) => {
    try{
        const {mail} = req.body;
        console.log("API /api/secu/recupPswd " + mail);
        if (!validator.isEmail(mail)){
            return res.status(400).json({ success: false, message: 'Invalid email format' });
        }
        const result = await User.findOne({ where: { mail: mail } });
        if (!result)
            return res.status(401).json({success: false, message: "This email address does not exist"});
        const code = crypto.randomInt(100000, 999999).toString();
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "noreply.transc@gmail.com",
                pass: "ykxu xqcc hokp zkfg"
            }
        });
        await transporter.sendMail({
            from: "noreply.transc@gmail.com",
            to: result.mail,
            subject: "Your connection code",
            text: `Your code to finalize connection is : ${code}`
        });
        console.log("API /api/secu/recupPswd " + code);
        const CrypPass = await bcrypt.hash(code, 10);
        const check = await PswEmail.findOne({ where: { idUser: mail, type: 2 } });
        if (check)
          await check.destroy();
        await result.createCode({type: 2, Code : CrypPass, DateCreate: new Date()});
        const token = jwt.sign({id: result.id}, secret, {expiresIn: '12h'});
        res.cookie('ChgPSWD', token, { httpOnly: true, secure: false, sameSite: 'lax', maxAge: 12 * 60 * 60 * 1000 });
        return res.status(201).json({success: true, message: "message sent"});
    }catch(err){
        return res.status(500).json({success:false, message: "error" + err})
    }
})

router.post('/maila2f_check_code' , async (req, res) => {
  try{
      console.log("API /api/secu/maila2f_check_code called")
      const {code, host} = req.body;
      if (!code || !host) {
          return res.status(400).json({ success: false, message: 'Missing fields' });
      }
      console.log("API /api/secu/maila2f_check_code je suis dans verif")
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
          await result.update({co: true,MPFA: false,Hostlastco: host, Datelastco: new Date()});
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
      const {code, host} = req.body;
      if (!code || !host) {
          return res.status(400).json({ success: false, message: 'Missing fields' });
      }
      console.log("API /maila2f_check_code je suis dans verif")
      console.log(code);
      const token = req.cookies.ChgPSWD;
      const decoded = jwt.verify(token, secret);
      const result = await User.findOne({ where: { id: decoded.id }, include: {model: PswEmail, as: 'code' , where :{type: 2}} });
      console.log(result.code[0].Code)
      const limit = new Date(result.code[0].DateCreate.getTime() + 60 * 1000);
      const isValid = await bcrypt.compare(code, result.code[0].Code);
      console.log(isValid);
      console.log(limit);
      if (code && isValid == true && (new Date() < limit)){
          const co = result.code[0];
          await co.destroy();
          return res.status(201).json({success: true, message:"good"});
      }
      else
          return res.status(400).json({success: true, message:"wrong code"})
    }catch(err){
        return res.status(500).json({success: false, message: "back check_code" + err});
    }
})

router.put('/majPswd', async(req,res) => {
    try{
        const new_psd = req.body.new_psd;
        const token = req.cookies.ChgPSWD;
        if (!token)
            return res.status(400).json({success: false, message: "token invalid"});
        const decoded = jwt.verify(token, secret);
        const result = await User.findOne({ where: { id: decoded.id } });
        if (!result){
            res.clearCookie('ChgPSWD');
            return res.status(400).json({success: false, message: "token invalid"});
        }
        console.log("data pass= ", new_psd);
        if (new_psd){
            const CrypPass = await bcrypt.hash(new_psd, 10);
            await result.update({password: CrypPass});
            console.log(result);
            res.clearCookie('ChgPSWD');
            return res.status(201).json({success: true, message: "good"});
        }
        return res.status(400).json({success: false, message: "Please fill the field (new password)"});
    }catch(err){
        res.status(500).json({success: false, message: "error majpass " + err});
    }
})

router.delete('/cookie', async(req, res) => {
    try{
        if (!req.cookies.ChgPSWD)
            return res.status(400).json({success: false, message: "token invalid"});
        res.clearCookie('ChgPSWD');
        return res.status(200).json({success: true, message: "cookie cleared"});
    }catch(err){
        return res.status(500).json({success: false, message: "error clearcookie " + err});
    }
})

export default router;