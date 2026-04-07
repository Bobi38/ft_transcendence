import {encrypt} from './crypt.js';
import {express, maj_conv, secret, jwt, errorHandler} from './index.js';
import {User, ChatG} from './index.js';

import ChatGDTO from'./ChatG.DTO.js'
import ChatGService from './ChatG.service.js'
const router = express.Router();

router.get('/', async (req, res) => {
    const valid = ChatGDTO.validateGetChatG(req)
    if (!valid.valid)
        return errorHandler(valid.message, valid.code, res);
    try {
        const token = req.cookies.token;
        const result = await ChatGService.getChatG(token);
        if (!result.success)
            return errorHandler(result.message, result.code, res)
        return res.status(result.code).json({success: true, message: result.message})   
    }catch (err) {
    return res.status(500).json({ success: false, message: 'Erreur MySQL' + err });
    }
});

router.post('/', async (req, res) => {
    const valid = ChatGDTO.validatePostChatG(req.body)
    if (!valid.valid)
        return errorHandler(valid.message, valid.code, res);
    try{
        const chat = req.body;
        const result = await ChatGService.postChatG(chat)
        if (!result.success)
            return errorHandler(result.message, result.code, res)
        return res.status(result.code).json({success: true});
  }catch(err){
    return res.status(501).json({success: false, message: err});
  }
})

export default router;