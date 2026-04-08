import {bcrypt, get_user_from_token} from '../index.js';
import {User} from '../index.js'


const key = process.env.API_KEY_WEATHER

class ProfileService {

    static async getProfile(token) {
        try{
            const user = await get_user_from_token(token);
            if (!user.success)
                return { success: false, message: user.message, code: user.code };
            const result = user.user;
            const data ={
                login: result.name,
                login42: result.Log42,
                email: result.mail,
                tel: result.phoneNumber,
            }
            return ({success: true, message: data, code: 201});
        }catch(err){
            return {success: false, message: 'Err mysql getname' , err, code: 501};
        }
    }

    static async updateProfile(data, token) {
        try{
            console.log("API /updateProfil DANS update profil", data.login);
            const user = await get_user_from_token(token);
            if (!user.success)
                return { success: false, message: user.message, code: user.code };
            const result = user.user;
            const oldname = result.name;
            // console.log("API /updateProfil dans update profil", user);
            const name = await User.findAll({where :{name: result.name}})
            if ((name.length != 0) && (name[0].id != result.id))
                return ({success: false, message: 'The login ' + data.login + " already used", code: 409})
            await result.update({ name: data.login, mail: data.email, phoneNumber: data.tel })
            return ({success: true, message: "data in username", username: user.login, oldname: oldname, code: 201});
        }catch(err){
            return {success: false, message: "error updateProfil " + err, code: 500};
        }
    }

    static async updatePassword(token, password) {
        try{
            const user = await get_user_from_token(token);
            if (!user.success)
                return { success: false, message: user.message, code: user.code };
            const result = user.user;
            const CrypPass = await bcrypt.hash(password, 10);
            if (CrypPass.length > 128)
                return ({success: false, message: "Password is too long", code: 404})
            await result.update({password: CrypPass});
            return ({success: true, message: "good new password", code: 201});
        }catch(err){
            return {success: false, message: "error majpass ", err, code: 500};
        }
    }

    static async getWeather(req) {
        try {
            console.log("API /Homeweather dans Homeweather");
            const loc = "Charbonnieres-les-bains";
            const response = await fetch(
            `http://api.weatherapi.com/v1/current.json?key=${key}&q=${loc}`
            );
            const data = await response.json();
            const cache = new Map();
            console.log("API /Homeweather data", data);
            if (data) {
            cache.set(req.cacheKey, {
                data: data,
                timestamp: Date.now()
            });
            return ({ success: true, message: data, code: 201 });
            }
            return ({ success: false, code: 201 });

        } catch (err) {
            return ({success: false,message: "error back /Homeweather " + err, code: 501});
        }
    }
}

export default ProfileService;