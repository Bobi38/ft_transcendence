import {encrypt} from './crypt.js';
import {express, maj_conv, secret, jwt} from './index.js';
import {User, ChatG} from './index.js';

const router = express.Router();

router.get('/get_chat_global', async (req, res) => {
  try {
    console.log("dans get_chat_global-----");
    const token = req.cookies.token;
    const decoded = jwt.verify(token, secret);
    const result = await User.findAll({ where: { id: decoded.id } });
    const conv = await ChatG.findAll({order:[['id', 'DESC']], limit: 30});
    const name = await User.findAll({attributes: ['id', 'name']});
    let ret = "";
    console.log("conv ", conv.length);
    if (conv.length - 1 != 0)
      ret = maj_conv(result[0].id, conv, name);
    res.status(201).json({ success: true, message: ret});
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erreur MySQL' });
  }
});

router.post('/add_message_global', async (req, res) => {
  try{
    console.log("Api /add_message_global called");
    const chat = req.body;
    if (!chat.message || !chat.time) {
      return res.status(400).json({ success: false, message: 'Missing fields' });
    }
    if (chat.send == "")
      res.status(201)({success: true});
    const tok = req.cookies.token
    const id = jwt.verify(tok, secret);
    console.log (id.id, " " , chat.message);
    const mess = encrypt(chat.message);
    console.log("encr ", mess)
    await ChatG.create({contenu: mess, SenderId: id.id, time: chat.time });
    console.log("buuuuug");
    return res.status(201).json({success: true});
  }catch(err){
    return res.status(501).json({success: false, message: err});
  }
})

export default router;