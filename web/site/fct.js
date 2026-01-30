import sequelize from './models/index.js';
import jwt from 'jsonwebtoken';
import {secret} from './go/router.js';
import User from './models/user.js';
import ChatG from './models/test.js';
import bcrypt from 'bcrypt';
const secrett = 'toto';


class Chat {
  constructor() {
    this.sessions = new Map();
  }
  addtok(token, socket) {
    try {
      const decoded = jwt.verify(token, secrett);
      this.sessions.set(token, {userId: decoded.id,socket});
      console.log("WS enregistré user", decoded.id);
      return decoded.id;
    } catch (err) {
      console.log("Token invalide:", err.message);
      return null;
    }
  }
  finduser(token) {
    return this.sessions.get(token) || null;
  }
  removetok(token) {
    this.sessions.delete(token);
  }
  countUser(){
    return this.sessions.size;
  }
  decoded(token){
    try{
      const decodeded = jwt.verify(token, secrett);
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

async function addDb(){
  const count = await User.count();
    if (count === 0){
      majDb();
      const CrypPass = await bcrypt.hash('tt', 10);
      const CrypPassNi = await bcrypt.hash('12', 10);
      await User.create({name: 'toto', password: CrypPass, mail: 'toto@test.c', co: false, win: 0, total_part: 100});
      await User.create({name: 'titi', password: CrypPass, mail: 'titi@test.c', co: false, win: 0, total_part: 0});
      await User.create({name: 'ni', password: CrypPassNi, mail: 'ni@g.fr', co: false, win: 50, total_part: 0});
      await ChatG.create({contenu: ""});
      majDb();
      
    }
}


export const chat = new Chat();
export { majDb };
export {addDb}