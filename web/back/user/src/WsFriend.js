import ws from 'ws';
import { WebSocketServer } from 'ws';
import {chat} from './ClassChat.js';
import Friend from './models/friend.js';
import User from './models/user.js';

function getCookie(name, cookieHeader) {
  if (!cookieHeader) return null;
  const match = cookieHeader
    .split(';')
    .map(c => c.trim())
    .find(c => c.startsWith(name + '='));
  return match ? decodeURIComponent(match.split('=')[1]) : null;
}

function format_all_friend(relation) {
	const  tableau = [];
	
	for(let i = 0; i < relation.FriendOf.length; i++){
		const login = relation.FriendOf[i].id;
		tableau.push({login: login});
	}

	for(let i = 0; i < relation.Friends.length; i++){
		const login = relation.Friends[i].id;
		tableau.push({login: login});
	}

	return tableau;
};

async function getAllFriendsFromToken(id) {

  const result = await User.findAll({
    where: { id: id },
    include: [
      {
        model: User,
        as: "Friends",
        attributes: ["id", "name"],
        where :{co : true},
        through: { where: { State: true }, attributes: [] },
        required: false,
      },
      {
        model: User,
        as: "FriendOf",
        attributes: ["id", "name"],
        where: {co:true},
        through: { where: { State: true }, attributes: [] },
        required: false,
      },
    ],
  });

  return format_all_friend(result[0]);
}

export function initWebSFriend(server) {
  const wss = new WebSocketServer({ server, path: '/ws/friend' });

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
        socket.close();
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
      // }
      // else if (id){
      //   id.socket = socket
      // }
      // else{
        await chat.addtok(useid, socket, useid);
        const sess = chat.finduserId(useid);
        socket.username = sess.username;
      // }
      socket.send(JSON.stringify({type: 'co_good'}));
    }catch(err){
      console.log("err debut wsss ", err);
    }
    socket.on('message', async (message) => {
      try{
        const data = JSON.parse(message.toString());
        console.log('=== MESSAGE REÇU IN WSCHAT ===');
        console.log('Type:', data.type);
        console.log('===================');
        if (data.type === "co_first"){
          const nono = socket.userId;
          const na = chat.finduserId(nono);
          const ni = na.username;
          const friend = await getAllFriendsFromToken(socket.userId);
          const friendIds = new Set(friend.map(f => f.login));
          for (const session of chat.sessions.values()){
            if (session.socket.readyState === ws.OPEN && session.userId != nono && friendIds.has(session.userId))
              session.socket.send(JSON.stringify({type: 'co', login: ni}));
          }

        }
        if (data.type === 'updateName'){
          const nono = socket.userId;
          socket.username = data.new_name;
          for (const session of chat.sessions.values()){
            if (session.userId == nono && session.username == data.old_name){
              session.socket.username = data.new_name;
              session.username = data.new_name;
            }
          }
        }
        if (data.type === 'req_frd'){
          const send = chat.findname(data.login)
          for (const session of chat.sessions.values()){
            if (session.socket.readyState === ws.OPEN && session.username === send.username)
              session.socket.send(JSON.stringify({type: 'add_frd'}));
          }
        }
        if (data.type === 'maj_frd'){
          const send = chat.findname(data.login)
          for (const session of chat.sessions.values()){
            if (session.socket.readyState === ws.OPEN && session.username === send.username)
              session.socket.send(JSON.stringify({type: 'maj_frd'}));
          }
        }
        if (data.type === "logout"){
          socket.isAlive = false;
          socket.GoLogout = true;
          const nono = socket.userId;
          for (const session of chat.sessions.values()){
            if (session.userId == nono ){
              session.socket.send(JSON.stringify({type: 'logout'}));
            }
          }
          // socket.close();
        }
        if (data.type === "pong")
          socket.isAlive = true;
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
    socket.on('close', async () => {
      try {
        console.log('WebSocket fermé', socket.id);
        if (socket.cleanedUp) return;
        socket.cleanedUp = true;
        const id = socket.userId;
        if (!id) return;
        const ni = socket.username;
        const notifyFriends = async () => {
          const friends = await getAllFriendsFromToken(id);
          const friendIds = new Set(friends.map(f => f.login));
          for (const session of chat.sessions.values()) {
            if (session.socket.readyState === ws.OPEN &&session.userId !== id &&friendIds.has(session.userId)) {
              console.log(`Notifying friend ${session.username} (${session.userId}) of ${ni}'s disconnection`);
              session.socket.send(JSON.stringify({ type: 'deco', login: ni }));
            }
          }
        };
        chat.removetokBySocketId(socket.id);
        const stillConnected = chat.finduserId(id);
        if (socket.GoLogout && !stillConnected) {
          console.log(`Utilisateur ${socket.GoLogout ? '(GoLogout)' : ''} déconnecté définitivement`, socket.id);
          await notifyFriends();
        }
      } catch (err) {
        console.error("Erreur lors de la fermeture du WS :", err);
      }
    });
  });
  setInterval(() => {
    console.log('Intervalle ping : je vérifie toutes les sockets');
    for (const session of chat.sessions.values()){
      const so = session.socket;
      console.log(session.socket.id);
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