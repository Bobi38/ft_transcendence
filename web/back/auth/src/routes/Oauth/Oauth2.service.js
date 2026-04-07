import {jwt, secret, express, fs, tcheck_MPFA} from '../index_p.js';
import {User, Co} from '../index_p.js';

const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
const router = express.Router();

const clientiD = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;

class Oauth2Service {

    static async github(front, back, req) {
        try {
            req.session.frontendUrl = front;
            console.log("Api /login called");
            const redirectUri = `http://${back}:9000/api/oauth2/github/callback`;
            const githubAuthUrl = `https://github.com/login/oauth/authorize` + `?client_id=${clientiD}` +`&redirect_uri=${redirectUri}` +`&scope=user:email`;
            return { success: true, message: 'Redirecting to GitHub', url: githubAuthUrl };
        } catch (err) {
            return { success: false, message: 'MySQL error' + err, code: 500 };
        }
    }

    static async githubCallback(code, frontendUrl) {
        try{
            const params = new URLSearchParams();
            params.append("client_id", clientiD);
            params.append("client_secret", clientSecret);
            params.append("code", code);


            const response = await fetch("https://github.com/login/oauth/access_token", {
                method: "POST",
                headers: { "Accept": "application/json" },
                body: params,
            });

            const data = await response.json();
            const accessToken = data.access_token;
            console.log("GitHub access token:", accessToken);

            const userRes = await fetch("https://api.github.com/user", {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            const user = await userRes.json();
            console.log("GitHub user info:", user);
            const emailuse = await fetch ("https://api.github.com/user/emails", {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            const email = await emailuse.json();
            console.log("GitHub user email:", email);
            const result = await User.findAll({ where: { mail: email[0].email } });
            const name = await User.findAll({where :{name: user.login}})
            if (name.length != 0){
                let prefix = genRanHex(6);
                user.login = user.login + prefix
            }
            let token = "";
            if (result.length === 0) {
                const newUser = await User.create({name: user.login, password: null, mail: email[0].email, OAuth:true, Hostlastco: frontendUrl, Datelastco: new Date(), MPFA: true});
                console.log("New user created:", newUser);
                token = jwt.sign({id: newUser.id}, secret, {expiresIn: '12h'});
                const re = await Co.create({token: token, userId: newUser.id});
            }
            else {
                const MPFA = tcheck_MPFA(result[0], frontendUrl);
                await result[0].update({co: true, Hostlastco: frontendUrl, Datelastco: new Date(), MPFA: MPFA});
                
                await result[0].update({MPFA: MPFA});
                console.log("Existing user logged in:", result[0].name);
                token = jwt.sign({id: result[0].id}, secret, {expiresIn: '12h'});
                const re = await Co.create({token: token, userId: result[0].id});
            }
            res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 12 * 60 * 60 * 1000 });
            return { success: true, message: 'GitHub authentication successful',  frontendUrl: session };
        } catch (err) {
            return { success: false, message: 'GitHub authentication failed: ' + err, code: 500 };
        }
    }

    static async google(access_token, frontendUrl) {
        try {
            console.log("1 google")
            const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${access_token}` },
            });

            console.log("2 google")
            const { sub, name, email, picture } = await response.json();
            const result = await User.findAll({ where: { mail: email } });
            const nam = await User.findAll({where :{name: name}})
            if (nam.length != 0){
                let prefix = genRanHex(6);
                name = name + prefix
            }
            let token = "";
            let MPFA;
            if (result.length === 0) {
                const newUser = await User.create({name: name, password: null, mail: email, OAuth:true, Hostlastco: frontendUrl, Datelastco: new Date(), MPFA: true});
                token = jwt.sign({id: newUser.id}, secret, {expiresIn: '12h'});
                const re = await Co.create({token: token, userId: newUser.id});
                MPFA = newUser.MPFA;
            }
            else {
                await result[0].update({co: true, Hostlastco: frontendUrl, Datelastco: new Date()});
                MPFA = tcheck_MPFA(result[0], frontendUrl);
                await result[0].update({MPFA: MPFA});
                token = jwt.sign({id: result[0].id}, secret, {expiresIn: '12h'});
                const re = await Co.create({token: token, userId: result[0].id});
            }
            res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'lax', maxAge: 12 * 60 * 60 * 1000 });
            return res.status(201).json({ success: true, MPFA: MPFA, message: "connected"});
        } catch (err) {
            return { success: false, message: 'Google authentication failed: ' + err, code: 500 };
        }
    }
}

export default Oauth2Service;