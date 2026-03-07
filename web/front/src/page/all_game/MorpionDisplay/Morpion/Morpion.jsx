import { useState, useEffect } from "react";
import SocketM from "/app/front/tool/SocketManag.js";
import './Morpion.scss';

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

function Board({ board }) {

    function handleClick(i) {
        SocketM.sendd({
            type: "game",
            message: i,
        })
    }

    return (
        <div className={`Board-root`}>

            {board?.map((element, index) => (

                <button key={index} className={`square`} 
                        onClick={() => handleClick(index)}>

                    {element}
                </button>

            ))}

        </div>
    );
}

export default function Morpion() {


    const [msg, setMsg] = useState("En attente...");
    const [board, setBoard] = useState(null);

      useEffect(() => {

        console.log("Morpion component called");

        // SocketM.sendd({
        //       type: "game",
        //       message: "est-ce que tu me reçois ?"
        // });
        
        console.log("Morpion component after connection");

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
            
                <GoOut/>
            
                <SelectFirst/>

            </div>
  

            <Board board={board}/>
  

            <NouvellePartie setBoard={setBoard}/>

        </div>
    );
}