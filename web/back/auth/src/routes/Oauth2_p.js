import {jwt, secret, express, fs, tcheck_MPFA} from './index_p.js';
import {User, Co} from './index_p.js';

const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
const router = express.Router();

const clientiD = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;

router.get('/github', async (req, res) => {
  // On stocke le frontend en session avant de partir chez GitHub
  req.session.frontendUrl = req.query.frontendUrl;
  const back = req.query.backUrl;
  console.log("backkkkkk " + back);
  console.log("in AUTHHHH" + req.session.frontendUrl)
  const redirectUri = `http://${back}:9000/api/oauth2/github/callback`;
  const githubAuthUrl = `https://github.com/login/oauth/authorize` + `?client_id=${clientiD}` +`&redirect_uri=${redirectUri}` +`&scope=user:email`;
  console.log("github auth url ", githubAuthUrl);
  res.redirect(githubAuthUrl);
});




router.get('/github/callback', async (req, res) => {
  const code = req.query.code;
  const frontendUrl = req.session.frontendUrl;
  console.log("je suis dams github callback");
  console.log("GitHub callback code:", code);

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
    const newUser = await User.create({name: user.login, password: null, mail: email[0].email, OAuth:true, Hostlastco: frontendUrl, Datelastco: new Date(), MPFA: false});
    console.log("New user created:", newUser);
    token = jwt.sign({id: newUser.id}, secret, {expiresIn: '12h'});
    const re = await Co.create({token: token, userId: newUser.id});
  }
  else {
    await result[0].update({co: true, Hostlastco: frontendUrl, Datelastco: new Date(), MPFA: false});
    //const MPFA = tcheck_MPFA(result[0], frontendUrl);
    // await result[0].update({MPFA: MPFA});
    console.log("Existing user logged in:", result[0].name);
    token = jwt.sign({id: result[0].id}, secret, {expiresIn: '12h'});
    const re = await Co.create({token: token, userId: result[0].id});
  }
  res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'lax', maxAge: 12 * 60 * 60 * 1000 });
  console.log("front " + frontendUrl)
  res.redirect(frontendUrl);
});

export default router;