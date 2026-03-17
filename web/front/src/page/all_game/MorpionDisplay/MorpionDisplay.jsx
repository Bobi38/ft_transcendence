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

     const [list, setList] = useState(null);
     const [specSelect, setSpecSelect] = useState(null);

    useEffect(() => {
        console.log("Morpion component called");

        const handleSpec = (data) => {
            console.log("Morpion component handleSpec data:", data)

            if (data.other_board)
                setSpecSelect({other_board: data.other_board, player: data.player})
            if (data.list) 
                setList(data.list);

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
                        {/* <Board board={specSelect.other_board} isGame={false}/> */}
                        <p>login1: X</p>
                        <Board board={data.map.split('')} isGame={false}/>
                        <p>login2: 0</p>
                    </div>
                }

                <div className={`MorpionDisplay-spec-info`} style={{height: data ? "65%" : "100%"}}>
                    { data?.list && 
                        data.list.map((msg , index)=>{
                            return (
                                <SpecButton player_1={`${msg.player_1}`} player_2={`${msg.player_1}`} id={msg.id} />
                            )
                        })
                    }
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
