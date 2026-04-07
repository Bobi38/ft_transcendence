import {express, jwt, bcrypt, validator, isValidPhoneNumber, secret} from '../index.js';
import {User} from '../index.js'

const router = express.Router();

const key = process.env.API_KEY_WEATHER

router.get('/', async(req, res) =>{
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

router.put('/', async(req, res) => {
  try{
    const user = req.body
    if (!user.login || !user.email || !user.tel){
      return res.status(400).json({success: false, message: 'Tous les '});
    }
    // if (!validator.isEmail(user.email))
    //   return res.status(404).json({success: false, message: "Formal de l'email est invalid"})
    if (!isValidPhoneNumber(user.tel))
      return res.status(404).json({success: false, message: "Veuillez entrer un numéro de téléphone valide au format international (ex: +33612345678)"})
    if (user.login.length > 128)
      return res.status(404).json({success: false, message: "Veuillez entrez un login d'une taille inferieur a 128 caractere"})     
    const token = req.cookies.token;
    const decoded = jwt.verify(token, secret);
    const result = await User.findOne({ where: { id: decoded.id } });
    const oldname = result.name;
    console.log("API /updateProfil dans update profil", user);
    const name = await User.findAll({where :{name: user.login}})
    if ((name.length != 0) && (name[0].id != result.id))
      return res.status(409).json({success: false, message: 'Le login ' + user.login + " est deja utilise"})
    await result.update({ name: user.login, mail: user.email, phoneNumber: user.tel })
    res.status(201).json({success: true, message: "data in username", username: user.login, oldname: oldname});
  }catch(err){
    res.status(500).json({success: false, message: "error updateProfil " , err});
  }
});

router.patch('/password', async(req,res) => {
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
    return res.status(400).json({success: false, message: "Veuillez remplir la case (nouveau mot de passe)"});
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
    const loc = req.loc;
    console.log("loc:",loc)
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

export default router;