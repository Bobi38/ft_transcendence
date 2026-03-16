/* extern */
import { useEffect, useState } from "react";

/* back */
import  SocketM  from "/app/tool/SocketManag.js";

/* Css */
import "./MorpionDisplay.scss";

/* Components */
import Morpion from "./Morpion/Morpion";

import Board from "./Morpion/Board/Board.jsx";
function SpecButton({ log1, log2, id }){

    return (
        <button onClick={() => {
            SocketM.sendd(SocketM.socket.morp,{
                type: "spec", id,
            })
        }}>
                <p>log1: x/ log2/O</p>
        </button>
    ); 
    
}

export default function MorpionDisplay() {
      useEffect(() => {

        console.log("Morpion component called");

        const handleTest = (data) => {
         
            console.log("Morpion component handleTest data:", data)
            // if (data.message !== msg){
                // setMsg(data.message);
            // }
            // if (data.board && data.board !== board){
            //     setBoard(data.board);
            // }
        };

        SocketM.on("morp",handleTest, "deux");

        return () => {
            SocketM.off("morp", "deux");
        }

    }, []);

    return (
    
        <div className={`MorpionDisplay-root border-base`}>
            
            <div className={`MorpionDisplay-last-game-played border-1`}>
                <Board board={Array("-","-","-","x","-","x","-","x","x")} isGame={true}/>
                display les game en cours ou / deja fini 
                <SpecButton log1={"oui"} log2={"non"} id={1} />
            </div>

            <div className={`MorpionDisplay-game border-1`}>
                <Morpion/>
            </div>

        </div>

    )
}
