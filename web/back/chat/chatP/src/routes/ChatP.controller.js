import {express, errorHandler} from './index.js';

import ChatPDTO from './ChatP.DTO.js';
import ChatPService from './ChatP.service.js'
const router = express.Router();

router.post('/', async (req, res) => {
    const valid = ChatPDTO.validatePostChatP(req)
    if (!valid.valid)
        return errorHandler(valid.message, valid.code, res);
    try{
        const data = req.body;
        const result = await ChatPService.postChatP(data, req.cookies.token);
        if (!result.success)
            return errorHandler(result.message, result.code, res);
        res.status(result.code).json({success: true, message: result.message});
    }
    catch(err){
        res.status(500).json({success: false, message: "error:" + err});
    }
});


router.get('/:name', async (req, res) => {
    const valid = ChatPDTO.validateGetChatP(req)
    if (!valid.valid)
        return errorHandler(valid.message, valid.code, res);
    try{
        const name = req.params.name;
        const my_token = req.cookies.token;
        const result = await ChatPService.getChatP(my_token, name);
        if (!result.success)
            return errorHandler(result.message, result.code, res);
        return res.status(result.code).json({success: true, message: result.message});
    }catch(err){
        res.status(500).json({success: false, message: "error:" + err});
    }
})

router.get('/', async (req, res) => {
    const valid = ChatPDTO.validateGetAllChatP(req.cookies)
    if (!valid.valid)
        return errorHandler(valid.message, valid.code, res);
    try{
        const token = req.cookies.token;
        const result = await ChatPService.getAllChatP(token);
        if (!result.success)
            return errorHandler(result.message, result.code, res);
        return res.status(result.code).json({success: true, message: result.message});
    }catch(err){
        return res.status(500).json({success: false, message: "error:" + err});
    }
});

export default router;