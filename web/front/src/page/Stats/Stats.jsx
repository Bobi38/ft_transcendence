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

    const handle = (game) => {
        if (selected === game) {
            setSelected(null);
            return;
        }
        setSelected(game);
    }


    return (
        <>
            <div className={`Stats-root`}>
                
                <h3>Stats</h3>

                <div>
                    <button className={`Stats-btn`} onClick={() => handle("WiiGame")}>Wii Game</button>
                    <button className={`Stats-btn`} onClick={() => handle("Morpion")}>Morpion</button>
                </div>

                <div className={`Stats-container`}>

                    {!selected && <p className={`Stats-p`}>Select a game to see the stats</p>}
                    {selected === "WiiGame" && <StatsWiiGame />}
                    {selected === "Morpion" && <StatsMorpion />}
                
                </div>
            
            </div>
        </>
    )
}
