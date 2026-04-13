
import bcrypt from 'bcrypt';
import { encrypt } from './routes/crypt.js';

import sequelize from './models/index.js';
import User from './models/user.js';
import Friend from './models/friend.js';
import PrivChat from './models/privchat.js';
import PrivMess from './models/privmess.js';
import chatG from './models/chatG.js';
import GameMorp from './models/GameMorp.js';
import StatMorp from './models/StatMorp.js';
import Connect from './models/connect.js';

import GamePong3D from './models/GamePong3D.js';
import StatPong3D from './models/StatPong3D.js';
import PswEmail from './models/PssWrdEmail.js';

// creatdb
//import { CreatGameMorp } from './morpion/seedmorp.js';

async function majDb(retry = 5) {
    while (retry > 0) {
        try {
            await sequelize.authenticate();
            await sequelize.sync({ alter: true });
            console.log('la table a ete mise a jour avec succes.');
            break;
        } catch (error) {
            retry -= 1;
            await new Promise(res => setTimeout(res, 5000));
            continue;
        }
    }
}

export {majDb};
