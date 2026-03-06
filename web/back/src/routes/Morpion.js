
import 
{
  User,
  // Co,
  // ChatG,
  // PrivMess,
  // PrivChat,
  // Friend,
  // PswEmail,
  StatMorp,
  GameMorp,
  HistoryMorp,
  jwt,
  secret,
  express
}from './index.js';


const router = express.Router();

router.get('/fetchStatMorp', async (req, res) => {
  try{
      const token = req.cookies.token;
      const decoded = jwt.verify(token, secret);
      const result = await User.findOne({where: {id: decoded.id}, include:[{model: StatMorp, as:'StatMorp'}]});
      const stat = {
          AllGame: result.StatMorp.nbGame,
          AllWin: result.StatMorp.Win,
          AllLost: result.StatMorp.Lost,
          AllDraw: result.StatMorp.Draw,
          AllAbort: result.StatMorp.Abort,
          Diag:{
            Win: result.StatMorp.WinDiag,
            Lost: result.StatMorp.LostDiag,
          },
          Vert:{
            Win: result.StatMorp.WinVert,
            Lost: result.StatMorp.LostVert,
          },
          Horiz:{
            Win: result.StatMorp.WinHoriz,
            Lost: result.StatMorp.LostHoriz,
          },
          WinCroix: result.StatMorp.WinCroix,
          WinCercle: result.StatMorp.WinCercle,
          LostCroix: result.StatMorp.LostCroix,
          LostCercle: result.StatMorp.LostCercle,
      }
      return res.status(201).json({success: true, stat_user: stat});
  }catch(err){
      return res.status(500).json({success: false, message: "err back fetchStatMorp " , err });
  }
})

router.get('/get_morpion_history/:page', async (req, res) => {
    try{
        console.log("API get_morpion_history(1) called");

        let page = parseInt(req.params.page) 
        if (page < 0)
          return (res.status(404).json({success: false, message: `unknow page_nbr=${page_nbr}`}))
        console.log("API get_morpion_history(2) page:", page);

        let to_search = req.query.name;
        console.log("API get_morpion_history(2) to_search:", to_search);

        // if (to_search !== undefined){

        //   // console.log("API get_morpion_history(2.info.1)");
        //   to_search = await User.findOne({where: {name: to_search}})

        //   console.log("API get_morpion_history(2.info.1) to_search:",to_search)
        //   if (to_search === null)
        //     return (res.status(404).json({success: false, message: `Hmmm il n'y a pas de user de ce nom..`}));
        
        // } else {

        //   // console.log("API get_morpion_history(2.info.2)");
        //   const token = req.cookies.token;
        //   const decoded = jwt.verify(token, secret);
        //   to_search = await User.findOne({where: {id: decoded.id}})

        //   console.log("API get_morpion_history(2.info.2) to_search:",to_search)
        //   if (to_search === null)
        //     return (res.status(404).json({success: false, message: `Hmmm il n'y a pas de user de ce nom..`}));
        // }
        
        // console.log("API get_morpion_history(3)");

        // const resultHistory = await HistoryMorp.findAll({where: {[Op.or]: [{Id1: to_search.id}, {Id2: to_search.id}]}}, {limit: 5, offset: page , order:[['id', 'DESC']]})

        
        // return res.status(201).json({success: true, history_user: resultHistory});
        return res.status(201).json({success: true, message: "data in history_user", history_user: "resultHistory"});

    }catch(err){
        return res.status(500).json({success: false, message: "API get_morpion_history(catch) " + err});
    }
});

router.get('/get_morpion_stat', async (req, res) => {
    try{
      
        console.log("API get_morpion_stat(1) called");


        let to_search = req.query.name;
        console.log("API get_morpion_stat(2) to_search:", to_search);
        if (to_search !== undefined){

          // console.log("API get_morpion_stat(2.info.1)");
          to_search = await User.findOne({where: {name: to_search}})

          console.log("API get_morpion_stat(2.info.1) to_search:",to_search)
          if (to_search === null)
            return (res.status(404).json({success: false, message: `Hmmm il n'y a pas de user de ce nom..`}));
        
        } else {

          // console.log("API get_morpion_stat(2.info.2)");
          const token = req.cookies.token;
          const decoded = jwt.verify(token, secret);
          to_search = await User.findOne({where: {id: decoded.id}})

          console.log("API get_morpion_stat(2.info.2) to_search:",to_search)
          if (to_search === null)
            return (res.status(404).json({success: false, message: `Hmmm il n'y a pas de user de ce nom..`}));

        }

        console.log("API get_morpion_stat(3)");
        const resultStats = await StatMorp.findOne({where: {idUser: to_search.id}});
        
        return res.status(201).json({success: true, stat_user: resultStats});

    }catch(err){
        return res.status(500).json({success: false, message: err});
    }
})


router.post('/getGameMorp', async (req, res) => {
  try{
    const {pas} = req.body;
    const past = 5 * Number(pas);
    const token = req.cookies.token;
    const decoded = jwt.verify(token, secret);
    const result = await GameMorp.findAll({where: {[Op.or]: [{player_1: decoded.id}, {player_2: decoded.id}]}}, {limit: 5, offset: past, order:[['id', 'DESC']]})
    return res.status(201).json({success: true, message: result});
  }catch(err){
    return res.status(500).json({success:false, message: "err "})
  }
})

export default router;