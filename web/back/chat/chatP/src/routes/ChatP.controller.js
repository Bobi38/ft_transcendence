import {express, errorHandler} from './index.js';

import ChatPDTO from './ChatP.DTO.js';
import ChatPService from './ChatP.service.js'
const router = express.Router();

router.post('/', async (req, res) => {
    console.log("in post add debut")
    const valid = ChatPDTO.validatePostChatP(req)
    if (!valid.valid)
        return errorHandler(valid.message, valid.code, res);
    try{
        console.log("after DTO")
        const data = req.body;
        const result = await ChatPService.postChatP(data, req.cookies.token);
        if (!result.success)
            return errorHandler(result.message, result.code, res);
        console.log("in post add end success")
        res.status(result.code).json({success: true, message: result.message});
    }
    catch(err){
        res.status(500).json({success: false, message: err});
    }
});


router.get('/:name', async (req, res) => {
    console.log("in api get chat")
    const valid = ChatPDTO.validateGetChatP(req)
    if (!valid.valid)
        return errorHandler(valid.message, valid.code, res);
    try{
        const name = req.query.name;
        const my_token = req.cookies.token;
        const result = await ChatPService.getChatP(my_token, name);
        if (!result.success)
            return errorHandler(result.message, result.code, res);
        res.status(result.code).json({success: true, message: result.message});
    }catch(err){
        res.status(500).json({success: false, message: "error:" + err});
    }
})

router.get('/', async (req, res) => {
    const valid = ChatPDTO.validateGetAllChatP(req.cookies)
    if (!valid.valid)
        return errorHandler(valid.message, valid.code, res);
    console.log("API fetch_conv called")
    try{
        const token = req.cookies.token;
        const result = await ChatPService.getAllChatP(token);
        if (!result.success)
            return errorHandler(result.message, result.code, res);
        res.status(result.code).json({success: true, message: result.message});
    }catch(err){
        console.log("API fetch_conv error: ",err);
        return res.status(500).json({success: false, message: err});
    }
});

export default router;