import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import fs from 'fs';
import { encrypt } from './crypt.js';

//model
import sequelize from './models/index.js';
import User from './models/user.js';
import ChatG from './models/test.js';
import PrivChat from './models/privchat.js';
import PrivMess from './models/privmess.js';
import StatMorp from './models/StatMorp.js';
import HistoryMorp from './models/HistoryMorp.js';
import Friend from './models/friend.js';

const secret = fs.readFileSync('/run/secrets/cle_pswd', 'utf-8').trim();



class Chat {
  constructor() {
    this.sessions = new Map();
  }
  async addtok(token, socket, userId) {
    try {
        const user = await User.findByPk(userId);
      // const decoded = jwt.verify(token, secret);
        console.log("name in ", user.name);
      this.sessions.set(socket.id, { socket, userId, username: user.name });
      // console.log("WS enregistré user", decoded.id);
      return token;
    } catch (err) {
      console.log("Token invalide:", err.message);
      return null;
    }
  }

  finduserId(userId) {
    for (const session of this.sessions.values()) {
      if (session.userId === userId) {
        return session;
      }
    }
    return null;
  }

  findname(name){
    for (const session of this.sessions.values()) {
      if (session.username === name) {
        return session;
      }
    }
    return null;
  }

  finduser(socketid) {
    return this.sessions.get(socketid) || null;
  }
  removetokBySocketId(socketId) {
    this.sessions.delete(socketId);
  }
  countUser(){
    return this.sessions.size;
  }
  decoded(token){
    try{
      const decodeded = jwt.verify(token, secret);
      return decodeded;
    }catch(err){
      console.log("err "  + err);
      return null;
    }
  }
}

async function majDb(retry = 5) {
  while (retry > 0) {
    try {
      await sequelize.authenticate();
      console.log('Connection good.');
      await sequelize.sync({ alter: true });
    // await sequelize.sync({ alert: true }); A REMETTRE POUR LA PROD
      console.log('la table a ete mise a jour avec succes.');
      break;
    } catch (error) {
      retry -= 1;
      await new Promise(res => setTimeout(res, 5000));
      continue;
    }
  
  }
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
  const toto = await User.findOne({where :{name: 'toto'}})
  const tata = await User.findOne({where :{name: 'tata'}})
  const titi = await User.findOne({where :{name: 'titi'}})
  console.log("id  : " , toto.id,tata.id,titi.id);
  const Conv1 = await PrivChat.create({id1: toto.id, id2:tata.id});
  const Conv2 = await PrivChat.create({id1: titi.id, id2:tata.id});
  const Conv3 = await PrivChat.create({id1: toto.id, id2:titi.id});

  await fullmess("message numero ", Conv1);
  await fullmess("mess number ", Conv2);
  await fullmess("El ultimo numero ", Conv3);
}

async function CreatStat(){
    await HistoryMorp.create({  Map:"OX--XO-XO", 
                                Result:"has_result", 
                                WinnerId:1, 
                                Id1:1, 
                                OX1:0, 
                                Id2:2, 
                                OX2:1
    });

    await StatMorp.create({ idUser:1,
                            nbGame:1,
                            Win:5,
                            Lost:5,
                            Draw:0,
                            Abort:0,
                            WinDiag:2,
                            WinHoriz:2,
                            WinVert:6,
                            LoseDiag:0,
                            LoseHoriz:0,
                            LoseVert:0,
                            WinCercle:5,
                            WinCroix:5,
                            LostCercle:0,
                            LostCroix:0,
    });
}

async function CreatFriend(){
  await Friend.create({Friend1: 1, Friend2: 2, State: true, WhoAsk: 1});
  await Friend.create({Friend1: 1, Friend2: 3, State: true, WhoAsk: 3});
  await Friend.create({Friend1: 4, Friend2: 1, State: false, WhoAsk: 4});
  await Friend.create({Friend1: 5, Friend2: 1, State: true, WhoAsk: 1});
}

async function addDb(){
  const count = await User.count();
    if (count === 0){
      majDb();
      const CrypPass = await bcrypt.hash('tt', 10);
      const CrypPassNi = await bcrypt.hash('12', 10);
      const toto = await User.create({name: 'toto', password: CrypPass, mail: 'toto@test.c', co: false, win: 0, total_part: 100});
      const titi = await User.create({name: 'titi', password: CrypPass, mail: 'titi@test.c', co: false, win: 0, total_part: 0});
      const tata = await User.create({name: 'tata', password: CrypPass, mail: 'tata@test.c', co: false, win: 0, total_part: 0});
      const tutu = await User.create({name: 'tutu', password: CrypPass, mail: 'tutu@test.c', co: false, win: 0, total_part: 0});
      const ni = await User.create({name: 'ni', password: CrypPassNi, mail: 'ni@g.fr', co: false, win: 50, total_part: 0});
      majDb();
      await CreatPrivMess();
      majDb();
      await CreatStat();
      majDb();
      await CreatFriend();
      majDb();
    }
}


export const chat = new Chat();
export { majDb };
export {addDb}