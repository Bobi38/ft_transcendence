/* extern */
import { useState, useEffect } from "react";

/* back */
import  SocketM  from "/app/front/tool/SocketManag.js";

/* Css */
import './Morpion.scss';

/* Components */
import Board from "./Board/Board.jsx";

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

function GoOut(){

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

function NouvellePartie({ setBoard }){

    return (
        <button onClick={() => {
            setBoard(Array(9).fill(""));
            SocketM.sendd({
                type: "game",
                message: "je veux jouer"
            })
        }}>
            Nouvelle Partie
        </button>
    );
}

export default function Morpion() {


    const [msg, setMsg] = useState("En attente...");
    const [board, setBoard] = useState(null);

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

        SocketM.onGame(handleTest);

        return () => {
            SocketM.offGame(handleTest);
        }

    }, []);


    return (
        <div className={`Morpion-root`}>

            <div className={`info`}>

                {/* <RebootTruc/> */}

                <GoOut/>

                <SelectFirst/>

                <div className="status">{msg}</div>

            </div>

            <Board board={board} isGame={true}/>

            <NouvellePartie setBoard={setBoard}/>

        </div>
    );
}