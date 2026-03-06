
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

router.get('/get_morpion_stat', async (req, res) => {
    try{
        console.log("API get_morpion_stat(1) called");
        // const page = parseInt(req.params.page) || 1;
        // console.log("API get_morpion_stat(1) params ", page);
        let page = parseInt(req.query.page) 
        if (page < 0)
          return (res.status(404).json({success: false, message: `unknow page_nbr${page_nbr}`}))
        console.log("API get_morpion_stat(1) query ", page);

        const token = req.cookies.token;
        const decoded = jwt.verify(token, secret);
        console.log("API get_morpion_stat(2)");
        const resultStats = await StatMorp.findOne({where: {idUser: decoded.id}});
        console.log("API get_morpion_stat(3)");
        const resultHistory = await HistoryMorp.findAll({where: {[Op.or]: [{Id1: decoded.id}, {Id2: decoded.id}]}}, {limit: 5, offset: page - 1, order:[['id', 'DESC']]})
        console.log("API get_morpion_stat(4)");
        const stat = {
            AllGame: resultStats.nbGame,
            AllWin: resultStats.Win,
            AllLost: resultStats.Lost,
            AllDraw: resultStats.Draw,
            AllAbort: resultStats.Abort,
            Diag:{
              Win: resultStats.WinDiag,
              Lost: resultStats.LostDiag,
            },
            Vert:{
              Win: resultStats.WinVert,
              Lost: resultStats.LostVert,
            },
            Horiz:{
              Win: resultStats.WinHoriz,
              Lost: resultStats.LostHoriz,
            },
            WinCroix: resultStats.WinCroix,
            WinCercle: resultStats.WinCercle,
            LostCroix: resultStats.LostCroix,
            LostCercle: resultStats.LostCercle,
        }
        console.log("API get_morpion_stat(5)");
        return res.status(201).json({success: true, stat_user: stat, history: resultHistory});

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