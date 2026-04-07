import {jwt, secret, express, get_user_from_token, tcheck_MPFA} from '../index_p.js';
import {User, Co} from '../index_p.js';

const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
const router = express.Router();

const clientiD = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;

class SecuService {

    static async send_mail(mail, req, type) {
        try {
            let user;
            if (mail == null) {
                user = await get_user_from_token(req.cookies.token);
                if (!user.success) {
                    return { success: false, message: user.message };
                }
                user = user.user;
            } else {
                user = await User.findOne({ where: { mail: mail } });
                if (!user) {
                    return { success: false, message: 'User not found' };
                }
            }
            let message;
            if (type === 1)
                message = "Your code to finalize connection is : ";
            else
                message = "Your code to finalize password recovery is : ";
            const code = crypto.randomInt(100000, 999999).toString();
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: "noreply.transc@gmail.com",
                    pass: "ykxu xqcc hokp zkfg"
                }
            });
            await transporter.sendMail({
                from: "noreply.transc@gmail.com",
                to: user.mail,
                subject: "Votre connection code",
                text: message + code,
            });
            const CrypPass = await bcrypt.hash(code, 10);
            const check = await PswEmail.findOne({ where: { idUser: user.id, type: type } });
            if (check)
                await check.destroy();
            console.log("API /api/secu/send_mail " + code + " " + CrypPass);
            await result.createCode({type: type, Code : CrypPass, DateCreate: new Date()});
            if (type === 2){
                const token = jwt.sign({id: user.id}, secret, {expiresIn: '12h'});
                res.cookie('ChgPSWD', token, { httpOnly: true, secure: false, sameSite: 'lax', maxAge: 12 * 60 * 60 * 1000 });
            }
            return ({ success: true, message: "message sent", code: 400 });
        } catch (err) {
            return ({ success: false, message: "error" + err, code: 500 });
        }
    }

    static async check_code(code, CookieName, type) {
        try{
            const token = req.cookies[CookieName];
            const decoded = jwt.verify(token, secret);
            const result = await User.findOne({ where: { id: decoded.id }, include: {model: PswEmail, as: 'code' , where :{type: type}} });
            console.log(result.code[0].Code)
            const limit = new Date(result.code[0].DateCreate.getTime() + 60 * 1000);
            const isValid = await bcrypt.compare(code, result.code[0].Code);
            console.log(isValid);
            console.log(limit);
            if (code && isValid == true && (new Date() < limit)){
                const co = result.code[0];
                await co.destroy();
                if (type === 1 )
                    await result.update({co: true,MPFA: false,Hostlastco: host, Datelastco: new Date()});
            }
            else
                return ({success: false, message:"wrong code", code: 400})
        }catch(err){
            return ({success: false, message: "back check_code" + err});
        }
    }

    static async maj_password(new_psd, token){
        try{
            const user = await get_user_from_token(token)
            if (!user.success){
                res.clearCookie('ChgPSWD');
                return ({success: false, message: "token invalid", code: 400});
            }
            const result = user.user;
            console.log("data pass= ", new_psd);
            if (new_psd){
                const CrypPass = await bcrypt.hash(new_psd, 10);
                await result.update({password: CrypPass});
                console.log(result);
                res.clearCookie('ChgPSWD');
                return ({success: true, message: "good"});
            }
            return ({success: false, message: "Please fill the field (new password)", code: 400});
        }catch(err){
            return ({success: false, message: "error majpass " + err, code: 500});
        }
    }
}

export default SecuService;