import { useReducer, useEffect } from "react";

export const initial = {
  message: "data non initialise",
  partyId: undefined,
  player: undefined,
  tab: Array(9).fill(null),
  start: false,
  move: undefined,
};

function gameReducer(state, action) {
  switch (action.type) {
    case "CREATE_GAME":
      return {
        ...state,
        message: action.payload.message,
        partyId: action.payload.partyId,
        player: action.payload.player,
        start: false,
      };
    case "JOIN_GAME":
      return {
        ...state,
        message: action.payload.message,
        player: action.payload.player,
        start: true,
      };
    case "PLAY_MOVE":
      const newTab = [...state.tab];
      newTab[action.payload.index] = action.payload.player;
      return {
        ...state,
        tab: newTab,
        move: action.payload.index,
        message: action.payload.message,
      };
    default:
      return state;
  }
}

export default function Truc() {
  const [state, dispatch] = useReducer(gameReducer, initial);

  useEffect(() => {
    const newGame = async () => {
      try {
        const response = await fetch("/api/truc", postJson(initial));
        const result = await response.json();

        if (!result.success) throw new Error(result.message);

        const data = result.data;

        if (!data.start) {
          dispatch({ type: "CREATE_GAME", payload: data });
        } else {
          dispatch({ type: "JOIN_GAME", payload: data });
        }
      } catch (err) {
        console.error(err);
      }
    };

    newGame();
  }, []);

  return (
    <div className="status">
      <p><strong>Status:</strong> {state.message}</p>
      <p><strong>Party:</strong> {state.partyId ?? "en attente"}</p>
      <p><strong>Joueur:</strong> {state.player ?? "en attente"}</p>
      <p><strong>Plateau:</strong> {state.tab.join(" | ")}</p>
    </div>
  );
}