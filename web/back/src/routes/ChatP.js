import {decrypt, encrypt} from '../crypt.js';
import {express, maj_conv, jwt, Op, secret, where} from './index.js';
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

router.get('/fetch_conv', async (req, res) => {
    console.log("API fetch_conv called")
    try{
        const token = req.cookies.token;
        if (!token) 
          return res.status(401).json({ success: false, message: "Token manquant" });
        const decoded = jwt.verify(token, secret);
        const result = await User.findOne({ where: { id: decoded.id } });
        console.log("API fetch_conv test join()");
        if (!result) 
          return res.status(404).json({ success: false, message: "Utilisateur introuvable" });
        
        // console.log("rest   ", result.id);   
        console.log("API fetch_conv test join()");
      const chats = await PrivChat.findAll({
        where: { [Op.or]: [{ id1: result.id }, { id2: result.id }] },
        attributes: ['id'], // On ne garde que l'ID du chat
        include: [
          { 
            model: User, 
            as: 'user1', 
            attributes: ['id', 'name', 'co'] 
          },
          { 
            model: User, 
            as: 'user2', 
            attributes: ['id', 'name', 'co'] 
          },
          {
            model: PrivMess,
            as: 'PrivMesses',
            attributes: ['contenu', 'time'],
            limit: 1,
            order: [['id', 'DESC']]
          }
        ],
        order: [['id', 'DESC']]
      });

        console.log("API fetch_conv test join()");
      const cleanChats = chats.map(chat => {
        const isUser1 = chat.user1.id === result.id;
        const interlocuteur = isUser1 ? chat.user2 : chat.user1;
        const lastMsg = chat.PrivMesses[0] || null;

        return {
          UserId: chat.id,
          login: interlocuteur.name,
          isOnline: interlocuteur.co,
          lastMessage: lastMsg ? lastMsg.contenu : '',
          time: lastMsg ? lastMsg.time : null
        };
      });
        // console.log("API fetch_conv test join ", chats[0].user1.name);
        // console.log("API fetch_conv test join ", chats[0].user2.name);
        // console.log("API fetch_conv test join ", chats[1].user1.name);
        // console.log("API fetch_conv test join ", chats[1].user2.name);
        return res.status(201).json({success: true, message: cleanChats});
    }catch(err){
        console.log("API fetch_conv error: ",err);
        return res.status(500).json({success: false, message: err});
    }
});

export default router;