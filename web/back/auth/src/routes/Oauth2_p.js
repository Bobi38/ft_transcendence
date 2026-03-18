import {jwt, secret, express} from './index_p.js';
import {User, Co} from './index_p.js';

const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');


const router = express.Router();

router.get('/github',  async (req, res) => {
  console.log("dans github");
  const clientiD = 'Ov23liKAY6PJhfRJ6mf8';
  const redirectUri = 'http://localhost:9000/api/oauth2/github/callback';
  const githubAuthUrl = `https://github.com/login/oauth/authorize` + `?client_id=${clientiD}` +`&redirect_uri=${redirectUri}` +`&scope=user:email`;
  console.log("github auth url ", githubAuthUrl);
  res.redirect(githubAuthUrl);
});




router.get('/github/callback', async (req, res) => {
  const code = req.query.code; 
  console.log("je suis dams github callback");
  console.log("GitHub callback code:", code);

  const params = new URLSearchParams();
  params.append("client_id", 'Ov23liKAY6PJhfRJ6mf8');
  params.append("client_secret", '15e78a3fa1121b8d51fe7dd0c8bf512a88358289');
  params.append("code", code);


  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { "Accept": "application/json" },
    body: params,
  });

  // res.status(201).json({ success: true, message: 'Bienvenue copain' });
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
    const newUser = await User.create({name: user.login, password: null, mail: email[0].email, OAuth:true,  co: true, win: 0, total_part: 0});
    console.log("New user created:", newUser);
    token = jwt.sign({id: newUser.id}, secret, {expiresIn: '12h'});
    const re = await Co.create({token: token, userId: newUser.id});
  }
  else {
    await result[0].update({co: true});
    console.log("Existing user logged in:", result[0].name);
    token = jwt.sign({id: result[0].id}, secret, {expiresIn: '12h'});
    const re = await Co.create({token: token, userId: result[0].id});
  }
  res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'lax', maxAge: 12 * 60 * 60 * 1000 });
  res.redirect('http://localhost:5173');
});

export default router;