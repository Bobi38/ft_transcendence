/* extern */

/* back */
import  SocketM  from "/app/front/tool/SocketManag.js";

/* Css */
import "./Board.scss";

/* Components */

export default function Board({ board , isGame }) {

    function handleClick(i) {
        SocketM.sendd({
            type: "game",
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

