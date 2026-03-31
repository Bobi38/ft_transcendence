#include <stdio.h>
#include <stdlib.h>
#include <limits.h>

#define ROWS 6
#define COLS 7
#define EMPTY 0
#define PLAYER 2
#define AI 1

int board[ROWS][COLS];

// Affiche le plateau
void printBoard() {
    printf("\n");
    for (int r = 0; r < ROWS; r++) {
        for (int c = 0; c < COLS; c++) {
            char ch = board[r][c] == PLAYER ? 'X' : board[r][c] == AI ? 'O' : '.';
            printf("%c ", ch);
        }
        printf("\n");
    }
    for(int c = 0; c < COLS; c++) printf("%d ", c);
    printf("\n\n");
}

// Vérifie si une colonne est jouable
int isValidMove(int col) {
    return board[0][col] == EMPTY;
}

// Joue un coup
void makeMove(int col, int piece) {
    for (int r = ROWS - 1; r >= 0; r--) {
        if (board[r][col] == EMPTY) {
            board[r][col] = piece;
            break;
        }
    }
}

// Annule un coup
void undoMove(int col) {
    for (int r = 0; r < ROWS; r++) {
        if (board[r][col] != EMPTY) {
            board[r][col] = EMPTY;
            break;
        }
    }
}

// Vérifie si quelqu'un a gagné
int checkWin(int piece) {
    // horizontal
    for (int r = 0; r < ROWS; r++)
        for (int c = 0; c < COLS - 3; c++)
            if (board[r][c]==piece && board[r][c+1]==piece && board[r][c+2]==piece && board[r][c+3]==piece)
                return 1;
    // vertical
    for (int c = 0; c < COLS; c++)
        for (int r = 0; r < ROWS - 3; r++)
            if (board[r][c]==piece && board[r+1][c]==piece && board[r+2][c]==piece && board[r+3][c]==piece)
                return 1;
    // diagonale 
    for (int r = 0; r < ROWS - 3; r++)
        for (int c = 0; c < COLS - 3; c++)
            if (board[r][c]==piece && board[r+1][c+1]==piece && board[r+2][c+2]==piece && board[r+3][c+3]==piece)
                return 1;
    // diagonale /
    for (int r = 3; r < ROWS; r++)
        for (int c = 0; c < COLS - 3; c++)
            if (board[r][c]==piece && board[r-1][c+1]==piece && board[r-2][c+2]==piece && board[r-3][c+3]==piece)
                return 1;
    return 0;
}

// Plateau plein ?
int isFull() {
    for (int c = 0; c < COLS; c++)
        if (board[0][c] == EMPTY) return 0;
    return 1;
}

// Évaluation simple + bonus centre
int evaluate() {
    int score = 0;
    if (checkWin(AI)) score += 1000;
    if (checkWin(PLAYER)) score -= 1000;

    // bonus colonne centrale
    for (int r = 0; r < ROWS; r++)
        if (board[r][COLS/2] == AI) score += 3;
        else if (board[r][COLS/2] == PLAYER) score -= 3;

    return score;
}

// Minimax + alpha-beta pruning
int minimax(int depth, int alpha, int beta, int maximizingPlayer) {
    int score = evaluate();
    if (score >= 1000 || score <= -1000 || depth == 0 || isFull()) return score;

    if (maximizingPlayer) {
        int maxEval = INT_MIN;
        for (int c = 0; c < COLS; c++) {
            if (isValidMove(c)) {
                makeMove(c, AI);
                int eval = minimax(depth - 1, alpha, beta, 0);
                undoMove(c);
                if (eval > maxEval) maxEval = eval;
                if (eval > alpha) alpha = eval;
                if (beta <= alpha) break;
            }
        }
        return maxEval;
    } else {
        int minEval = INT_MAX;
        for (int c = 0; c < COLS; c++) {
            if (isValidMove(c)) {
                makeMove(c, PLAYER);
                int eval = minimax(depth - 1, alpha, beta, 1);
                undoMove(c);
                if (eval < minEval) minEval = eval;
                if (eval < beta) beta = eval;
                if (beta <= alpha) break;
            }
        }
        return minEval;
    }
}

// Trouve le meilleur coup pour l'IA
int bestMove() {
    int bestScore = INT_MIN;
    int move = -1;

    // Priorité centre, coins
    int priority[COLS] = {3,2,4,1,5,0,6};

    for (int i = 0; i < COLS; i++) {
        int c = priority[i];
        if (isValidMove(c)) {
            makeMove(c, AI);
            int score = minimax(6, INT_MIN, INT_MAX, 0); // profondeur 6 pour forte IA
            undoMove(c);
            if (score > bestScore) {
                bestScore = score;
                move = c;
            }
        }
    }
    return move;
}

// Boucle principale
int main() {
    // Init plateau
    for (int r = 0; r < ROWS; r++)
        for (int c = 0; c < COLS; c++)
            board[r][c] = EMPTY;

    printBoard();

    int turn = PLAYER; // joueur commence
    while (1) {
        int col;
        if (turn == PLAYER) {
            printf("Votre coup (0-6) : ");
            scanf("%d", &col);
            if (col < 0 || col >= COLS || !isValidMove(col)) {
                printf("Colonne invalide!\n");
                continue;
            }
        } else {
            col = bestMove();
            printf("IA joue en colonne %d\n", col);
        }

        makeMove(col, turn);
        printBoard();

        if (checkWin(turn)) {
            if (turn == PLAYER) printf("Vous avez gagné !\n");
            else printf("IA a gagné !\n");
            break;
        }

        if (isFull()) {
            printf("Match nul !\n");
            break;
        }

        turn = (turn == PLAYER) ? AI : PLAYER;
    }

    return 0;
}