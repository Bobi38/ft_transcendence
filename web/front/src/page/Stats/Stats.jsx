/* extern */
import { useEffect, useState } from "react";

/* back */

/* Css */
import "./Stats.scss";

/* Components */ 
import StatsMorpion from "./StatsMorpion/StatsMorpion.jsx";
import StatsWiiGame from "./StatsWiiGame/StatsWiiGame.jsx";


export default function Stats() {

    const [username, setUsername] = useState(sessionStorage.getItem('username'));

    const [selected, setSelected] = useState(null);

    const stats_handle = (game) => {
        if (selected === game) {
            setSelected(null);
            return;
        }
        setSelected(game);
    }

    // useEffect(()=>{console.log("je prie ca vien pas la")},[]);

    return (
        <>
            <div className={`Stats-root`}>

                <div className={`Stats-selection`}>

                    <h3>Stats of {username} {selected}</h3>
                    <button className={`Stats-btn`} onClick={() => stats_handle("WiiGame")}>Wii Game</button>
                    <button className={`Stats-btn`} onClick={() => stats_handle("Morpion")}>Morpion</button>

                </div>

{/* ------------------------------------------------------------------------------------------------------------------ */}

                <div className={`Stats-container`}>

                    {!selected && <p>Select a game to see the stats</p>}

                    {selected === "WiiGame" && <StatsWiiGame username={username} setUsername={setUsername} />}
                    {selected === "Morpion" && <StatsMorpion username={username} setUsername={setUsername} />}
                
                </div>
            
            </div>
        </>
    )
}
