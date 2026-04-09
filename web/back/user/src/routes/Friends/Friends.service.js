import {Op} from '../index.js';
import {User, Friend, format_all_friend, get_user_from_token, format_all_request_friend} from '../index.js';


class FriendService {

    static async getAllFriend(token) {
        try{
            const user = await get_user_from_token(token);
            if (!user.success)
                return { success: false, message: user.message };
            const decoded = user.user;
            const result = await User.findAll({
                        where: { id: decoded.id },
                        include: [{
                            model: User,
                            as: 'Friends',
                            attributes: ['id', 'name', 'co'],
                            through: { where: { State: true }, attributes: [] },
                            required: false
                        },
                        {
                            model: User,
                            as: 'FriendOf',
                            attributes: ['id', 'name', 'co'],
                            through: { where: { State: true }, attributes: [] },
                            required: false
                        },]});
            const ret = format_all_friend(result[0]);
            console.log("ret",ret);
            return ({success: true, message: ret, code: 200});
        }catch(err){
            return ({success: false, message: "err all_friend back" + err});
        }
    }

    static async addFriend(name, token) {
        try{
            const user = await get_user_from_token(token);
            if (!user.success)
                return { success: false, message: user.message };
            const decoded = user.user;
            const name_friend = await User.findOne({where: {name: name}});
            if (!name_friend)
                return ({success: false, message: "new friend doesn't exist", code: 404});
            if (name_friend.id === decoded.id)
                return ({success: false, message: "you can't add yourself as a friend", code: 400});
            const relation = await Friend.findAll({where: {[Op.or]: [{Friend1: decoded.id, Friend2: name_friend.id}, {Friend1: name_friend.id, Friend2: decoded.id}]}})
            if (relation.length > 0)
                return ({success: false, message: "relation already exist", code: 409});
            await Friend.create({Friend1: decoded.id, Friend2: name_friend.id, State: false, WhoAsk: decoded.id});
            return ({success: true, message: "friend request sent", code: 201});
        }catch(err){
            return ({success: false, message: "err back add_friend " + err, code: 500});
        }
    }

    static async deleteFriend(name, token) {
        try{
            const user = await get_user_from_token(token);
            if (!user.success)
                return { success: false, message: user.message };
            const result = user.user;
            const nfriend = await User.findOne({where: {name: name}});
            if (!nfriend)
                return ({success: false, message: "friend doesn't exist", code: 404});
            const relation = await Friend.destroy({where: {[Op.or]: [{Friend1: result.id, Friend2: nfriend.id}, {Friend1: nfriend.id, Friend2: result.id}]}})
            if (relation === 0)
                return res.status(404).json({success: false, message: "relation"});
            return res.status(201).json({success: true});
        }catch(err){
            return res.status(500).json({success: false, message: "err back add_friend ", err});
        }
    }

    static async request(token){
        try{
            const user = await get_user_from_token(token);
            if (!user.success)
                return { success: false, message: user.message };  
            const result = user.user;
            const relation = await Friend.findAll({where:  {State: false,[Op.or]: [{Friend1: result.id}, {Friend2: result.id}]}, 
                                                include:[
                                                    {
                                                        model: User,
                                                        as: 'User1',
                                                        attributes: ['id', 'name']
                                                    },
                                                    {
                                                        model: User,
                                                        as: 'User2',
                                                        attributes: ['id', 'name']														
                                                    }
                                                ]})

            if (relation.length === 0){
                return ({success: true, message: [], code: 201})
            }
            console.log(relation[0].User1.name)
            const formated_relation = format_all_request_friend(result.name, relation)
            console.log(formated_relation)
            return ({success: true, message: formated_relation, code: 201})      
        }catch(err){
            return ({success: false, message: "error /all_request_friend back " + err, code: 500})
        }
    }

    static async response(login, response, token){
        try{
            let acceptt;
            const user = await get_user_from_token(token);
            if (!user.success)
                return { success: false, message: user.message, code: user.code};  
            const result = user.user;
            const friend = await User.findOne({ where: { name: login } });
            const relat = await Friend.findOne({where: { [Op.or]: [{Friend1: result.id, Friend2: friend.id}, {Friend1:friend.id , Friend2: result.id}]}})
            if (relat.length === 0)
                return ({success: false, message: "relation doesn't exist", code: 409})
            if (response){
                await relat.update({State: true})
                acceptt = true;
            }
            else{
                await relat.destroy();
                acceptt = false;
            }
            return ({success: true, message: "good", accept: acceptt, login: login, code: 201})
        }catch(err){
            return ({success: false, message: "error /all_request_friend back " + err, code: 500})
        }
    }

    static async isFriend(name, token){
        try{
            const user = await get_user_from_token(token);
            if (!user.success)
                return { success: false, message: user.message, code: user.code};  
            const result = user.user;
            const friend = await User.findOne({ where: { name: name } });
            if (!friend)
                return ({success: false, message: "invalid name", code: 404});
            const relation = await Friend.findAll({where: {[Op.or]: [{Friend1: result.id, Friend2: friend.id}, {Friend1: friend.id, Friend2: result.id}]}})
            if (relation.length === 0)
                return ({success: false, message: "no relation", code: 404});
            if (relation[0].State === false)
                return ({success: false, message: "wait", code: 400});
            return ({success: true, message: "is friend", code: 200});
        }catch(err){
            return ({success: false, message: "err back is_friend " + err, code: 500});
        }
    }
}

export default FriendService;
