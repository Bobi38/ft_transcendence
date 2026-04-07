export {default as express}  from 'express';
export { default as bcrypt } from 'bcrypt';
export { default as jwt } from 'jsonwebtoken';
export { default as validator } from 'validator';
export { isValidPhoneNumber } from 'libphonenumber-js';
import { Op } from 'sequelize';
export { Op };
import fs from 'fs';
import cookieParser from 'cookie-parser';
import express from 'express';


import User  from '../models/user.js';
import Friend from '../models/friend.js';

const router = express.Router();
export const secret = fs.readFileSync('/run/secrets/cle_pswd', 'utf-8').trim();
router.use(cookieParser());

export function format_all_friend(relation) {
    const  tableau = [];
    
    for(let i = 0; i < relation.FriendOf.length; i++){
        const login = relation.FriendOf[i].name;
        tableau.push({login: login});
    }

    for(let i = 0; i < relation.Friends.length; i++){
        const login = relation.Friends[i].name;
        tableau.push({login: login});
    }

    return tableau;
};

export function errorHandler(message, code, res) {
  return res.status(code).json({ success: false, message: message });
}

export async function get_user_from_token(token) {
  try {
    const decoded = jwt.verify(token, secret);
    const result = await User.findOne({ where: { id: decoded.id } });
    if (!result) {
      return { success: false, message: 'User not found' };
    }
    return { success: true, user: result };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

export function format_all_request_friend(name, relation) {
	const  Fother = [];
	const Fme = []
	
	for(let i = relation.length - 1 ;i >= 0; i--){
		const login = name === relation[i].User1.name ? relation[i].User2.name : relation[i].User1.name;
		if (relation[i].User1.name == name)
			Fme.push({login: login});
		else
			Fother.push({login: login})
	}
    
	const data ={
		Fme: Fme,
		Fother: Fother
	}
	return data;
};

export {
    User,
    Friend,
};


export default router;