import {express, jwt, bcrypt, validator, isValidPhoneNumber, secret} from '../index.js';
import {User} from '../index.js'

const router = express.Router();

import ProfileDTO from './Profile.DTO.js';
import {errorHandler} from '../index.js';
import ProfileService from './Profile.service.js';

router.get('/', async(req, res) =>{
    const valid = ProfileDTO.validateToken(req);
    if (!valid.success)
        return errorHandler(valid.message, 400, res);
    try{
        const token = req.cookies.token;
        const result = await ProfileService.getProfile(token);
        if (!result.success)
            return errorHandler(result.message, result.code, res);
        return res.status(result.code).json({success: true, message: result.message});
    }catch(err){
        res.status(501).json({success: false, message: 'Err mysql getname' , err});
    }
});

router.put('/', async(req, res) => {
    const valid = ProfileDTO.validateData_Cookie(req.body.data, req);
    if (!valid.success)
        return errorHandler(valid.message, 400, res);
    try{
        const data = req.body.data
        const token = req.cookies.token;
        const result = await ProfileService.updateProfile(data, token);
        if (!result.success)
            return errorHandler(result.message, result.code, res);
        return res.status(result.code).json({success: true, message: result.message, username: result.username, oldname: result.oldname});
    }catch(err){
        res.status(500).json({success: false, message: "error updateProfil " , err});
    }
});
    
router.patch('/password', async(req,res) => {
    const valid = ProfileDTO.validatePassword_Cookie(req);
    if (!valid.success)
        return errorHandler(valid.message, 400, res);
    try{
        const password = req.body.Pass;
        const token = req.cookies.token;
        const result = await ProfileService.updatePassword(password, token);
        if (!result.success)
            return errorHandler(result.message, result.code, res);
        return res.status(result.code).json({success: true, message: result.message});
    }catch(err){
        res.status(500).json({success: false, message: "error majpass ", err});
    }
})

router.get('/Homeweather', async (req, res) => {
    try {
        const result = await ProfileService.getWeather(req);
        if (!result.success)
            return errorHandler(result.message, result.code, res);
        return res.status(result.code).json({ success: true, message: result.message });
    } catch (err) {
    return res.status(501).json({
      success: false,
      message: "error back /Homeweather " + err
    });
  }
});

export default router;