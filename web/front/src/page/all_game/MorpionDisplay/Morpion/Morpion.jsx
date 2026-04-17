/* extern */
import { useState, useEffect }  from    "react";

/* Css */
import './Morpion.scss';

/* Components */
import SocketM                  from    "TOOL/SocketManag.js";
import Board                    from    "./Board/Board.jsx";

function sendMessage(s_message){
    SocketM.sendd('morp',{
            type: "play",
            message: s_message,
        })
}

function NewPartie() {

    return (
        <div>
        <button
            style={{ width: "180px" }}
            onClick={() => { sendMessage("player"); }}>
            Play vs Human
        </button>
        <button
            style={{ width: "180px" }}
            onClick={() => { sendMessage("bot"); }}>
            Play vs Bot
        </button>
        </div>

    );
}

export default function Morpion() {

    const [msg, setMsg] = useState("Welcome");
    const [board, setBoard] = useState(Array(9).fill(""));
    const [turn, setTurn] = useState(false);
    const [wait, setWait] = useState(0);

      useEffect(() => {

        const handleSocket = (data) => {
            if (data?.message){
                setMsg(data.message);
            }
            if (data?.board){
                setBoard(data.board);
            }
            if (data?.turn || data.turn === false){
                setTurn(data.turn);
            }
        };

        

        // const handleSocket = ({ message, board, turn } = {}) => {
        //     if (message) setMsg(message);
        //     if (board) setBoard(board);
        //     if (turn != undefined) setTurn(turn);
        //     console.log("pour Morpion turn : ", turn);
            
        // };

        // const handleSocket = (data = {}) => {
        //     const map = {
        //         message: setMsg,
        //         board: setBoard,
        //         turn: setTurn,
        //     };

        //     Object.entries(map).forEach(([key, setter]) => {
        //         if (data[key]) setter(data[key]);
        //     });
        // };

        SocketM.on("morp",handleSocket, "un");

        return () => {
            SocketM.off("morp", "un");
        }

    }, []);

    useEffect(() => {
        if (msg !== "search") return;

        const interval = setInterval(() => {
            setWait((prev) => (prev + 1) % 5);
        }, 900);
        return () => clearInterval(interval);
    }, [msg]);

    return (
        <div className={`Morpion-root`}>

			<div className="status">
				{msg === "search" ?
					<p>searching player{".".repeat(wait)}</p>
					:
					<p>{msg}</p>
				}
            </div>

            <Board board={board} isGame={true} isTurn={turn}/>

            <NewPartie/>

        </div>
    );
}
