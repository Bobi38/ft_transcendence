import sequelize from './models/index.js';
import jwt from 'jsonwebtoken';
import {secret} from './go/router.js' 



class Chat {
  constructor() {
    this.sessions = new Map();
  }
  addtok(token, socket) {
    try {
      const decoded = jwt.verify(token, secret);
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
      const decodeded = jwt.verify(token, secret);
      return decodeded;
    }catch(err){
      console.log("err decoded "  + err);
      return null;
    }
  }
}

async function majDb(retry = 5) {
  while (retry > 0) {
    try {
      await sequelize.authenticate();
      console.log('Connection good.');
      await sequelize.sync({ altert: true });
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

export const chat = new Chat();
export { majDb };