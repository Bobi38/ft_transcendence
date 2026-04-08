import {encrypt} from '../web/back/chat/chatG/src/routes/crypt.js';
import {express, maj_conv, secret, jwt} from '../web/back/chat/chatG/src/routes/index.js';
import {User, ChatG} from '../web/back/chat/chatG/src/routes/index.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, secret);
    const result = await User.findAll({ where: { id: decoded.id } });
    const conv = await ChatG.findAll({order:[['id', 'DESC']], limit: 30});
    const name = await User.findAll({attributes: ['id', 'name']});
    let ret = "";
    console.log("conv ", conv.length);
    if (conv.length > 0)
      ret = maj_conv(result[0].id, conv, name);
    res.status(201).json({ success: true, message: ret});
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erreur MySQL' });
  }
});

router.post('/', async (req, res) => {
  try{
    const chat = req.body;
    if (!chat.message || !chat.time) {
      return res.status(400).json({ success: false, message: 'Missing fields' });
    }
})

export default router;