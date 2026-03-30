/* extern */
import { useEffect, useState } from "react";

/* back */

/* Css */
import "./Stats.scss";

/* Components */ 
import StatsMorpion from "./StatsMorpion/StatsMorpion.jsx";
import StatsPong3D from "./StatsPong3D/StatsPong3D.jsx";


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


    return (
        <>
            <div className={`Stats-root`}>

                <div className={`Stats-selection`}>

                    <h3>Stats of {username} {selected}</h3>
                    {/* <button className={`Stats-btn`} onClick={() => stats_handle("Pong3D")}>Pong3D</button> */}
                    <button className={`Stats-btn`} onClick={() => stats_handle("Morpion")}>Morpion</button>

                </div>

{/* ------------------------------------------------------------------------------------------------------------------ */}

                <div className={`Stats-container`}>

                    {!selected && <p>Select a game to see the stats</p>}

                    {/* {selected === "Pong3D" && <StatsPong3D username={username} setUsername={setUsername} />} */}
                    {selected === "Morpion" && <StatsMorpion username={username} setUsername={setUsername} />}
                
                </div>
            
            </div>
        </>
    )
}
