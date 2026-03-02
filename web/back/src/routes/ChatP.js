import {decrypt, encrypt} from '../crypt.js';
import {express, maj_conv, jwt, Op} from './index.js';
import {User, PrivChat, PrivMess} from './index.js';

const router = express.Router();

router.post('/add_message_private', async (req, res) => {
  try{
    console.log("in add 1");
    const data = req.body;
    const tok1 = req.cookies.token;
    const id1 = jwt.verify(tok1, secret);
    const res1 = await User.findOne({ where: {id: id1.id}});
    const id2 = await User.findOne({ where: { name: data.id}});
    console.log("in add 2");
    if (!res1 || !id2)
      return res.status(500).json({success: false, message: 'ERROR USER NOT FOUND'});
    let findchat = await PrivChat.findOne({where :{ [Op.or]:[{id1: id1.id, id2: id2.id},{id1: id2.id, id2: id1.id} ]}});
    if (!findchat)
        findchat = await PrivChat.create({id1: id1.id, id2: id2.id});
    console.log("in add 3");
    console.log("dATA ", data.message, id1.id, findchat.id, data.time);
    const crypt = encrypt(data.message);
    await PrivMess.create({SenderId: id1.id, contenu: crypt, ChatId: findchat.id, time: data.time});
    console.log("GOOOOOD");
    res.status(201).json({success: true});
  }catch(err){
    res.status(500).json({success: false, message: err});
  }
});

router.post('/get_chat_private', async (req, res) => {
    try{
        const {token} = req.body;
        const my_token = req.cookies.token;
        const id1 = jwt.verify(my_token, secret);
        const id2 = await User.findOne({ where: { name: token}});
        if (id2 === 0)
            return res.status(500).json({success: false, message: 'ERROR USER NOT FOUND'});
        const findchat = await PrivChat.findOne({where :{ [Op.or]:[{id1: id1.id, id2: id2.id},{id1: id2.id, id2: id1.id} ]}});
        if (findchat === 0)
            return res.status(500).json({success: false, message: 'ERROR CONV NOT FOUND'});
        const conv = await PrivMess.findAll({order:[['id', 'DESC']], limit: 30, where:{chatid: findchat.id}});
        const name = await User.findAll({attributes: ['id', 'name'], where: {id: id2.id}});
        let ret = "";
        if (conv.length - 1 != 0)
            ret = maj_conv(id1.id, conv, name);
        res.status(201).json({success: true, message: ret});
    }catch(err){
        res.status(500).json({success: false, message: err});
    }
})

router.get('/fetchConv', async (req, res) => {
    console.log("API fetchConv called")
    try{
        const token = req.cookies.token;
        const decoded = jwt.verify(token, secret);
        const result = await User.findOne({ where: { id: decoded.id } });
        console.log("rest   ", result.id);
        const chats = await PrivChat.findAll({where: {[Op.or]: [{ id1: result.id },{ id2: result.id }]},include: [  { model: User, as: 'user1', attributes: ['id', 'name', 'co'] },{ model: User, as: 'user2', attributes: ['id', 'name', 'co'] },{model: PrivMess,limit: 1,order: [['id', 'DESC']]}]});
        for(const chat of chats){
            if (chat.PrivMesses[0].contenu && chat.PrivMesses[0].contenu.length > 0){
                const enc = chat.PrivMesses[0].contenu;
                try{
                    const dec = decrypt(enc)
                    chat.PrivMesses[0].contenu = dec;
                }catch(err){
                    return res.status(500).json({success:false, message: "error decrypt ", err});
                }
            }
        }
        console.log("API fetchConv chat 1 ", chats[0].PrivMesses[0].contenu)
        console.log("API fetchConv chat 2 ", chats[1].PrivMesses[0].contenu)
        console.log("API fetchConv test join ", chats[0].user1.name);
        return res.status(201).json({success: true, message: chats});
    }catch(err){
        console.log("API fetchConv error: ",err);
        return res.status(500).json({success: false, message: err});
    }
});

export default router;