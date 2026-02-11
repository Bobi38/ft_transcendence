je t’aide à écrire le serveur exact

ou on ajoute le plateau & les tours

ou on nettoie SocketManag (typage, offListeners)

{
  type: "morpion",
  action: "waiting" | "start",
  mess: { ... }
}

SocketM.sendd({
  type: "morpion",
  action: "join"
});

let waitingPlayer = null;

onMessage(ws, data) {
  if (data.type !== "morpion") return;

  if (data.action === "join") {
    if (!waitingPlayer) {
      waitingPlayer = ws;
      ws.send({
        type: "morpion",
        action: "waiting"
      });
    } else {
      // associer les deux
      ws.send({
        type: "morpion",
        action: "start",
        mess: { player: 2 }
      });

      waitingPlayer.send({
        type: "morpion",
        action: "start",
        mess: { player: 1 }
      });

      waitingPlayer = null;
    }
  }
}
