import User from './models/user.js';
import jwt from 'jsonwebtoken';

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

export const chat = new Chat();