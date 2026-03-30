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
    if (!user.login || !user.email || !user.tel || !user.location || !user.login42){
      return res.status(400).json({success: false, message: 'Missing fields'});
    }
    const token = req.cookies.token;
    const decoded = jwt.verify(token, secret);
    const result = await User.findOne({ where: { id: decoded.id } });
    const oldname = result.name;
    console.log("API /updateProfil dans update profil", user);
    const name = await User.findAll({where :{name: user.login}})
    if ((name.length != 0) && (name.id != result.id))
      return res.status(409).json({success: false, message: 'Name already used'})
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
    res.status(201).json({success: true, message: "data in username", username: user.login, oldname: oldname});
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
    return res.status(404).json({success: false, message: "password empty"});
  }catch(err){
    res.status(500).json({success: false, message: "error majpass ", err});
  }
})

const cache = new Map();

function cacheWeather(duration = 3600000) {
  return async function (req, res, next) {
    try {

    console.log("API /cacheWeather depuis Homeweather");
      const token = req.cookies.token;
      const decoded = jwt.verify(token, secret);
      const result = await User.findOne({ where: { id: decoded.id } });

      let loc = (result && result.adress) ? result.adress : "Charbonnieres-les-Bains";

      req.loc = loc;

      // console.log("API /cacheWeather cache", cache);
      const cached = cache.get(loc);

    // console.log("API /cacheWeather cached:", cached);
      if (cached && (Date.now() - cached.timestamp) < duration) {

        // console.log(`pas d appel a l'API Weather : ${loc} deja connu`);
        return res.status(200).json({ success: true, message: cached.data });
      }
      
      req.cacheKey = loc;
      // console.log("API /cacheWeather next()", req.cacheKey);
      next();

    } catch (err) {
      return res.status(500).json({ success:false, message: err.toString() });
    }
  };
}

router.get('/Homeweather', cacheWeather(), async (req, res) => {
  try {
    console.log("API /Homeweather dans Homeweather");
    const key = "b26266decd6341248ef151027261902";
    const loc = req.loc;

    const response = await fetch(
      `http://api.weatherapi.com/v1/current.json?key=${key}&q=${loc}`
    );

    const data = await response.json();

    if (data) {

      cache.set(req.cacheKey, {
        data: data,
        timestamp: Date.now()
      });

      return res.status(201).json({ success: true, message: data });
    }

    return res.status(201).json({ success: false });

  } catch (err) {
    return res.status(501).json({
      success: false,
      message: "error back /Homeweather " + err
    });
  }
});


// router.get('/Homeweather', async (req, res) => {
//   try{
//     console.log("API /Homeweather dans Homeweather");
//     const key = "b26266decd6341248ef151027261902";
//     const token = req.cookies.token;
//     const decoded = jwt.verify(token, secret);
//     const result = await User.findOne({ where: { id: decoded.id } });
//     let loc;
//     if (result && result.adress)
//       loc = result.adress
//     else
//       loc = "Charbonnieres-les-Bains"
//     console.log("http://api.weatherapi.com/v1/current.json?key=" + key + "&q=" + loc)
//     const response = await fetch("http://api.weatherapi.com/v1/current.json?key=" + key + "&q=" + loc, {
//       method: "GET",
//       headers: { "Accept": "application/json" }
//     });
//     const data = await response.json()
//     if (data)
//         return res.status(201).json({success: true, message: data})
//     else
//         return res.status(201).json({success: false})
//   }catch(err){
//     return res.status(501).json({success: false, message: "error back /Homeweather " + err})
//   }
// })

export default router;