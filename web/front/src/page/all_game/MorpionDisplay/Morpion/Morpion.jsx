/* extern */
import { useState, useEffect } from "react";

/* back */
import  SocketM  from "/app/tool/SocketManag.js";

/* Css */
import './Morpion.scss';

/* Components */
import Board from "./Board/Board.jsx";

function RebootTruc() {

    return (
        <button onClick={() => {
            SocketM.sendd('morp',{
                type: "game",
                message: "reboot"
            })
        }}>
            Reboot (dev - ne pas utiliser - a supprimer en prod)
        </button>
    );
}

function GoOut(){

    return (
        <button onClick={() =>{
            SocketM.sendd('morp',{
                type: "game",
                message: "leave"
            })
        }}>
            je veux partir
        </button>
    );
}

function SelectSecondPlayer(){
    return (
        <button onClick={() => {
            SocketM.sendd('morp',{
                type: "game",
                message: "playSecond"
            })
        }}>
            je veux jouer en second
        </button>
    ); 
}

function NouvellePartie({ setBoard }){

    return (
        <button onClick={() => {
            setBoard(Array(9).fill(""));
            SocketM.sendd('morp',{
                type: "game",
                message: "je veux jouer"
            })
        }}>
            Nouvelle Partie
        </button>
    );
}

export default function Morpion() {


    const [msg, setMsg] = useState("Royal Morpion(the ultim morpion)");
    const [board, setBoard] = useState(null);
    const [wait, setWait] = useState(0);

      useEffect(() => {

        console.log("Morpion component called");

        const handleTest = (data) => {
         
            console.log("Morpion component handleTest data:", data)
            if (data.message !== msg){
                setMsg(data.message);
            }
            if (data.board && data.board !== board){
                setBoard(data.board);
            }
        };

        SocketM.on("morp",handleTest, "un");

        return () => {
            SocketM.off("morp", "un");
        }

    }, []);

    useEffect(() => {
        if (msg !== "recherche") return;

        const interval = setInterval(() => {
            setWait((prev) => (prev + 1) % 5);
        }, 900);

        return () => clearInterval(interval);
    }, [msg]);

    return (
        <div className={`Morpion-root`}>

            <div className={`info`}>

                <RebootTruc/>

                <GoOut/>

                <SelectSecondPlayer/>

                <div className="status">
                    {msg === "recherche"
                        ? <>
                            recherche en cours<span className="wait">{".".repeat(wait)}</span>
                        </>
                        : msg
                    }
                </div>

            </div>

            <Board board={board} isGame={true}/>

            <NouvellePartie setBoard={setBoard}/>

        </div>
    );
}