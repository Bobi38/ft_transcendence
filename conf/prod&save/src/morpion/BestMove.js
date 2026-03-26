const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];
    
function checkVictory(board, move) {
    if (move == null || move < 0 || move > 8){
        console.log(`err handle`);
       return false 
    } 

    for (let [a, b, c] of lines.filter(l => l.includes(move))) {
        let char = board[a];
        if (char !== " " && char === board[b] && char === board[c]) return true;
    }

    return false;
}

function defineCurrent(board) {
    let nbX = 0;
    let nbO = 0;
    let nbOther = 0;

    for(let square of board){
        if (square === 'X')
            nbX++;
        else if (square === 'O')
            nbO++;
        else
            nbOther++;
    }

    return nbX > nbO ? "O" : "X";
}

export default function checkBestMove(board) {
    let ids = board
        .map((value, index) => value === " " ? index : null)
        .filter(v => v !== null);

    let len = ids.length;

    if (len === 0) return null;
    
    let actif = defineCurrent(board);
    let inactif = actif === "X" ? "O" : "X";
    let best = 1000;

    if (!actif) return null;

    for(let id of ids){

        board[id] = actif;
        if (checkVictory(board, id)) best = 1001;

        board[id] = inactif;
        if (checkVictory(board, id)) best = id;

        board[id] = " ";
        if (best === 1001)
            return id; 
    }

    if (best !== 1000)
        return best;
    
    if (ids.includes(4)) return 4;
    
    if (len === 1) return ids[0];

    return ids[1];
}
