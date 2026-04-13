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
  const wss = new WebSocketServer({ server, path: '/ws/chatG' });

  let idd = 0;
  console.log('WebSocket server initialized on path /ws');
  wss.on('connection', async (socket, req) => {
    try{
      const iid = idd++;
      socket.id = iid;
      console.log('Nouvelle connexion WebSocket de', req.socket.remoteAddress);
      console.log('URL:', req.url);
      console.log('Headers upgrade:', req.headers.upgrade);
      console.log('Headers socket:', socket.id);
      console.log(req.headers.cookie)
      const token = getCookie('token', req.headers.cookie);

      if (!token) {
      // socket.close();
        return;
      }
      let user;
      try {
        user = chat.decoded(token);
      } catch {
        socket.close(1008, 'Unauthorized');
        return;
      }
      if (!user) { return; }
      const useid = user.id;
      socket.userId = useid;
      socket.GoLogout = false;
      socket.cleanedUp = false;
      socket.isAlive = true;
      await chat.addtok(useid, socket, useid);
      socket.send(JSON.stringify({type: "auth_good"}));
    }catch(err){
      console.log("err debut wsss ", err);
    }
    socket.on('message', (message) => {
      try{
        const data = JSON.parse(message.toString());
        console.log('=== MESSAGE REÇU IN WSCHAT ===');
        console.log('Type:', data.type);
        console.log('===================');
        if (data.type === 'mess'){
          const nono = socket.userId;
          const na = chat.finduserId(socket.userId)
          const ni = na.username;
          const now = new Date()
          const jour = String(now.getDate()).padStart(2, '0');
          const mois = String(now.getMonth() + 1).padStart(2, '0');
          const heure = String(now.getHours() + 2).padStart(2, '0');
          const minute = String(now.getMinutes()).padStart(2, '0');
          const time = `${jour}-${mois} ${heure}:${minute}`;
          for (const session of chat.sessions.values()){
            console.log("session ", session.userId);
            console.log("idddd " + session.userId + "   "  +  nono + "-----");
            if (session.socket.readyState === ws.OPEN && session.userId != nono){
              console.log("ca va SEND from server " + nono + " to " + session.userId + "name " + session.username);
              session.socket.send(JSON.stringify({type: 'message',monMsg: false, message: data.message, login: ni, timer: time}));
            }
            if (session.socket.readyState === ws.OPEN && session.userId === nono){
              console.log("MYSEFLF");
              session.socket.send(JSON.stringify({type: 'message',monMsg: true, message: data.message, login: ni, timer: time}));
            }
          }
        }
        if (data.type === "logout")
          socket.GoLogout = true;
        if (data.type === "pong")
          socket.isAlive = true;
        if (data.type === 'updateName'){
          const nono = socket.userId;
          for (const session of chat.sessions.values()){
            if (session.userId == nono && session.username == data.old_name)
              session.username = data.new_name;
            if (session.socket.readyState === ws.OPEN && session.userId != nono){
              session.socket.send(JSON.stringify({type: 'updateName_good'}));
            }
          }
          
        }       
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
        if (socket.cleanedUp) return;
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
      console.log(session.socket.id, " isAlive:", so.isAlive, "readyState:", so.readyState);
      if (!so || !so.isAlive || so.readyState != ws.OPEN) {
        console.log('Socket morte', so.id);
        chat.removetokBySocketId(so.id);
        so.terminate();
      } else {
        session.socket.isAlive = false;
        session.socket.send(JSON.stringify({ type: 'ping' }));
      }
    }
  }, 100000);
}