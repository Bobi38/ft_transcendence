/* Css */
import "./Stats.scss";

/* Components */ 
import StatsMorpion from "./StatsMorpion/StatsMorpion.jsx";
import StatsWiiGame from "./StatsWiiGame/StatsWiiGame.jsx";
import { useState } from "react";


export default function Stats() {

    const [selected, setSelected] = useState(null);

    const handle = (game) => {
        if (selected === game) {
            setSelected(null);
            return;
        }
        setSelected(game);
    }

    return (
        <>
            <div className="full Stats-bg Stats-flex center">
                <div>
                    <h1>History</h1>
                    <div>
                        <button className="Stats-btn" onClick={() => handle("WiiGame")}>Wii Game</button>
                        <button className="Stats-btn" onClick={() => handle("Morpion")}>Morpion</button>
                    </div>
                </div>

                <div >
                    {!selected && <p className="Stats-p">Select a game to see the stats</p>}
                    {selected === "WiiGame" && <StatsWiiGame />}
                    {selected === "Morpion" && <StatsMorpion />}
                </div>
            
            </div>
        </>
    )
}
