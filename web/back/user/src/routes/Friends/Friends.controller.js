import {express, errorHandler} from '../index.js';

import FriendDTO from './Friends.DTO.js';
import FriendService from './Friends.service.js';
const router = express.Router();


router.get('/', async (req, res) => {
    const valid = FriendDTO.validateToken(req);
    if (!valid.success)
        return errorHandler(valid.message, 400, res);
    try{
        const token = req.cookies.token;
        const result = await FriendService.getAllFriend(token);
        if (!result.success)
            return errorHandler(result.message, result.code, res);
        return res.status(result.code).json({success: result.success, message: result.message});
        }catch(err){
        return res.status(500).json({success: false, message: "err all_friend back ", err});
    }
})


router.post('/', async (req, res) => {
    console.log("in ADD FRIEND CONTROLLER"  );
    const valid = FriendDTO.validateName_Cookies(req.body.name, req);
    if (!valid.success)
        return res.status(400).json({success: false, message: valid.message});
    try{
        const name = req.body.name;
        const token = req.cookies.token;
        const result = await FriendService.addFriend(name, token);
        console.log("result add friend", result);
        if (!result.success)
            return errorHandler(result.message, result.code, res);
        return res.status(result.code).json({success: true, message: result.message});
    }catch(err){
        return res.status(500).json({success: false, message: "err back add_friend ", err});
    }
})

router.delete('/:name', async (req, res) => {
    const valid = FriendDTO.validateName_Cookies(req.params.name, req);
    if (!valid.success)
        return res.status(400).json({success: false, message: valid.message});
    try{
        const name = req.params.name;
        const token = req.cookies.token;
        const result = await FriendService.deleteFriend(name, token);
        if (!result.success)
            return errorHandler(result.message, result.code, res);
        return res.status(result.code).json({success: true});
    }catch(err){
        return res.status(500).json({success: false, message: "err back dlt_friend " + err});
    }
})

router.get('/requests', async (req,res) => {
    const valid = FriendDTO.validateToken(req);
    if (!valid.success)
        return errorHandler(valid.message, 400, res);
    try{
        const token = req.cookies.token;
        const result = await FriendService.request(token);
        if (!result.success)
            return errorHandler(result.message, result.code, res);
        return res.status(result.code).json({success: true, message: result.message });
    }catch(err){
        return res.status(501).json({success: false, message: "error /all_request_friend back " + err})
    }
})


router.patch('/response', async (req, res) => {
    const valid = FriendDTO.validateResponse(req.body, req.cookies.token);
    if (!valid.success)
        return errorHandler(valid.message, 400, res);
    try {
        const {login, response} = req.body
        const token = req.cookies.token;
        const result = await FriendService.response(login, response, token);
        if (!result.success)
            return errorHandler(result.message, result.code, res);
        console.log("in repsonse " + result.login);
        return res.status(201).json({success: true, message: result.message, accept: result.accept, login: result.login});
    }catch(err){
        return res.status(501).json({success: false, message: "error /all_request_friend back " + err})
    }
})



router.get('/:name/status', async (req, res) => {
    const valid = FriendDTO.validateName_Cookies(req.params.name, req);
    if (!valid.success)
        return res.status(400).json({success: false, message: valid.message});
    try{
        const name = req.params.name;
        const token = req.cookies.token;
        const result = await FriendService.isFriend(name, token);
        if (!result.success)
            return errorHandler(result.message, result.code, res);
        return res.status(result.code).json({success: true, message: result.message});
    }catch(err){
        return res.status(500).json({success: false, message: "err back is_friend ", err});
    }
})


export default router;