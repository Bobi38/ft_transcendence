/* extern */
import { useEffect, useState } from "react";

/* back */
import  SocketM  from "TOOL/SocketManag.js";

/* Css */
import "./MorpionDisplay.scss";

/* Components */
import Morpion from "./Morpion/Morpion";
import Board from "./Morpion/Board/Board.jsx";

function SpecButton({ player_1, player_2, id }){

    return (
        <button onClick={() => {
            SocketM.sendd(SocketM.socket.morp,{
                type: "spec", id,
            })
        }}>
            <p>{player_1}: X vs {player_2}: O</p>
        </button>
    ); 
    
}

export default function MorpionDisplay() {

      useEffect(() => {
        console.log("Morpion component called");
        const handleSpec = (data) => {
            console.log("Morpion component handleSpec data:", data)
        };

        SocketM.on("morp", handleSpec, "deux");

        return () => {
            SocketM.off("morp", "deux");
        }

    }, []);

    let data = {
        player_1:1,
        player_2:2,
        map:"---x-x-xx",
        game_id:1,
    }
    // data = null;

    return (
    
        <div className={`MorpionDisplay-root border-base`}>
            
            <div className={`MorpionDisplay-actual-game border-1`}>
                {/*  spectateur  */}

                {data &&
                <div className={`MorpionDisplay-spec-game`}> 
                    <Board board={data.map.split('')} isGame={false}/>
                </div>}

                <div className={`MorpionDisplay-spec-info`} style={{height: data ? "65%" : "100%"}}> 
                    <SpecButton player_1={"oui"} player_2={"non"} id={1} />
                    <SpecButton player_1={"oui"} player_2={"non"} id={1} />
                    <SpecButton player_1={"oui"} player_2={"non"} id={1} />
                    <SpecButton player_1={"oui"} player_2={"non"} id={1} />
                    <SpecButton player_1={"oui"} player_2={"non"} id={1} />
                    <SpecButton player_1={"oui"} player_2={"non"} id={1} />
                    <SpecButton player_1={"oui"} player_2={"non"} id={1} />
                    <SpecButton player_1={"oui"} player_2={"non"} id={1} />
                    <SpecButton player_1={"oui"} player_2={"non"} id={1} />
                    <SpecButton player_1={"oui"} player_2={"non"} id={1} />
                    <SpecButton player_1={"oui"} player_2={"non"} id={1} />
                    <SpecButton player_1={"oui"} player_2={"non"} id={1} />
                </div>

            </div>

            <div className={`MorpionDisplay-game border-1`}>
                <Morpion/>
            </div>

        </div>

    )
}
