let nextPartyId = 0;
let waitingParty = -1;
const parties = {};

const createParty = () => ({
  player1: undefined,
  player2: undefined,
  board: Array(9).fill(null),
  moves: [],
  nextTurn: 1,
});

export const rootTruc = async (req, res) => {
  try {
    let playerId = req.body.playerId;
    if (!playerId) {
      playerId = Date.now() + Math.random();
    }

    const existingParty = Object.values(parties).find(
      (p) => p.player1 === playerId || p.player2 === playerId
    );

    if (existingParty) {
      const playerNumber = existingParty.player1 === playerId ? 1 : 2;
      const start = !!existingParty.player2;
      const message = start ? "Tous les joueurs sont là !" : "En attente du joueur 2...";
      return res.status(200).json({
        success: true,
        body: {
          partyId: Object.keys(parties).find((k) => parties[k] === existingParty),
          player: playerId,
          playerNumber,
          start,
          message,
          board: existingParty.board,
        },
      });
    }

    let partyId;
    let start;
    let message;
    let playerNumber;

    if (waitingParty === -1) {
      partyId = nextPartyId++;
      waitingParty = partyId;

      const party = createParty();
      party.player1 = playerId;
      parties[partyId] = party;

      start = false;
      message = "En attente du joueur 2...";
      playerNumber = 1;
    } else {
      partyId = waitingParty;
      waitingParty = -1;

      const party = parties[partyId];
      party.player2 = playerId;

      start = true;
      message = "Tous les joueurs sont là ! La partie peut commencer.";
      playerNumber = 2;
    }

    const party = parties[partyId];

    return res.status(201).json({
      success: true,
      body: {
        partyId,
        player: playerId,
        playerNumber,
        start,
        message,
        board: party.board,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

export const playMove = async (req, res) => {
  try {
    const { partyId, playerNumber, index } = req.body;

    const party = parties[partyId];
    if (!party) throw new Error("Partie introuvable");

    if (party.nextTurn !== playerNumber) {
      return res.status(400).json({ success: false, message: "Pas votre tour !" });
    }

    if (party.board[index] !== null) {
      return res.status(400).json({ success: false, message: "Case déjà jouée" });
    }

    party.board[index] = playerNumber;
    party.moves.push({ index, playerNumber });

    party.nextTurn = playerNumber === 1 ? 2 : 1;

    return res.status(200).json({
      success: true,
      body: {
        board: party.board,
        message: `Joueur ${playerNumber} a joué`,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};


// router.use(async (req, res, next) => {
//   const token = req.cookies.token;
//   console.log("Middleware auth for path:", req.path);
//   if (!token && req.path !== '/' && req.path !== '/login' && req.path !== '/register' && req.path !== '/truc') {
//     return res.status(401).json({ success: false, redirect: true});
//   }
//   if (!token && (req.path === '/' || req.path === '/login' || req.path === '/register' || req.path === '/truc')) {
//     return next() ;
//   }
//   const valid = await checktok(token);
//   if (valid === 1) {           
//     console.log("token not valid");
//     res.clearCookie('token');  
//     return res.status(401).json({ success: false, redirect: true});
//   }

//   // console.log("token valid");
//   next();                  
// });