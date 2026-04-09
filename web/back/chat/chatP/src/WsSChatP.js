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
        socket.close(1008, 'Unauthorized');
        return;
      }

      if (!user) {socket.close(); return; }
      const useid = user.id;
      socket.userId = useid;
      socket.GoLogout = false;
      socket.cleanedUp = false;
      socket.isAlive = true;

      // const exist = chat.finduser(socket.id);
      // const id = chat.finduserId(socket.userId);
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
        socket.send(JSON.stringify({type: "auth_good"}));
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
            console.log(session.username, " " , session.userId, " ", session.socket.id);
            if (send && session.socket.readyState === ws.OPEN && session.userId === send.userId){
              console.log("le message " , data.message, " va etre envoye a ", session.username, " ", session.userId, " ", session.socket.id);
              session.socket.send(JSON.stringify({type: 'priv_mess',monMsg: false, message: data.message, login: ni, timer: data.timer}));
              session.socket.send(JSON.stringify({type: 'notif', login: ni}));
              console.log("message envoye a ", session.username, " ", session.userId, " ", session.socket.id);
            }
            if (session.socket.readyState === ws.OPEN && session.userId === nono){
              console.log("innnnnnn" , session.username, " " , session.userId, " ", session.socket.id);
              session.socket.send(JSON.stringify({type: 'priv_mess',monMsg: true, message: data.message, login: ni, timer: data.timer}));
            }
          }
        }
        if (data.type === "logout"){
          socket.GoLogout = true;
          // socket.close();
        }
        if (data.type === "pong")
          socket.isAlive = true;
        if (data.type === 'updateName'){
          console.log("je suis dans un type updateName de ", socket.userId, " ", data.old_name, " ", data.new_name);
          const nono = socket.userId;
          for (const session of chat.sessions.values()){
            if (session.userId == nono && session.username == data.old_name)
              session.username = data.new_name;
            if (session.socket.readyState === ws.OPEN && session.userId !== nono)
              session.socket.send(JSON.stringify({type: 'updateName_good', old_name: data.old_name, new_name: data.new_name}));
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
        if (socket.cleanedUp) return; // already handle
        socket.cleanedUp = true;

        const id = socket.userId;
        if (!id) return;
        if (socket.GoLogout == true){
          console.log('Utilisateur déconnNNNNecté', socket.id);
          chat.removetokBySocketId(socket.id);
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
      if (!so || !so.isAlive || so.readyState !== ws.OPEN) {
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