import {bcrypt, express, jwt, crypto,  errorHandler, validator, secret } from '../index_p.js';

import {User, PswEmail} from '../index_p.js';

const router = express.Router();

import SecuDTO from './secu.DTO.js';
import SecuService from './secu.service.js';

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
    const valid = SecuDTO.validateCookie(req, 'token');
    if (!valid.valid) {
        return errorHandler(valid.message, valid.code, res);
    }
    try{
        const result = await SecuService.send_mail(null, req, 1);
        if (!result.success) {
           return errorHandler(result.message, result.code, res);
        }
        return res.status(201).json({success: true, message: "message sent"});
    }catch(err){
        errorHandler("error" + err, 500, res);
    }
})


router.post('/recovery/password', async (req, res) => {
    const valid = SecuDTO.validateRecoveryPassword(req.body);
    if (!valid.valid) {
        return errorHandler(valid.message, valid.code, res);
    }
    try{
        const {mail} = req.body;
        const result = await SecuService.send_mail(mail, req, 2);
        if (!result.success) {
            return errorHandler(result.message, result.code, res);
        }
        return res.status(201).json({success: true, message: "message sent"});
    }catch(err){
        return errorHandler("error" + err, 500, res);
    }
})

router.post('/maila2f_check_code' , async (req, res) => {
    const valid = SecuDTO.validateMail2FA_CheckCode(req.body);
    if (!valid.valid) {
        return errorHandler(valid.message, valid.code, res);
    }
    const {code, host} = req.body;
    try{
        const result = SecuService.check_code(code, 'token', 1, host);
        if (!result.success) {
            return errorHandler(result.message, result.code, res);
        }
        return res.status(201).json({success: true, message: "good"});  
    }catch(err){
        return errorHandler("back check_code" + err, 500, res); 
    }
})

router.post('/recoverypassword_check_code' , async (req, res) => {
    const valid = SecuDTO.validateMail2FA_CheckCode(req.body);
    if (!valid.valid) {
        return errorHandler(valid.message, valid.code, res);
    }
    const {code, host} = req.body;
    try{
        const result = await SecuService.check_code(code, 'ChgPSWD', 2, host);
        if (!result.success) {
            return errorHandler(result.message, result.code, res);
        }
    }catch(err){
        return errorHandler("back check_code" + err, 500, res); 
    }
})

router.put('/majPswd', async(req,res) => {
    const valid = SecuDTO.validateMaj_Password(req)
    if (!valid.valid){
        return errorHandler(valid.message, valid.code, res);
    }
    try{
        const new_psd = req.body.new_psd;
        const token = req.cookies.ChgPSWD;
        const result = await SecuService.maj_password(new_psd, token);
        if (!result.success)
            return errorHandler(result.message, result.code, res)
        return res.status(201).json({success: true, message:"good"});
    }catch(err){
        return errorHandler("back majPswd " + err, 500, res);
    }
        
})

router.delete('/cookie', async(req, res) => {
    const valide = SecuDTO.validateCookie(req, 'ChgPSWD');
    if (!valide.valid) {
        return errorHandler(valide.message, valide.code, res);
    }
    try{
        res.clearCookie('ChgPSWD');
        return res.status(200).json({success: true, message: "cookie cleared"});
    }catch(err){
        return errorHandler("error clearcookie " + err, 500, res);
    }
})

export default router;