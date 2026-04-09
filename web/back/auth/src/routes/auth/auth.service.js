import { bcrypt, get_user_from_token, jwt, tcheck_MPFA, secret, generateToken } from '../index_p.js';
import 
{
  User,
  Co,
}from '../index_p.js'

const status = process.env.STATUS

class AuthService {

  static async login({ email, password, host, res }) {
      try {
        const result = await User.findAll({ where: { mail: email } });
        if (result.length === 0)
            return {success: false, message: 'Email not found', code: 401};
        const DecrypPass = await bcrypt.compare(password, result[0].password);
        if (!DecrypPass)
            return {success: false, message: 'Password not valid', code: 401};
        const iid = await Co.findAll({where: { userId: result[0].id}})
          console.log("Api /login " + result[0].id," avant token");
        const token = jwt.sign({id: result[0].id}, secret, {expiresIn: '12h'});
        if (iid.length === 0)
          await Co.create({token: token, userId: result[0].id});
        console.log(result[0].Hostlastco + " " + host)
        console.log(result[0].Datelastco)
        let MPFA;
        MPFA = tcheck_MPFA(result[0], host);
        await result[0].update({MPFA: MPFA});
        await result[0].update({co: true,Hostlastco: host, Datelastco: new Date()});
        generateToken(MPFA, token, res);
        return { success : true , message: 'User connected', token: token, username: result[0].name, MPFA: MPFA };
        } catch (err) {
        return { success: false, message: 'MySQL error' + err, code: 500 };
        }
    }

    static async register({ name, password, email }) {
        try {
            const find = await User.findAll({ where: { mail: email } });
            if (find.length != 0) {
                if (find[0].OAuth == true)
                return {success: false, message: 'Email already in use via Github/Google', code: 409};
                else
                return {success: false, message: 'Email already in use', code: 409};
            }
            const nam = await User.findAll({where :{name: name}})
            if (nam.length != 0)
                return {success: false, message: 'Username already used', code: 409};
            console.log("Api /register av");
            const CrypPass = await bcrypt.hash(password, 10);
            const result = await User.create({name: name, password: CrypPass, mail: email, co: false, win: 0, total_part: 0});
            console.log("Api /register ID", result.id);
            return {success: true, message: 'User registered', user_id: result.insertId};
        } catch (err) {
            return {success: false, message: 'MySQL error' + err, code: 500 };
        }
    }

    static async logout(token) {
        try {
            const result = await get_user_from_token(token);
            if (!result.success) {
                return { success: false, message: result.message, code: 401 };
            }
            await result.user.update({co: false});
            await Co.destroy({ where: { userId: result.user.id } });
            return { success: true, message: 'User disconnected' };
        } catch (err) {
            return { success: false, message: 'MySQL error' + err, code: 500 };
        }
    }
}

export default AuthService;