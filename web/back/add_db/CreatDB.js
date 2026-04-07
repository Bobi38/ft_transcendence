
import bcrypt from 'bcrypt';
import { encrypt } from './routes/crypt.js';

import sequelize from './models/index.js';
//model
import User from './models/user.js';
import Friend from './models/friend.js';
import PrivChat from './models/privchat.js';
import PrivMess from './models/privmess.js';
import chatG from './models/test.js';
import GameMorp from './models/GameMorp.js';
import StatMorp from './models/StatMorp.js';
import Connect from './models/connect.js';

import GamePong3D from './models/GamePong3D.js';
import StatPong3D from './models/StatPong3D.js';
import PswEmail from './models/PssWrdEmail.js';

// creatdb
import { CreatGameMorp } from './seedmorp.js';



async function CreatUser() {

    const CrypPass = await bcrypt.hash('tt', 10);
    const toto = await User.create({name: 'tr1', password: CrypPass, mail: 'tr1@yopmail.com', co: false});
    const titi = await User.create({name: 'tr2', password: CrypPass, mail: 'tr2@yopmail.com', co: false});
    const tata = await User.create({name: 'tr3', password: CrypPass, mail: 'tr3@yopmail.com', co: false});
    const tutu = await User.create({name: 'tr4', password: CrypPass, mail: 'tr4@yopmail.com', co: false});
    const ni = await User.create({name: 'tr5', password: CrypPass, mail: 'tr5@yopmail.com', co: false});
    const no = await User.create({name: 'tr6', password: CrypPass, mail: 'tr6@yopmail.com', co: false});
    const na = await User.create({name: 'tr7', password: CrypPass, mail: 'tr7@yopmail.com', co: false});
}

async function fullmess(mess, Conv){
    for (let i = 0; i < 5; i++){
        const con = encrypt(mess + i);
        if (i % 2 == 0)
            await PrivMess.create({ChatId: Conv.id, SenderId: Conv.id1, contenu: con, time: new Date()})
        else
            await PrivMess.create({ChatId: Conv.id, SenderId: Conv.id2, contenu: con, time: new Date()})
        Conv.lastmess = new Date();
        await Conv.save();
    }
}

async function CreatPrivMess(){
    const toto = await User.findOne({where :{name: 'tr1'}})
    const tata = await User.findOne({where :{name: 'tr3'}})
    const titi = await User.findOne({where :{name: 'tr2'}})
    const Conv1 = await PrivChat.create({id1: toto.id, id2:tata.id});
    const Conv2 = await PrivChat.create({id1: titi.id, id2:tata.id});
    const Conv3 = await PrivChat.create({id1: toto.id, id2:titi.id});

    await fullmess("message numero ", Conv1);
    await fullmess("mess number ", Conv2);
    await fullmess("El ultimo numero ", Conv3);
}

async function CreatFriend(){
  await Friend.create({Friend1: 1, Friend2: 2, State: true, WhoAsk: 1});
  await Friend.create({Friend1: 1, Friend2: 3, State: false, WhoAsk: 1});
  await Friend.create({Friend1: 4, Friend2: 1, State: false, WhoAsk: 4});
  await Friend.create({Friend1: 5, Friend2: 1, State: true, WhoAsk: 5});
}




async function addDb(){
  const count = await User.count();
    if (count === 0){
      await CreatUser();
      console.log("User created");
      await CreatPrivMess();
      console.log("PrivMess created");
      await CreatFriend();
      console.log("Friend created");
      await CreatGameMorp();
    }
}

export {addDb};