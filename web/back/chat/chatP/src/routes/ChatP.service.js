import {decrypt, encrypt} from './crypt.js';
import { maj_conv, Op} from './index.js';
import {User, PrivChat, PrivMess} from './index.js';

class ChatPService {

    static async getChatP(token, Name) {
        try{
            const user = await get_user_from_token(token);
            const id2 = await User.findOne({ where: { name: Name}});
            if (!user.success || !id2)
                return ({success: false, message: "error user not found", code: 400})
            const id1 = user.user;
            const findchat = await PrivChat.findOne({where :{ [Op.or]:[{id1: id1.id, id2: id2.id},{id1: id2.id, id2: id1.id} ]}});
            if (findchat === 0)
                return res.status(404).json({success: false, message: 'ERROR CONV NOT FOUND'});
            const conv = await PrivMess.findAll({order:[['id', 'DESC']], limit: 30, where:{chatid: findchat.id}});
            const name = await User.findAll({attributes: ['id', 'name'], where: {id: id2.id}});
            let ret = "";
            if (conv.length != 0)
                ret = maj_conv(id1.id, conv, name);
            return ({success: true, message: ret, code: 200});
        }catch(err){
            return ({success: false, message: "error:" + err, code: 500});
        }
    }

    static async postChatP(data, token) {
        try {
            const user = await get_user_from_token(token);
            const id2 = await User.findOne({ where: { name: data.id}});
            if (!user.success || !id2)
                return ({success: false, message: "error user not found", code: 400})
            const id1 = user.user;
            let findchat = await PrivChat.findOne({where :{ [Op.or]:[{id1: id1.id, id2: id2.id},{id1: id2.id, id2: id1.id} ]}});
            if (!findchat)
                findchat = await PrivChat.create({id1: id1.id, id2: id2.id});
            const crypt = encrypt(data.message);
            if (crypt.length > 511) {
                return ({ success: false, message: "Message too long", code: 400 });
            }
            console.log(crypt)
            await PrivMess.create({SenderId: id1.id, contenu: crypt, ChatId: findchat.id, time: data.time});
            findchat.lastmess = new Date();
            await findchat.save()
            return ({success: true, message: "add messP success", code: 200});
        }catch(err){
            return ({ success: false, message: err, code: 500 });
        }
    }

    static async getAllChatP(token) {
        try {
            const user = await get_user_from_token(token);
            if (!user.success)
                return ({success: false, message: user.message, code: user.code})
            const result = user.user;
            const chats = await PrivChat.findAll({
                        where: { [Op.or]: [{ id1: result.id }, { id2: result.id }] },
                        attributes: ['id'],
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
                        order: [['lastmess', 'DESC']]
                    });
            console.log("API fetch_conv test join(3)");
            for(const chat of chats){
                if (chat.PrivMesses[0].contenu && chat.PrivMesses[0].contenu.length > 0){
                    const enc = chat.PrivMesses[0].contenu;
                    try{
                        const dec = decrypt(enc)
                        chat.PrivMesses[0].contenu = dec;
                    }catch(err){
                        return ({success:false, message: "error decrypt " + err, code: 500});
                    }
                }
            }
            console.log("API fetch_conv test join(4)");
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
            return ({success: true, message: cleanChats, code: 200});
        }catch(err){
            return ({ success: false, message: err, code: 500 });
        }
    }

}

export default ChatPService;