/* Css */
import "./Board.scss";

/* Components */
import  SocketM  from "TOOL/SocketManag.js";

export default function Board({ board , isGame , isTurn}) {

    function handleClick(i) {
        
        SocketM.sendd("morp", {
            type: "move",
            message: i,
        })
    }

    return (
        <div className={`Board-root`}>

            {isGame && board?.map((element, index) => (

                <button key={index}
                        className={`square ${isTurn ? "active" : ""}`}
                        onClick={() => handleClick(index)}>
                    {element}
                </button>
            ))}

            {!isGame && board?.map((element, index) => (

                <button key={index}
                        className={`square`}>
                    {element}
                </button>

            ))}

            <p className=""> {isTurn ? "test ok" : "pas ton turn"}</p>
        </div>
    );
}

