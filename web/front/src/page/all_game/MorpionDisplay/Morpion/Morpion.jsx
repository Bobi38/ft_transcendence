/* extern */
import { useState, useEffect }  from    "react";

/* Css */
import './Morpion.scss';

/* Components */
import SocketM                  from    "TOOL/SocketManag.js";
import Board                    from    "./Board/Board.jsx";

function NewPartie() {
    function sendMessage(s_message){
        SocketM.sendd('morp',{
                type: "play",
                message: s_message,
            })
    }

    return (
        <button
            onClick={() => { sendMessage("player"); }}
            onContextMenu={(e) => {
				e.preventDefault();
				sendMessage('bot');
			}}>
            Search Game
        </button>
    );
}

export default function Morpion() {

    const [msg, setMsg] = useState("Welcome");
    const [board, setBoard] = useState(Array(9).fill(""));
    const [wait, setWait] = useState(0);

      useEffect(() => {

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
