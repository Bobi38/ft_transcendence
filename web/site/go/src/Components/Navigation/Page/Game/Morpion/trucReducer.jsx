import React, { useReducer, useEffect } from "react";
import { gameReducer, initialState, getPlayerId } from "./gameReducer";

export default function Truc() {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const playerId = getPlayerId();

  useEffect(() => {
    const newGame = async () => {
      try {
        const response = await fetch("/api/truc", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ start: false, playerId }),
        });

        const result = await response.json();
        if (!result.success) throw new Error("Erreur serveur");

        const data = result.body;
        dispatch({
          type: data.start ? "JOIN_GAME" : "CREATE_GAME",
          payload: data,
        });
      } catch (err) {
        console.error(err);
      }
    };

    newGame();
  }, [playerId]);


  const handlePlay = async (index) => {
    if (!state.start || state.boardMasked[index] !== null) return;

    try {
      const response = await fetch("/api/truc/move", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          partyId: state.partyId,
          playerNumber: state.playerNumber,
          index,
          playerId,
        }),
      });

      const result = await response.json();
      if (!result.success) {
        alert(result.message);
        return;
      }

      const newBoard = result.body.board;

      const newBoardMasked = state.boardMasked.map((cell, idx) =>
        cell !== null ? cell : newBoard[idx]
      );

      dispatch({
        type: "PLAY_MOVE",
        payload: {
          index,
          playerNumber: state.playerNumber,
          message: result.body.message,
          boardMasked: newBoardMasked,
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Partie #{state.partyId}</h2>
      <p>Vous êtes le joueur {state.playerNumber}</p>
      <p>{state.message}</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 50px)", gap: 5 }}>
        {state.boardMasked.map((cell, idx) => (
          <div
            key={idx}
            onClick={() => handlePlay(idx)}
            style={{
              width: 50,
              height: 50,
              border: "1px solid black",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: cell ? "not-allowed" : "pointer",
              fontSize: "20px",
              backgroundColor: cell ? "#eee" : "#fff",
            }}
          >
            {cell ? (cell === 1 ? "X" : "O") : ""}
          </div>
        ))}
      </div>
    </div>
  );
}