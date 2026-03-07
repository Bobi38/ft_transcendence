import { useState, useEffect } from "react";
import SocketM from "/app/front/tool/SocketManag.js";
import './Morpion.scss';

function GoOUT(){

    return (
        <button onClick={() =>{
            SocketM.sendd({
                type: "game",
                message: "je pars"
            })
        }}>
            je veux partir
        </button>
    );
}

function NouvellePartie(){

    return (
        <button onClick={() => {
            SocketM.sendd({
                type: "game",
                message: "je veux jouer"
            })
        }}>
            Nouvelle Partie
        </button>
    );
}


function RebootTruc() {

    return (
        <button onClick={() => {
            SocketM.sendd({
                type: "game",
                message: "reboot"
            })
        }}>
            Reboot (dev - ne pas utiliser - a supprimer en prod)
        </button>
    );
}

function SelectFirst(){
    return (
        <button onClick={() => {
            SocketM.sendd({
                type: "game",
                message: "playfirst"
            })
        }}>
            je veux jouer en second
        </button>
    ); 
}

function Square({ children, onSquareClick }) {

    return (
        <button className="square" onClick={onSquareClick}>
            {children}
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
        // <div className={`Board-root`}>
        //     <div className="Board-row">
        //         <Square onSquareClick={() => handleClick(0)}> {squares[0]} </Square>
        //         <Square onSquareClick={() => handleClick(1)}> {squares[1]} </Square>
        //         <Square onSquareClick={() => handleClick(2)}> {squares[2]} </Square>
        //     </div>
        //     <div className="Board-row">
        //         <Square onSquareClick={() => handleClick(3)}> {squares[3]} </Square>
        //         <Square onSquareClick={() => handleClick(4)}> {squares[4]} </Square>
        //         <Square onSquareClick={() => handleClick(5)}> {squares[5]} </Square>
        //     </div>
        //     <div className="Board-row">
        //         <Square onSquareClick={() => handleClick(6)}> {squares[6]} </Square>
        //         <Square onSquareClick={() => handleClick(7)}> {squares[7]} </Square>
        //         <Square onSquareClick={() => handleClick(8)}> {squares[8]} </Square>
        //     </div>
        // </div>
        <div className={`Board-root`}>
                <Square onSquareClick={() => handleClick(0)}> {squares[0]} </Square>
                <Square onSquareClick={() => handleClick(1)}> {squares[1]} </Square>
                <Square onSquareClick={() => handleClick(2)}> {squares[2]} </Square>
                <Square onSquareClick={() => handleClick(3)}> {squares[3]} </Square>
                <Square onSquareClick={() => handleClick(4)}> {squares[4]} </Square>
                <Square onSquareClick={() => handleClick(5)}> {squares[5]} </Square>
                <Square onSquareClick={() => handleClick(6)}> {squares[6]} </Square>
                <Square onSquareClick={() => handleClick(7)}> {squares[7]} </Square>
                <Square onSquareClick={() => handleClick(8)}> {squares[8]} </Square>
        </div>
    );
}

export default function Morpion() {

    console.log("ici cest front FunctionMorpion");
    const [msg, setMsg] = useState("En attente...");
    const [board, setBoard] = useState(Array(9).fill(" "));

      useEffect(() => {

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

      // useEffect(() => {

      //   return (() => {
      //         SocketM.sendd({
      //             type: "game",
      //             message: "je pars"
      //         })
      //     });
      // }, [])

    return (
        <div className={`Morpion-root`}>
            <div className={`info`}>

                <div className="status">{msg}</div>
                
                <RebootTruc/>
            
                <GoOUT/>
            
                <SelectFirst/>

            </div>
  

            <Board squares={board}/>
  

            <NouvellePartie/>

        </div>
    );
}