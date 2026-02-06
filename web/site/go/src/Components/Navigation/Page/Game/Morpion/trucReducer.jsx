import React, { useReducer, useEffect } from "react";
import { gameReducer, initialState } from "./gameReducer";

export default function Truc() {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  useEffect(() => {
    const newGame = async () => {
      try {
        const response = await fetch("/api/truc", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ start: false }), // client envoie start false
        });

        const result = await response.json();

        if (!result.success) throw new Error("Erreur serveur");

        const data = result.body;

        // dispatch CREATE_GAME si start = false, JOIN_GAME si start = true
        dispatch({
          type: data.start ? "JOIN_GAME" : "CREATE_GAME",
          payload: data,
        });
      } catch (err) {
        console.error(err);
      }
    };

    newGame();
  }, []);

  // Gestion d'un coup joué
  const handlePlay = (index) => {
    if (state.board[index] !== null || !state.start) return;

    dispatch({
      type: "PLAY_MOVE",
      payload: {
        index,
        playerNumber: state.playerNumber,
        message: `Joueur ${state.playerNumber} a joué !`,
      },
    });
  };

  return (
    <div>
      <h2>Partie #{state.partyId}</h2>
      <p>Vous êtes le joueur {state.playerNumber}</p>
      <p>{state.message}</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 50px)" }}>
        {state.board.map((cell, idx) => (
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
            }}
          >
            {cell ? (cell === 1 ? "X" : "O") : ""}
          </div>
        ))}
      </div>
    </div>
  );
}
