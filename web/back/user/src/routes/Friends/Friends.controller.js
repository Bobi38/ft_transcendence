import {express, jwt, secret, Op} from '../index.js';
import {User, Friend} from '../index.js';

import FriendDTO from './Friends.DTO.js';
import FriendService from './Friends.service.js';
const router = express.Router();


router.get('/', async (req, res) => {
    const valid = FriendDTO.validateToken(req);
    if (!valid.success)
        return res.status(400).json({success: false, message: valid.message});
  try{
    const token = req.cookies.token;
    const result = FriendService.getAllFriend(token);
    if (!result.success)
        return res.status(400).json(result);
    }catch(err){
    return res.status(500).json({success: false, message: "err all_friend back ", err});
  }
})


router.post('/', async (req, res) => {
    const valid = FriendDTO.validateName_Cookies(req);
    if (!valid.success)
        return res.status(400).json({success: false, message: valid.message});
    try{
        const name = req.body.name;
        const token = req.cookies.token;
        const result = await FriendService.addFriend(name, token);
        if (!result.success)
            return res.status(result.code).json(result);
        return res.status(201).json(result);
    }catch(err){
        return res.status(500).json({success: false, message: "err back add_friend ", err});
    }
})

        const token = req.cookies.token;
    const decoded = jwt.verify(token, secret);
        const result = await User.findOne({ where: { id: decoded.id } });

    const name_friend = await User.findOne({where: {name: name}});
        if (!name_friend)
            return res.status(404).json({success: false, message: undefined});

    const relation = await Friend.findAll({where: {[Op.or]: [{Friend1: result.id, Friend2: name_friend.id}, {Friend1: name_friend.id, Friend2: result.id}]}})
        if (relation.length > 0)
            return res.status(409).json({success: false, message: name});

    await Friend.create({Friend1: decoded.id, Friend2: name_friend.id, State: false, WhoAsk: decoded.id});
        return res.status(201).json({success: true});
    }catch(err){
        return res.status(500).json({success: false, message: "err back add_friend ", err});
    }
})

router.delete('/:name', async (req, res) => {
    try{
        const name = req.query.name;
        if (!name)
            return res.status(404).json({success: false, message: "no name"});
        const token = req.cookies.token;
        const decoded = jwt.verify(token, secret);
        const result = await User.findOne({ where: { id: decoded.id } });
        const nfriend = await User.findOne({where: {name: name}});
        if (!nfriend)
            return res.status(404).json({success: false, message: "exist"});
        const relation = await Friend.destroy({where: {[Op.or]: [{Friend1: result.id, Friend2: nfriend.id}, {Friend1: nfriend.id, Friend2: result.id}]}})
        if (relation === 0)
            return res.status(404).json({success: false, message: "relation"});
        return res.status(201).json({success: true});
    }catch(err){
        return res.status(500).json({success: false, message: "err back add_friend ", err});
    }
})

function format_all_request_friend(name, relation) {
    const  Fother = [];
    const Fme = []
    
    for(let i = relation.length - 1 ;i >= 0; i--){
        const login = name === relation[i].User1.name ? relation[i].User2.name : relation[i].User1.name;
        if (relation[i].User1.name == name)
            Fme.push({login: login});
        else
            Fother.push({login: login})
    }
    
    const data ={
        Fme: Fme,
        Fother: Fother
    }
    return data;
};

router.get('/requests', async (req,res) => {
    try{
        const token = req.cookies.token;
        const decoded = jwt.verify(token, secret);
        const result = await User.findOne({ where: { id: decoded.id } });
        const relation = await Friend.findAll({where:  {State: false,[Op.or]: [{Friend1: result.id}, {Friend2: result.id}]}, 
                                                include:[
                                                    {
                                                        model: User,
                                                        as: 'User1',
                                                        attributes: ['id', 'name']
                                                    },
                                                    {
                                                        model: User,
                                                        as: 'User2',
                                                        attributes: ['id', 'name']														
                                                    }
                                                ]})

        if (relation.length === 0){
            return res.status(201).json({success: true, message: []})
        }
        console.log(relation[0].User1.name)
        const formated_relation = format_all_request_friend(result.name, relation)
        console.log(formated_relation)
        return res.status(201).json({success: true, message: formated_relation})
    }catch(err){
        return res.status(501).json({success: false, message: "error /all_request_friend back " + err})
    }
})


router.patch('/response', async (req, res) => {
    try {
        let acceptt;
        console.log("i m in response friend")
        const {login, response} = req.body
        console.log("req.body", req.body)
        console.log("response:",response)
        console.log("login:",login)
        const token = req.cookies.token;
        const decoded = jwt.verify(token, secret);
        const result = await User.findOne({ where: { id: decoded.id } });
        const friend = await User.findOne({ where: { name: login } });
        const relat = await Friend.findOne({where: { [Op.or]: [{Friend1: result.id, Friend2: friend.id}, {Friend1:friend.id , Friend2: result.id}]}})
        if (relat.length === 0)
            return res.status(409).json({success: false, message: "relation doesn't exist"})
        if (response){
            await relat.update({State: true})
            acceptt = true;
        }
        else{
            await relat.destroy();
            acceptt = false;
        }
        return res.status(201).json({success: true, message: "good", accept: acceptt, login: login})
    }catch(err){
        return res.status(501).json({success: false, message: "error /all_request_friend back " + err})
    }
})



router.get('/:name/status', async (req, res) => {
    try{
        const name = req.params.name;
        if (!name)
            return res.status(400).json({success: false, message: "no name"});
        const friend = await User.findOne({ where: { name: name } });
        if (!friend)
            return res.status(404).json({success: false, message: "invalid name"});
        const token = req.cookies.token;
        const decoded = jwt.verify(token, secret);
        const result = await User.findOne({ where: { id: decoded.id } });
        const relation = await Friend.findAll({where: {[Op.or]: [{Friend1: result.id, Friend2: friend.id}, {Friend1: friend.id, Friend2: result.id}]}})
        if (relation.length === 0)
            return res.status(404).json({success: false, message: "no relation"});
        if (relation[0].State === false)
            return res.status(400).json({success: false, message: "wait"});
        return res.status(201).json({success: true, message: "is friend"});
    }catch(err){
        return res.status(500).json({success: false, message: "err back is_friend ", err});
    }
})

export default router;