/* extern */
import { useEffect, useState } from "react";

/* back */
import  SocketM  from "TOOL/SocketManag.js";

/* Css */
import "./MorpionDisplay.scss";

/* Components */
import Morpion from "./Morpion/Morpion";
import Board from "./Morpion/Board/Board.jsx";

function SpecButton({ player_1, player_2, id }) {
    const handleClick = () => {
        SocketM.sendd("morp", {  
            type: "spec",
            id,
        });
    };

    return (
        <button onClick={handleClick}>
            <p>{player_1} (X) vs {player_2} (O)</p>
        </button>
    );
}

export default function MorpionDisplay() {
    
    const [list, setList] = useState({});
    const [specSelect, setSpecSelect] = useState(Array(9).fill(" "));

    function addBot(nb){
        if (typeof nb !== "number" || isNaN(nb)) {
            nb = 1;
        }
    
        for (let i = 1; i <= nb; i++){
            setTimeout(() => {
                SocketM.sendd(`morp`,{
                    type: "bot"
                });
            }, i * 100);
        }
    }
    
    useEffect(() => {
        window.addBot = addBot;
    
        return () => {
            delete window.addBot;
        };
    }, []);

    useEffect(() => {
        console.log("Morpion component called");

        const handleSpec = (data) => {
            console.log("Morpion component handleSpec data:", data)
                // setSpecSelect({other_board: data.other_board, player: data.player})
            if (data?.other_board){
                console.log("other board recu");
                setSpecSelect(data.other_board)

            }
            if (data?.list){
                console.log("taille list:", Object.keys(data.list).length);
                setList(data.list);
            }

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
                        <Board board={specSelect} isGame={false}/>
                        {/* <p>login1: X</p>
                        <Board board={data.map.split('')} isGame={false}/>
                        <p>login2: 0</p> */}
                    </div>
                }

                <div className={`MorpionDisplay-spec-info`} style={{height: data ? "65%" : "100%"}}>
                    {
                        Object.entries(list).map(([id, game]) => (
                            <SpecButton
                                key={id}
                                id={id}
                                player_1={game.player_1}
                                player_2={game.player_2}
                            />
                        ))
                    }
                </div>

            </div>

            <div className={`MorpionDisplay-game border-1`}>
                <Morpion/>
            </div>

        </div>

    )
}
