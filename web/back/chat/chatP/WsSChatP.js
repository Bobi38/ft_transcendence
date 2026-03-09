import ws from 'ws';
import { WebSocketServer } from 'ws';
import {chat} from './ClassChat.js';


function getCookie(name, cookieHeader) {
  if (!cookieHeader) return null;
  const match = cookieHeader
    .split(';')
    .map(c => c.trim())
    .find(c => c.startsWith(name + '='));
  return match ? decodeURIComponent(match.split('=')[1]) : null;
}

export function initWebSChat(server) {
  const wss = new WebSocketServer({ server, path: '/ws/chatP' });

  let idd = 0;
  console.log('WebSocket server initialized on path /ws');
  wss.on('connection', async (socket, req) => {
    try{
      const iid = idd++;
      socket.id = iid;
      // console.log('Nouvelle connexion WebSocket de', req.socket.remoteAddress);
      // console.log('URL:', req.url);
      // console.log('Headers upgrade:', req.headers.upgrade);
      // console.log('Headers socket:', socket.id);
      // console.log(req.headers.cookie)
      const token = getCookie('token', req.headers.cookie);
      if (!token) {
      // socket.close();
        return;
      }

      let user;
      try {
        user = chat.decoded(token);
      } catch {
        socket.close();
        return;
      }

      if (!user) {socket.close(); return; }
      const useid = user.id;
      socket.userId = useid;
      socket.GoLogout = false;
      socket.cleanedUp = false;
      socket.isAlive = true;

      const exist = chat.finduser(socket.id);
      const id = chat.finduserId(socket.userId);
      // if (exist){
      //   exist.socket = socket;
      //   console.log("user already exist exist");
      // }
      // else if (id){
      //   id.socket = socket
      //   // console.log("user already exist id");
      // }
      // else{
        // console.log("new user, add to chat sessions");
        await chat.addtok(useid, socket, useid);
        // socket.send(JSON.stringify({type: 'auth_success',id: useid,mess: 'auth ok'}));
      // }
    }catch(err){
      console.log("err debut wsss ", err);
    }
    // console.log("taille =" , chat.countUser());
    socket.on('message', (message) => {
      try{
        const data = JSON.parse(message.toString());
        console.log('=== MESSAGE REÇU IN WSCHAT ===');
        console.log('Type:', data.type);
        console.log('===================');
        if (data.type === 'priv_mess'){
          console.log("je suis dans un type priv_messsssssssss")
          const nono = socket.userId;
          const na = chat.finduserId(nono);
          const ni = na.username;
          const send = chat.findname(data.to);
          console.log("name" , ni, " ", data.to)
          for (const session of chat.sessions.values()){

            if (send && session.socket.readyState === ws.OPEN && session.userId === send.userId){
              console.log("ca va SEND from server " + nono + " to " + send.userId + "name " + send.username);
              send.socket.send(JSON.stringify({type: 'priv_mess',monMsg: false, message: data.message, login: ni, timer: data.timer}));
            }
            if (send && session.socket.readyState === ws.OPEN && session.userId === nono){
              socket.send(JSON.stringify({type: 'priv_mess',monMsg: true, message: data.message, login: ni, timer: data.timer}));
            }
          }
        }
        if (data.type === "logout")
          socket.GoLogout = true;
      }catch (err){
        console.log("err serv ws= " + err);
      }
      });

    socket.on('pong', () =>{
      console.log("i m in PONG")
      socket.isAlive = true;
    })
    socket.on('error', (err) => {
      console.warn('WebSocket Error:', err.message);
    });
    socket.on('close', () => {
      try{
        if (socket.cleanedUp) return; // déjà traité
        socket.cleanedUp = true;

        const id = socket.userId;
        if (!id) return;
        if (socket.GoLogout == true){
          console.log('Utilisateur déconnNNNNecté', socket.id);
          chat.removetokBySocketId(socket.id);
        }
        else{
          setTimeout(() => {
            const id = socket.userId
            const reco = chat.finduserId(id)
            if (!reco){
              console.log('Utilisateur ne s est pas reco', socket.id);
              chat.removetokBySocketId(socket.id);
            }
          }, 2500)
        }
      }catch(err){
        console.log("error close in ws back ", err);
      }
  });
  });
  setInterval(() => {
    console.log('Intervalle ping : je vérifie toutes les sockets');
    for (const session of chat.sessions.values()){
      const so = session.socket;
      console.log(session.socket.id);
      if (!so.isAlive) {
        console.log('Socket morte', so.id);
        chat.removetokBySocketId(so.id);
        // so.terminate();
      } else {
        session.socket.isAlive = false;
        session.socket.send(JSON.stringify({ type: 'ping' }));
      }
    }
  }, 100000);
}