import './Morpion1.css'

import { useState } from 'react';

let data = {
    playerid: undefined,
    partyid: undefined,
    message: undefined,
    played: undefined,
    tab: [],
    winner: false,
    isStart: false
}

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
    function handleClick(i) {
      fetch('/api/move', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          partyId,
            index: i,
          player: xIsNext ? "X" : "O"
        })
    })
    .then(res => res.json())
    .then(data => {
        setSquares(data.board);
        setXIsNext(!xIsNext);
        });
    }


  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = winner + ' a gagné';
  } else {
    status = 'Prochain tour : ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}


export default function Morpion() {
    console.log("nouvelle connection a morpion");
    const game = async () => {
        const reponse = await fetch('/api/Morpion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        })
        const result = await reponse.json();
        if (result.success){

        }

        } 
    }
