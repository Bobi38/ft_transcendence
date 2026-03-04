import {express, jwt, bcrypt, validator, isValidPhoneNumber, secret} from './index.js';
import {User} from './index.js'

const router = express.Router();

router.get('/profile', async(req, res) =>{
  try{
    const token = req.cookies.token;
    const decoded = jwt.verify(token, secret);
    const result = await User.findOne({ where: { id: decoded.id } });
    const data ={
      login: result.name,
      login42: result.Log42,
      email: result.mail,
      tel: result.phoneNumber,
      location: result.adress
    }
    res.status(201).json({success: true, message: data});
  }catch(err){
    res.status(501).json({success: false, message: 'Err mysql getname' , err});
  }
});

router.post('/updateProfil', async(req, res) => {
  try{
    const user = req.body
    console.log("API /updateProfil dans update profil", user);
    const name = await User.findAll({where :{name: user.login}})
    if (name.lenght != 0)
      return res.status(409).json({success: false, message: 'Name already used'})
    const token = req.cookies.token;
    const decoded = jwt.verify(token, secret);
    const result = await User.findOne({ where: { id: decoded.id } });
    console.log(user.email)
    if (validator.isEmail(user.email)){
      console.log("email valid");
      await result.update({mail: user.email})
    }
    if (isValidPhoneNumber(user.tel)){
        console.log("phone number valid");
      await result.update({phoneNumber: user.tel})
    }
    console.log()
    if (user.login && user.login.length < 128){
      console.log("login good");
      await result.update({name: user.login})
    }
    if (user.login42 && user.login42.length < 128){
      console.log("login42 valid");
      await result.update({Log42: user.login42});
    }
    if (user.location && user.location.length < 256){
      console.log("adress good");
      await result.update({adress: user.location});
    }
    res.status(201).json({success: true, message: "good"})
  }catch(err){
    res.status(500).json({success: false, message: "error updateProfil " , err});
  }
});

router.post('/majPass', async(req,res) => {
  try{
    const data = req.body;
    const token = req.cookies.token;
    const decoded = jwt.verify(token, secret);
    const result = await User.findOne({ where: { id: decoded.id } });
    console.log("data pass= ", data.Pass);
    if (data.Pass){
      const CrypPass = await bcrypt.hash(data.Pass, 10);
      await result.update({password: CrypPass});
      return res.status(201).json({success: true, message: "goog"});
    }
    return res.status(500).json({success: false, message: "password empty"});
  }catch(err){
    res.status(500).json({success: false, message: "error majpass ", err});
  }
})

export default router;