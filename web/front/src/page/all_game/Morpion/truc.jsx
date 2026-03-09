import { useState, useEffect } from "react";
import SocketM from "/app/tool/SocketManag.js";
import './Morpion.scss';

function GoOUT(){
  return (
  <button onClick={() =>
    SocketM.sendd({
        type: "truc",
        mess: "je pars"
      })
    }
  > 
    je veux partir
  </button>
  );
}

function RebootTruc() {
  return (
    <button
      onClick={() =>
        SocketM.sendd({
          type: "truc",
          mess: "reboot"
        })
      }
    >
      Reboot (dev - ne pas utiliser - a supprimer en prod)
    </button>
  );
}

function Newpartie(){
   return (
    <button
      onClick={() =>
        SocketM.sendd({
          type: "truc",
          mess: "play"
        })
      }
    >
     je veux jouer
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
        type: "truc",
        mess: i,
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

export default function Truc() {
  const [msg, setMsg] = useState("En attente...");
  const [board, setBoard] = useState(Array(9).fill(" "));

    useEffect(() => {
    if(SocketM.nb() === 0){
        SocketM.connect()
    }

    // SocketM.sendd({
    //       type: "truc",
    //       mess: "est-ce que tu me reçois ?"
    // });
    
    // console.log("after co");

    const handleTest = (data) => {
      setMsg(data.mess);
      if (data.board)
        setBoard(data.board);
    };

    SocketM.ontruc(handleTest);

    return () => {
      SocketM.offtruc(handleTest);
    }
  }, []);


    return (
    <>
      <div className="status">{msg}</div>
      <div>< RebootTruc /></div>
      <div>< GoOUT /></div>
      <div>< Newpartie /></div>
      <div className="game-board">
        <Board squares={board}/>
      </div>
    </>
  );
}