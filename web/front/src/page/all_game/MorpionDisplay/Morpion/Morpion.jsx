/* extern */
import { useState, useEffect } from "react";

/* back */
import  SocketM  from "TOOL/SocketManag.js";

/* Css */
import './Morpion.scss';

/* Components */
import Board from "./Board/Board.jsx";

function NewPartie() {
    function sendMessage(s_message){
        SocketM.sendd('morp',{
                type: "play",
                message: s_message,
            })
    }
    return (
        <button className="send-btn"
            onClick={() => { sendMessage("player"); }}
            onContextMenu={(e) => {
				e.preventDefault();
				sendMessage('bot');
			}}
			>
            Search Game
        </button>
    );
}

export default function Morpion() {

    const [msg, setMsg] = useState("Welcome");
    const [board, setBoard] = useState(Array(9).fill(""));
    const [wait, setWait] = useState(0);

      useEffect(() => {

        console.log("Morpion component called");

        const handleSocket = (data) => {
            if (data?.message){
                setMsg(data.message);
            }
            if (data?.board){
                setBoard(data.board);
            }
        };

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

            <Board board={board} isGame={true}/>

            <NewPartie/>

        </div>
    );
}

//can be usefull in the future

//function RebootTruc() {
//    function sendType(s_type){
//        SocketM.sendd('morp',{
//                type: s_type,
//            })
//    }

//    return (
//        <button
//            onClick={() =>{sendType("bot")}}
//            onContextMenu={(e) => {
//                e.preventDefault();
//                sendType('reboot');
//            }}
//            style={{ cursor: 'add bot' }}
//            >
//                add Bot
//        </button>
//    );

//}

//function GoOut(){
//    function sendType(s_type){
//        SocketM.sendd('morp',{
//                type: s_type,
//            })
//    }

//    return (
//        <button
//            onClick={() =>{sendType("leave")}}
//            onContextMenu={(e) => {
//                e.preventDefault();
//                sendType('bot');
//            }}
//            style={{ cursor: 'add bot' }}
//            >
//                je veux partir
//        </button>
//    );
//}

//function SelectSecondPlayer(){
//    return (
//        <button onClick={() => {
//            SocketM.sendd('morp',{
//                type: "second",
//            })
//        }}>
//            second / first
//        </button>
//    );
//}