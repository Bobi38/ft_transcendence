
import 
{
  User,
  StatMorp,
  GameMorp,
  jwt,
  secret,
  express,
  Op,
  errorHandler
}from './index.js';

import MorpionDTO from './Morpion.DTO.js';
import MorpionService from './Morpion.service.js';
const router = express.Router();

router.get('/get_stat', async (req, res) => {
    const validation = MorpionDTO.validateGetStat(req);
    if (!validation.valid) {
        return errorHandler(validation.message, validation.code, res);
    }
    try{
        const result = await MorpionService.get_stat(validation.name, validation.token);
        if (!result.success)
          return errorHandler(result.message, result.code, res);
        return res.status(result.code).json({success: true, stat_user: result.stat_user, name: validation.name ? validation.name : "current user"});

    }catch(err){
        return errorHandler("API/morp get_stat(catch) " + err, 500, res);
    }
})

router.get('/get_history/:page', async (req, res) => {
    const validation = MorpionDTO.validateGetHistory(req);
    if (!validation.valid) {
        return errorHandler(validation.message, validation.code, res);
    }
    try{
        const result = await MorpionService.get_history(validation.page, validation.token);
        if (!result.success)
          return errorHandler(result.message, result.code, res);
        return res.status(result.code).json({success: true, history_user: result.history_user, name: validation.name ? validation.name : "current user"});
    }catch(err){
        return errorHandler("API/morp get_history(catch) " + err, 500, res);
    }
});


export default router;