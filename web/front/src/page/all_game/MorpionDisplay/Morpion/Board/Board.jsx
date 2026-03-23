/* extern */

/* back */
import  SocketM  from "TOOL/SocketManag.js";

/* Css */
import "./Board.scss";

/* Components */

export default function Board({ board , isGame }) {

    function handleClick(i) {
        SocketM.sendd("morp", {
            type: "move",
            message: i,
        })
    }

    return (
        <div className={`Board-root`}>

            {isGame && board?.map((element, index) => (

                <button key={index} className={`square`} 
                        onClick={() => handleClick(index)}>
                    {element}
                </button>
                
            ))}

            {!isGame && board?.map((element, index) => (

                <button key={index} className={`square`}>
                    {element}
                </button>

            ))}

        </div>
    );
}

