/* extern */
import { useState } 			from	"react";

/* Css */
import "./Stats.scss";

/* Components */ 
import StatsMorpion 			from	"./StatsMorpion/StatsMorpion.jsx";
import StatsPong 				from	"./StatsPong/StatsPong.jsx";


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
		<div className={`Stats-root`}>

			<h1>Stats of {username} {selected}</h1>

			<div className="btn_container">
				<button className={`Stats-btn`} onClick={() => stats_handle("Pong3D")}>Pong3D</button>
				<button className={`Stats-btn`} onClick={() => stats_handle("Morpion")}>Morpion</button>
			</div>


			<hr />
{/* ------------------------------------------------------------------------------------------------------------------ */}
			{!selected && <p>Select a game to see the stats</p>}

			{selected === "Pong3D" && <StatsPong username={username} setUsername={setUsername} />}
			{selected === "Morpion" && <StatsMorpion username={username} setUsername={setUsername} />}
		</div>
    )
}
