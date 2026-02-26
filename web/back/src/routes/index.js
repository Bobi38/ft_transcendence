import express from 'express';

import User  from '../models/user.js';
import Co  from '../models/connect.js';
import ChatG from '../models/test.js';
import PrivMess from '../models/privmess.js';
import PrivChat from '../models/privchat.js';
import Friend from '../models/friend.js';
import PswEmail from '../models/PssWrdEmail.js';
import StatMorp from '../models/StatMorp.js';
import GameMorp from '../models/GameMorp.js';
import HistoryMorp from '../models/HistoryMorp.js';

const newrouter = express.Router();




export {
    // secret_chat,
    // secret,
    // checktok,
    User,
    Co,
    ChatG,
    PrivMess,
    PrivChat,
    Friend,
    PswEmail,
    StatMorp,
    GameMorp,
    HistoryMorp,
};

export default newrouter;