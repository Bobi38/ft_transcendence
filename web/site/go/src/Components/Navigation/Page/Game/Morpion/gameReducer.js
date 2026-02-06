export const initialState = {
  partyId: null,
  player: null,
  playerNumber: null,
  start: false,
  message: "non initialliser",
  board: Array(9).fill(null),
  boardMasked: Array(9).fill(null),
};

export function gameReducer(state, action) {
  switch (action.type) {
    case "CREATE_GAME":
    case "JOIN_GAME":
      return {
        ...state,
        partyId: action.payload.partyId,
        player: action.payload.player,
        playerNumber: action.payload.playerNumber,
        start: action.payload.start,
        message: action.payload.message,
        board: action.payload.board,
        boardMasked: Array(9).fill(null),
      };

    case "PLAY_MOVE":
      const newBoardMasked = [...state.boardMasked];
      newBoardMasked[action.payload.index] = state.playerNumber;

      return {
        ...state,
        boardMasked: newBoardMasked,
        message: action.payload.message,
      };

    case "PLAY_MOVE":
      return {
        ...state,
        boardMasked: action.payload.boardMasked,
        message: action.payload.message,
      };

    default:
      return state;
  }
}
