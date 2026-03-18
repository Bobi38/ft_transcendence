import 
{
  User,
  StatPong3D,
  jwt,
  secret,
  express,
  Op
}from './index.js';

const router = express.Router();


// router.get('/serv', async (req, res) => {

//         console.log("API/pong3d gameservetest(1) called");
//         return res.status(201).json({success: true});

//         // const page1 = parseInt(req.params.page) || 1;
//         // console.log("API/pong3d get_morpion_stat(1) params ", page1);
//         // const page2 = parseInt(req.query.page) || 1;
//         // console.log("API/pong3d get_morpion_stat(1) query ", page2);

// })


router.get('/get_stat', async (req, res) => {

    try{
      
          console.log("API/pong3d get_stat(1) called");


          let to_search = req.query.name;
          console.log("API/pong3d get_stat(2) to_search:", to_search);
          if (to_search !== undefined){

            // console.log("API/pong3d get_stat(2.info.1)");
            to_search = await User.findOne({where: {name: to_search}})

            console.log("API/pong3d get_stat(2.info.1) to_search:",to_search)
            if (to_search === null)
                return (res.status(404).json({success: false, message: `Hmmm il n'y a pas de user de ce nom..`}));
        
        } else {

            // console.log("API/pong3d get_stat(2.info.2)");
            const token = req.cookies.token;
            const decoded = jwt.verify(token, secret);
            to_search = await User.findOne({where: {id: decoded.id}})

            console.log("API/pong3d get_stat(2.info.2) to_search:",to_search)
            if (to_search === null)
                return (res.status(404).json({success: false, message: `Hmmm il n'y a pas de user de ce nom..`}));

        }

        console.log("API/pong3d get_stat(3)");
        const result_stats = await StatMorp.findOne({where: {idUser: to_search.id}});
        
        return res.status(201).json({success: true, stat_user: result_stats});

    } catch(err) {
        return res.status(500).json({success: false, message: err});
    }
})

router.get('/get_history/:page', async (req, res) => {
    try{
        console.log("API/pong3d get_history(1) called");

        let page = parseInt(req.params.page)
        if (page < 0)
          return (res.status(404).json({success: false, message: `unknow page_nbr=${page_nbr}`}))
        console.log("API/pong3d get_history(2) page:", page);

        let to_search = req.query.name;
        console.log("API/pong3d get_history(2) to_search:", to_search);

        if (to_search !== undefined){

          // console.log("API/pong3d get_history(2.info.1)");
          to_search = await User.findOne({where: {name: to_search}})

          console.log("API/pong3d get_history(2.info.1) to_search:",to_search)
          if (to_search === null)
            return (res.status(404).json({success: false, message: `Hmmm il n'y a pas de user de ce nom..`}));
        
        } else {

          // console.log("API/pong3d get_history(2.info.2)");
          const token = req.cookies.token;
          const decoded = jwt.verify(token, secret);
          to_search = await User.findOne({where: {id: decoded.id}})

          console.log("API/pong3d get_history(2.info.2) to_search:",to_search)
          if (to_search === null)
            return (res.status(404).json({success: false, message: `Hmmm il n'y a pas de user de ce nom..`}));
        }
        
        console.log("API/pong3d get_history(3)");
        const limit = 5
        const offsetpage = limit * page 
        const result_history = await GameMorp.findAll({where: {[Op.or]: [{ player_1: to_search.id }, { player_2: to_search.id }]}, limit: limit, offset: offsetpage, order: [['id', 'DESC']], include: [
    { model: User, as: 'player1', attributes: ['name'] },
    { model: User, as: 'player2', attributes: ['name'] },
    { model: User, as: 'winnerUser', attributes: ['name'] },
    { model: User, as: 'loserUser', attributes: ['name'] },
]});
        
        console.log("API/pong3d get_history(4) result_history", result_history);

        if (!result_history.length)
          return res.status(200).json({success: false, message: "API/pong3d get_history(catch) "});
        return res.status(201).json({success: true, message: "data in history_user with name on name", history_user: result_history, name: to_search.name});

    }catch(err){
        return res.status(500).json({success: false, message: "API/pong3d get_history(catch) " + err});
    }
});


export default router;
