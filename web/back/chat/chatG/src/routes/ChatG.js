import {encrypt} from './crypt.js';
import {express, maj_conv, secret, jwt} from './index.js';
import {User, ChatG} from './index.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const token = req.cookies.token;
        const decoded = jwt.verify(token, secret);
        const result = await User.findAll({ where: { id: decoded.id } });
        const conv = await ChatG.findAll({order:[['id', 'DESC']], limit: 30});
        const name = await User.findAll({attributes: ['id', 'name']});
        let ret = "";
        if (conv.length > 0)
            ret = maj_conv(result[0].id, conv, name);
        res.status(200).json({ success: true, message: ret});
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur MySQL' });
    }
});

router.post('/', async (req, res) => {
    try{
        const chat = req.body;
        if (!chat.message || !chat.time) {
            return res.status(400).json({ success: false, message: 'Missing fields' });
        }
        const tok = req.cookies.token
        const id = jwt.verify(tok, secret);
        const mess = encrypt(chat.message);
        await ChatG.create({contenu: mess, SenderId: id.id, time: chat.time });
        return res.status(201).json({success: true});
    } catch(err) {
        return res.status(501).json({success: false, message: err});
    }
})

export default router;