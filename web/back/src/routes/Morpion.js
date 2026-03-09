
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
  // HistoryMorp,
  jwt,
  secret,
  express,
  Op
}from './index.js';


const router = express.Router();

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
        const result_stats = await StatMorp.findOne({where: {idUser: to_search.id}});
        
        return res.status(201).json({success: true, stat_user: result_stats});

    } catch(err) {
        return res.status(500).json({success: false, message: err});
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

        if (to_search !== undefined){

          // console.log("API get_morpion_history(2.info.1)");
          to_search = await User.findOne({where: {name: to_search}})

          console.log("API get_morpion_history(2.info.1) to_search:",to_search)
          if (to_search === null)
            return (res.status(404).json({success: false, message: `Hmmm il n'y a pas de user de ce nom..`}));
        
        } else {

          // console.log("API get_morpion_history(2.info.2)");
          const token = req.cookies.token;
          const decoded = jwt.verify(token, secret);
          to_search = await User.findOne({where: {id: decoded.id}})

          console.log("API get_morpion_history(2.info.2) to_search:",to_search)
          if (to_search === null)
            return (res.status(404).json({success: false, message: `Hmmm il n'y a pas de user de ce nom..`}));
        }
        
        console.log("API get_morpion_history(3)");

        const result_history = await GameMorp.findAll({where: {[Op.or]: [{ player_1: to_search.id }, { player_2: to_search.id }]}, limit: 5, offset: 0, order: [['id', 'DESC']], include: [
    { model: User, as: 'player1', attributes: ['name'] },
    { model: User, as: 'player2', attributes: ['name'] },
    { model: User, as: 'winnerUser', attributes: ['name'] },
    { model: User, as: 'loserUser', attributes: ['name'] }// Optionnel : pour afficher le gagnant
  ]});
// GameMorp.findAll({where: {[Op.or]: [{player_1: to_search.id}, {player_2: to_search.id}]}}, {limit: 5, offset: 0 , order:[['id', 'DESC']]})

        
        console.log("API get_morpion_history(4) result_history", result_history);

        return res.status(201).json({success: true, message: "data in history_user", history_user: result_history});

    }catch(err){
        return res.status(500).json({success: false, message: "API get_morpion_history(catch) " + err});
    }
});


export default router;