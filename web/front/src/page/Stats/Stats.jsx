/* extern */
import { useState } from "react";

/* back */

/* Css */
import "./Stats.scss";

/* Components */ 
import StatsMorpion from "./StatsMorpion/StatsMorpion.jsx";
import StatsWiiGame from "./StatsWiiGame/StatsWiiGame.jsx";


export default function Stats() {

    const [selected, setSelected] = useState(null);

    const stats_handle = (game) => {
        if (selected === game) {
            setSelected(null);
            return;
        }
        setSelected(game);
    }


    return (
        <>
            <div className={`Stats-root`}>

                <div className={`Stats-selection`}>

                    {!selected && <h3>Stats</h3>}
                    {selected === "WiiGame" && <h3>Wii Game</h3>}
                    {selected === "Morpion" && <h3>Morpion</h3>}

                    <button className={`Stats-btn`} onClick={() => stats_handle("WiiGame")}>Wii Game</button>
                    <button className={`Stats-btn`} onClick={() => stats_handle("Morpion")}>Morpion</button>

                </div>

{/* ------------------------------------------------------------------------------------------------------------------ */}

                <div className={`Stats-container`}>

                    {!selected && <p>Select a game to see the stats</p>}

                    {selected === "WiiGame" && <StatsWiiGame />}
                    {selected === "Morpion" && <StatsMorpion />}
                
                </div>
            
            </div>
        </>
    )
}
