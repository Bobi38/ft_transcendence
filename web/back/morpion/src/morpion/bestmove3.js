    const winCombos = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
    ];

    function checkWinner(board) {
    for (let combo of winCombos) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
    }
    }
    return board.includes(" ") ? null : "draw";
    }

    function minimax(board, isMaximizing) {
    const result = checkWinner(board);

    if (result === "X") return -1;
    if (result === "O") return 1;
    if (result === "draw") return 0;

    if (isMaximizing) {
    let bestScore = -Infinity;

    for (let i = 0; i < 9; i++) {
        if (board[i] === " ") {
        board[i] = "O";
        let score = minimax(board, false);
        board[i] = " ";
        bestScore = Math.max(score, bestScore);
        }
    }
    return bestScore;

    } else {
    let bestScore = Infinity;

    for (let i = 0; i < 9; i++) {
        if (board[i] === " ") {
        board[i] = "X";
        let score = minimax(board, true);
        board[i] = " ";
        bestScore = Math.min(score, bestScore);
        }
    }
    return bestScore;
    }
    }

function bestMove(board) {
    let bestScore = -Infinity;
    let move = null;

    for (let i = 0; i < 9; i++) {
    if (board[i] === " ") {
        board[i] = "O";

        let score = minimax(board, false);

        board[i] = " ";

        if (score > bestScore) {
        bestScore = score;
        move = i;
        }
    }
    }

    return move;
}