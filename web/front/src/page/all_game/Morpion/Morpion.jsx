import { useState, useEffect } from "react";
import SocketM from "/app/front/tool/SocketManag.js";
import './Morpion.scss';

function GoOUT(){
  return (
  <button onClick={() =>
    SocketM.sendd({
        type: "game",
        message: "je pars"
      })
    }
  > 
    je veux partir
  </button>
  );
}

function NouvellePartie(){
  return (
  <button onClick={() =>
    SocketM.sendd({
        type: "game",
        message: "je veux jouer"
      })
    }
  > 
    Nouvelle Partie
  </button>
  );
}

function RebootTruc() {
  return (
    <button
      onClick={() =>
        SocketM.sendd({
          type: "game",
          message: "reboot"
        })
      }
    >
      Reboot (dev - ne pas utiliser - a supprimer en prod)
    </button>
  );
}

function SelectFirst(){
   return (
    <button
      onClick={() =>
        SocketM.sendd({
          type: "game",
          message: "playfirst"
        })
      }
    >
     je veux jouer en second
    </button>
  ); 
}

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board( { squares }) {
    function handleClick(i) {
      SocketM.sendd({
        type: "game",
        message: i,
      })
  }
 
  return (
    <>
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
  console.log("ici cest front FunctionMorpion");
  const [msg, setMsg] = useState("En attente...");
  const [board, setBoard] = useState(Array(9).fill(" "));

    useEffect(() => {
    if(SocketM.nb() === 0){
        SocketM.connect()
    }

    // SocketM.sendd({
    //       type: "game",
    //       message: "est-ce que tu me reçois ?"
    // });
    
    console.log("after co");

    const handleTest = (data) => {
      console.log(data)
      setMsg(data.message);
      if (data.board)
        setBoard(data.board);
    };

    SocketM.onGame(handleTest);

    return () => {
      SocketM.offGame(handleTest);
    }
  }, []);


    return (
    <>
      <div className="status">{msg}</div>
      <div>< RebootTruc /></div>
      <div>< GoOUT /></div>
      <div>< SelectFirst /></div>
      <div className="game-board">
        <Board squares={board}/>
      </div>
      <div>< NouvellePartie /></div>
    </>
  );
}