import ws from 'ws';
import { WebSocketServer } from 'ws';
import {chat} from '../fct.js';
import cookie from 'cookie' ;


export function initWebSocket(server) {
  const wss = new WebSocketServer({ server, path: '/ws' });

  console.log('WebSocket server initialized on path /ws');
  
  wss.on('connection', (socket, req) => {
    console.log('Nouvelle connexion WebSocket de', req.socket.remoteAddress);
    console.log('URL:', req.url);
    console.log('Headers upgrade:', req.headers.upgrade);
    // console.log('Nombre de clients connectés :', clients.length);
    
    // Test: envoie un message de bienvenue
    socket.send(JSON.stringify({type: 'null', mess:"Connexion établieeeeeeeeeeeeeeee!"}));
    let userid = null;
    console.log("taille =" , chat.countUser());
    socket.on('message', (message) => {          
      try{
        const data = JSON.parse(message.toString());
        console.log('=== MESSAGE REÇU ===');
        console.log('Type:', data.type);
        console.log('Contenu:', data.mess);
        console.log('id: ', data.id);
        console.log('===================');
        if (data.type === 'auth'){
          userid = data.id;
          const use = chat.finduser(userid);
          if (use){
            use.socket = socket;
            console.log("user already exist");
            return ;
          }
          chat.addtok(userid, socket);
          socket.send(JSON.stringify({type: 'auth_success', id: userid, mess: 'auth goog'}));
          return ;
        }
        if (data.type === 'mess'){
          console.log("je suis dans un type messsssssssss")
          const nono = chat.decoded(data.id);
          console.log ("----" , nono , "----" );
          for (const session of chat.sessions.values()){
            console.log("idddd " + session.userId + "   "  +  nono.id + "-----");
            if (session.socket.readyState === ws.OPEN && session.userId != nono.id){ //&& session.userId != nono.id
                console.log("ca va SEND from server " + data.id);
                // session.socket.send(JSON.stringify({type: "message", id: userid, mess: "JE SUIS LE SERVER " + data.mess + " from " + userid }));
                session.socket.send(JSON.stringify({type: 'message', id: nono.id, mess: data.mess}));
            }
          }
        }
      }catch (err){
        console.log("err serv ws= " + err);
      }
      });

    // socket.on('close', () => {
    //   console.log('Client déconnecté');
    //   const index = clients.indexOf(socket);
    //   if (index !== -1) clients.splice(index, 1);
    //     console.log('Nombre de clients connectés :', clients.length);
    // });

    socket.on('error', (error) => {
      console.error('Erreur WebSocket:', error);
    });
  });
}

// export function initWebSocket(server) {
//   const wss = new WebSocketServer({ server, path: '/ws' });

//   const clients = [];

//   console.log('WebSocket server initialized on path /ws');
  
//   wss.on('connection', (socket, req) => {
//     console.log('Nouvelle connexion WebSocket de', req.socket.remoteAddress);
//     console.log('URL:', req.url);
//     console.log('Headers upgrade:', req.headers.upgrade);
    
//     clients.push(socket);
//     console.log('Nombre de clients connectés :', clients.length);
    
//     // Test: envoie un message de bienvenue
//     socket.send("Connexion établie!");
    
//     socket.on('message', (message) => {
//       console.log('=== MESSAGE REÇU ===');
//       console.log('Type:', typeof message);
//       console.log('Contenu:', message.toString());
//       console.log('===================');
      
//       clients.forEach((client) => {
//         if (client.readyState === ws.OPEN) {
//           client.send("JE SUIS LE SERVER " + message.toString());
//         }
//       });
//     });

//     socket.on('close', () => {
//       console.log('Client déconnecté');
//       const index = clients.indexOf(socket);
//       if (index !== -1) clients.splice(index, 1);
//       console.log('Nombre de clients connectés :', clients.length);
//     });

//     socket.on('error', (error) => {
//       console.error('Erreur WebSocket:', error);
//     });
//   });
  
//   wss.on('error', (error) => {
//     console.error('Erreur WebSocketServer:', error);
//   });
// }



// export function initWebSocket(server) {
//   const wss = new WebSocketServer({ server, path: '/ws' });

//   const chat = new Chat();

//   // server.on('upgrade', (req, socket, head) => {
    
//   // })
//   console.log('WebSocket server initialized');
//   // console.log('WebSocket server initialized');
//   console.log(wss.readyState);
//   wss.on('connection', (socket, req) => {
//     console.log('Nouvelle connexion WebSocket ', req.socket.remoteAddress);
//     const toto = cookie.parse(req.headers.cookie || '');
//     console.log ("f------ ", toto.token);
//     if (chat.finduser(toto.token) === null)
//         chat.addtok(toto.token, socket);
//     console.log("taille === ", chat.countUser());
//     socket.on('message', (message) => {
//       console.log("JE SUIS LA");
//       console.log('Message reçu :', message.toString());
//       for(const session of chat.sessions.values()){
//         const clientSo = session.socket;
//         if (clientSo.readyState === clientSo.OPEN)
//             clientSo.send("REP TO SERV === " , message.toString() );
//       }
//     });

//     // socket.on('close', () => {
//     //   console.log('Client déconnecté');
//     //   const index = clients.indexOf(socket);
//     //   if (index !== -1) clients.splice(index, 1);
//     // });
//     // socket.on('close', () => {
//     //   console.log('Client déconnecté');
//     //   const index = clients.indexOf(socket);
//     //   if (index !== -1) clients.splice(index, 1);
//     // });
//   });
//   }


// export function initWebSocket(server) {
//   const wss = new WebSocketServer({ server, path: '/ws' });

//   console.log(wss.readyState);
//   wss.on('connection', (socket, req) => {
//     console.log("INSIDE");
//     socket.on('message', (message) => {
//       console.log("totototo");
//       const data = JSON.parse(message);
//       console.log("dans server----------------------" , chatt.countUser())
//       console.log('Message reçu :', message.toString());
//       for (const session of chatt.sessions.values()) {
//         const wsClient = session.socket;
//         console.log (session.token === data.message ? 1 : 0);
//         if (wsClient.readyState === wsClient.OPEN) {
//           wsClient.send(message.toString());
//       }
//       }
//     });

//     // socket.on('close', () => {
//     //   console.log('Client déconnecté');
//     //   const index = clients.indexOf(socket);
//     //   if (index !== -1) clients.splice(index, 1);
//     // });
//   });
// }

//socket.io
//express-ws