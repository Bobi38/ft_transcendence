import {encrypt} from './crypt.js';
import {express, maj_conv, secret, jwt, errorHandler, get_user_from_token} from './index.js';
import {User, ChatG} from './index.js';

class ChatGService {

    static async getChatG(token) {
        try {
            const user = await  get_user_from_token(token);
            if (!user.success)
                return ({success: false, message: user.message, code: user.code})
            const result = user.user;
            const conv = await ChatG.findAll({order:[['id', 'DESC']], limit: 30});
            const name = await User.findAll({attributes: ['id', 'name']});
            let ret = "";
            console.log("conv ", conv.length);
            console.log("name ", name.length);
            console.log("result ", result.id);
            console.log("name ", name);
            if (conv.length > 0)
                ret = maj_conv(result.id, conv, name);
            console.log("ret ", ret);
            return ({success: true, message: ret, code: 200});
            }catch (err) {
                return ({ success: false, message: err, code: 500 });
            }
    }

    static async postChatG(chat, token) {
        try {
            const user = await get_user_from_token(token);
            if (!user.success)
                return ({success: false, message: user.message, code: user.code})
            const result = user.user;
            const mess = encrypt(chat.message);
            if (mess.length > 511)
                return ({success: false, message: "Message send too long", code: 413})
            const time = new Date()
            await ChatG.create({contenu: mess, SenderId: result.id, time: time });
            return { success: true, code: 201, message: "messG add too db" };
        }catch(err){
            return { success: false, message: err, code: 500 };
        }
    }


}

export default ChatGService;