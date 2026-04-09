import
{
  User,
  StatMorp,
  GameMorp,
  Op,
  get_user_from_token
}from './index.js';

class MorpionService {
    static async get_stat(to_search, token) {
        try{
            if (to_search !== undefined){
            // console.log("API/morp get_stat(2.info.1)");
            to_search = await User.findOne({where: {name: to_search}})
            // console.log("API/morp get_stat(2.info.1) to_search:",to_search)
            if (to_search === null)
                return ({success: false, message: `Hmmm no user with this name..`, code: 404});
            } else {
            // console.log("API/morp get_stat(2.info.2)");
            const user = await get_user_from_token(token);
            if (!user.success)
                return ({ success: false, message: user.message, code: 401 });
            const decoded = user.user;
            to_search = await User.findOne({where: {id: decoded.id}})
            // console.log("API/morp get_stat(2.info.2) to_search:",to_search)
            if (to_search === null)
                return ({success: false, message: `Hmmm no user with this name..`, code: 404});
            }
            console.log("API/morp get_stat(3)");
            const result_stats = await StatMorp.findOne({where: {idUser: to_search.id}});
            return ({success: true, stat_user: result_stats, code: 201})
        } catch(err) {
            return ({success: false, message: err, code: 500});
        }
    }

    static async get_history(to_search, page, limit, token) {
        try{
            if (to_search !== undefined){
                // console.log("API/morp get_stat(2.info.1)");
                to_search = await User.findOne({where: {name: to_search}})
                // console.log("API/morp get_stat(2.info.1) to_search:",to_search)
                if (to_search === null)
                    return ({success: false, message: `no user with this name..`, code: 404});
            } else {
                // console.log("API/morp get_stat(2.info.2)");
                const user = await get_user_from_token(token);
                if (!user.success)
                    return ({ success: false, message: user.message, code: 401 });
                const decoded = user.user;
                to_search = await User.findOne({where: {id: decoded.id}})
                // console.log("API/morp get_history(2.info.2) to_search:",to_search)
                if (to_search === null)
                    return ({success: false, message: `no user with this name..`, code: 404});
            }
            const offsetpage = limit * (page - 1)
            console.log("offsetpage", offsetpage)
            console.log("limit", limit)
            const result_history = await GameMorp.findAll({where: {[Op.or]: [{ player_1: to_search.id }, { player_2: to_search.id }]}, limit: limit, offset: offsetpage, order: [['id', 'DESC']], include: [
                                    { model: User, as: 'player1', attributes: ['name'] },
                                    { model: User, as: 'player2', attributes: ['name'] },
                                    { model: User, as: 'winnerUser', attributes: ['name'] },
                                    { model: User, as: 'loserUser', attributes: ['name'] },
                                ]});

            console.log("result_history", result_history)
            console.log("API/morp get_history(4) result_history", result_history);

            if (!result_history.length)
                return ({success: true, message: "no history", code: 200 });
            return ({success: true, message: "data in history_user with name on name", history_user: result_history, name: to_search.name, code: 201});
        }catch(err){
            return ({success: false, message: "API/morp get_history(catch) " + err, code: 500});
        }
    }
}

export default MorpionService;

