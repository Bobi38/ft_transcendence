
import 
{
  User,
  StatPong3D,
  GamePong3D,
  jwt,
  secret,
  express,
  Op,
  errorHandler
} from './index.js';

import PongDTO from './Pong.DTO.js';
import PongService from './Pong.service.js';
const router = express.Router();

router.get('/get_stat', async (req, res) => {
    const validation = PongDTO.validateGetStat(req);
    if (!validation.valid) {
        return errorHandler(validation.message, validation.code, res);
    }
    try{
        const result = await PongService.get_stat(validation.name, validation.token);
		//console.log (result);
        if (!result.success)
			return errorHandler(result.message, result.code, res);
        return res.status(result.code).json({success: true, stat_user: result.stat_user, name: validation.name ? validation.name : "current user"});

    }catch(err){
        return errorHandler("API/pong get_stat(catch) " + err, 500, res);
    }
})

router.get('/get_history/:page', async (req, res) => {
    const validation = PongDTO.validateGetHistory(req);
    if (!validation.valid) {
        return errorHandler(validation.message, validation.code, res);
    }
    try{
        const result = await PongService.get_history(validation.name, validation.page,validation.limit, validation.token);
        if (!result.success)
          return errorHandler(result.message, result.code, res);
        return res.status(result.code).json({success: true, history_user: result.history_user, name: validation.name ? validation.name : "current user"});
    }catch(err){
        return errorHandler("API/pong get_history(catch) " + err, 500, res);
    }
});


export default router;