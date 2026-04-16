import {bcrypt, express, jwt, crypto,  errorHandler, validator, secret, SecuMiddleware, SecuChecko } from '../index_p.js';

import {User, PswEmail} from '../index_p.js';

const router = express.Router();

import SecuDTO from './secu.DTO.js';
import SecuService from './secu.service.js';

router.get('/checkco', SecuChecko, async(req, res) =>{
    try{
        let MPFA;
        console.log("API /api/secu/checkco");
        let token
        if (req.cookies.token)
            token = req.cookies.token;
        else if (req.cookies.temp)
            token = req.cookies.temp;
        else
            return res.status(401).json({success: false, message: "no token"});
        const decoded = jwt.verify(token, secret);
        const result = await User.findOne({ where: { id: decoded.id } });
        MPFA = result.MPFA;
        if (result.co == true && MPFA == false)
            return res.status(200).json({success: true, message: "token ok", MPFA: MPFA, token: token, username: result.name});
        else
            return res.status(403).json({success: false, message: "not co completed", MPFA: MPFA});
    }catch(err){
        return res.status(501).json({success: false, message: "error back /api/secu/checkco" + err});
    }
})

router.post('/send_mail', async (req, res) => {
    console.log("API /api/secu/send_mail");
    const valid = SecuDTO.validateCookie(req, 'temp');
    if (!valid.valid) {
        return errorHandler(valid.message, valid.code, res);
    }
    try{
        console.log("API /api/secu/send_mail try");
        const result = await SecuService.send_mail(null, req, 1, res, "temp");
        if (!result.success) {
           return errorHandler(result.message, result.code, res);
        }
        console.log("API /api/secu/send_mail success");
        return res.status(201).json({success: true, message: "message sent"});
    }catch(err){
        errorHandler("error catch send_mail controller " + err, 500, res);
    }
})

router.post('/send_mail_profil', async (req, res) => {
    console.log("API /api/secu/send_mail_profil");
    const valid = SecuDTO.validateCookie(req, 'token');
    if (!valid.valid) {
        return errorHandler(valid.message, valid.code, res);
    }
    try{
        console.log("API /api/secu/send_mail try");
        const result = await SecuService.send_mail(null, req, 3, res, "token");
        if (!result.success) {
           return errorHandler(result.message, result.code, res);
        }
        console.log("API /api/secu/send_mail success");
        return res.status(201).json({success: true, message: "message sent"});
    }catch(err){
        errorHandler("error catch send_mail controller " + err, 500, res);
    }
})


router.post('/recovery_password', async (req, res) => {
    console.log("API /api/secu/recovery_password" + req.body.mail);
    const valid = SecuDTO.validateRecoveryPassword(req.body.mail);
    if (!valid.valid) {
        return errorHandler(valid.message, valid.code, res);
    }
    console.log("API /api/secu/recovery_password valid");
    try{
        const {mail} = req.body;
        const result = await SecuService.send_mail(mail, req, 2, res, null);
        if (!result.success) {
            return errorHandler(result.message, result.code, res);
        }
        return res.status(201).json({success: true, message: "message sent"});
    }catch(err){
        return errorHandler("error" + err, 500, res);
    }
})

router.post('/maila2f_check_code' , SecuMiddleware, async (req, res) => {
    const valid = SecuDTO.validateMail2FA_CheckCode(req.body);
    if (!valid.valid) {
        return errorHandler(valid.message, valid.code, res);
    }
    const {code, host} = req.body;
    try{
        const result = await SecuService.check_code(code, 'temp', 1, host, req, res);
        if (!result.success) {
            return errorHandler(result.message, result.code, res);
        }
        return res.status(201).json({success: true, message: "good", token: result.token, username: result.username});  
    }catch(err){
        return errorHandler("back check_code" + err, 500, res); 
    }
})

router.post('/recoverypassword_check_code' , SecuMiddleware, async (req, res) => {
    const valid = SecuDTO.validateMail2FA_CheckCode(req.body);
    if (!valid.valid) {
        return errorHandler(valid.message, valid.code, res);
    }
    const {code, host} = req.body;
    try{
        const result = await SecuService.check_code(code, 'temp', 2, host, req, res);
        if (!result.success) {
            return errorHandler(result.message, result.code, res);
        }
        return res.status(201).json({success: true, message: "good"});
    }catch(err){
        return errorHandler("back check_code" + err, 500, res); 
    }
})

router.post('/profil_check_code' , SecuMiddleware, async (req, res) => {
    const valid = SecuDTO.validateMail2FA_CheckCode(req.body);
    if (!valid.valid) {
        return errorHandler(valid.message, valid.code, res);
    }
    const {code, host} = req.body;
    try{
        const result = await SecuService.check_code(code, 'token', 3, host, req, res);
        if (!result.success) {
            return errorHandler(result.message, result.code, res);
        }
        return res.status(201).json({success: true, message: "good"});
    }catch(err){
        return errorHandler("back check_code" + err, 500, res); 
    }
})

router.put('/majPswd_profil', SecuMiddleware, async(req,res) => {
    const valid = SecuDTO.validateMaj_Password(req)
    if (!valid.valid){
        return errorHandler(valid.message, valid.code, res);
    }
    try{
        const new_psd = req.body.new_psd;
        const token = req.cookies.token;
        const result = await SecuService.maj_password(new_psd, token, res);
        if (!result.success)
            return errorHandler(result.message, result.code, res)
        return res.status(201).json({success: true, message:"good"});
    }catch(err){
        return errorHandler("back majPswd " + err, 500, res);
    }
        
})

router.put('/majPswd', SecuMiddleware, async(req,res) => {
    const valid = SecuDTO.validateMaj_Password(req)
    if (!valid.valid){
        return errorHandler(valid.message, valid.code, res);
    }
    try{
        const new_psd = req.body.new_psd;
        const token = req.cookies.temp;
        const result = await SecuService.maj_password(new_psd, token, res);
        if (!result.success)
            return errorHandler(result.message, result.code, res)
        return res.status(201).json({success: true, message:"good"});
    }catch(err){
        return errorHandler("back majPswd " + err, 500, res);
    }
        
})

router.delete('/cookie', SecuMiddleware, async(req, res) => {
    const valide = SecuDTO.validateCookie(req, 'temp');
    if (!valide.valid) {
        return errorHandler(valide.message, valide.code, res);
    }
    try{
        res.clearCookie('temp');
        return res.status(200).json({success: true, message: "cookie cleared"});
    }catch(err){
        return errorHandler("error clearcookie " + err, 500, res);
    }
})

export default router;