/* extern */
import { useEffect, useState }  from "react";

/* Css */
import "./MorpionDisplay.scss";

/* Components */
import SocketM                  from "TOOL/SocketManag.js";
import Morpion                  from "./Morpion/Morpion";
import Board                    from "./Morpion/Board/Board.jsx";

function SpecButton({ player_1, player_2, id }) {

    const handleClick = () => {
        SocketM.sendd("morp", {
            type: "spec",
            id,
        });
    };

    return (
        <li onClick={handleClick}>
            <button>{player_1} (X) vs {player_2 ?? "nobody"} (O)</button>
        </li>
    );

}

export default function MorpionDisplay({isGame}) { // mode  spec or game

    const [list, setList] = useState({});
    const [specSelect, setSpecSelect] = useState(Array(9).fill(" "));

    function addBot(nb){
		if (nb > 100)
		{
			console.log("the max is 100");
			return;
		}
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

		SocketM.sendd("morp", {});
        const handleSpec = (data) => {
            // console.log("Morpion component handleSpec data:", data)
            if (data?.other_board){
                setSpecSelect(data.other_board)
            }
            if (data?.list){
                setList(data.list);
            }

        };

        SocketM.on("morp", handleSpec, "deux");

        return () => {
            SocketM.off("morp", "deux");
        }

    }, []);

    return (

        <div className={`MorpionDisplay-root`}>
            {isGame ?
				<>
					<h1>Royal Morpion</h1>
					<hr />

					<Morpion/>
				</>
				: //switch view
				<>
					<h1>Spectate</h1>
					<hr />

					<div className="MorpionDisplay-content">
						<Board board={specSelect} isGame={false}/>
						<aside>
							<h2>
								{Object.keys(list).length > 0
									? "Game list" : "No games running"
								}
							</h2>
							<ul>
								{Object.entries(list).map(([id, game]) => (
									<SpecButton
									key={id}
									id={id}
									player_1={game.player_1}
									player_2={game.player_2}
									/>
								))}
							</ul>
						</aside>
					</div>
				</>
			}
        </div>
    );
}
