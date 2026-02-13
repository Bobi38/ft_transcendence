let waitingPlayer = null;
const cooldowns = new Map();
let games = [];

function send(socket, mess) {
    if (!socket || socket.readyState !== WebSocket.OPEN) return;

    socket.send(JSON.stringify({
    type: "truc",
    mess,
    }));
}

function reboot() {
    games.forEach(game => {
    game.players.forEach(player => {
        send(player, "ça a reboot");
        });
    });

    if (waitingPlayer) {
        send(waitingPlayer, "ça a reboot");
    }

    waitingPlayer = null;
    games = [];
}

function startGame(player1, player2) {
    const newGame = {
        players: [player1, player2],
        board: Array(9).fill(" ")
    };

    games.push(newGame);

    send(player1, "Le jeu commence - à toi de jouer");
    send(player2, "Le jeu commence - attente joueur 1");
}


function findGame(socket) {
        return games.find(game =>
        game.players.includes(socket)
    );
}

function closeGame(socket, message) {
    if (socket === waitingPlayer){
        waitingPlayer = null;
        send(socket, "bye bye");
        return
    }
    const game = findGame(socket);
    if (!game)
        return;

    const opponent = game.players.find(p => p !== socket);

    send(socket, message);
    send(opponent, "L'adversaire a quitté - victoire");

    games = games.filter(g => g !== game);
}


export function handletruc(data, socket) {
    if (cooldowns.has(socket)) {
        return;
    }

    cooldowns.set(socket, true);

    setTimeout(() => {
        cooldowns.delete(socket);
    }, 300);

    if (data.mess === "reboot") {
        reboot();
        return;
    }

    if (data.mess === "je pars") {
        closeGame(socket, "Tu as quitté la partie");
        return;
    }

    const existingGame = findGame(socket);
    if (existingGame) {
        send(socket, "La partie est en cours...");
        return;
    }

    if (!waitingPlayer) {
        waitingPlayer = socket;
        send(socket, "En attente d´un second joueur...");
    }
    else {
        startGame(waitingPlayer, socket);
        waitingPlayer = null;
    }
}

export function handleTrucDisconnect(socket) {
    console.log("Un joueur s'est déconnecté");
    
    if (waitingPlayer === socket) {
        waitingPlayer = null;
        return;
    };

    const game = findGame(socket);
    if (!game) return;

    const opponent = game.players.find(p => p !== socket);

    send(opponent, "L'adversaire s'est déconnecté - victoire");

    games = games.filter(g => g !== game);
}
