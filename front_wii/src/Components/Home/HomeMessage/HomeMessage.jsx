import { useState } from "react";
import "./HomeMessage.css";
import "../Home.css"

export default function HomeMessage({message, grid_style}) {

    const [input, setInput] = useState("");
    const [displayedMessage, setDisplayedMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        setDisplayedMessage(input);
        setInput(""); // optionnel : reset le champ
    };
    return (
        <>
            <div className={`${grid_style} message center`}>

                    <div className="display-message ">
                        
                        {displayedMessage && <p>{displayedMessage}</p>}
                        <p>{message??"wqeqwerrrrrrrqwer  rrrrrrrrrrrr rrrwqeqwerrrrrrrqwer  rrrrrrrrrrrr rrrwqeqwerrrrrrrqwer  rrrrrrrrrrrr rrrwqeqwerrrrrrrqwer  rrrrrrrrrrrr rrr"}</p>
                        <p>{message??"wqeqwerrrrrrrqwer  rrrrrrrrrrrr rrr"}</p>
                        <p>{message??"wqeqwerrrrrrrqwer  rrrrrrrrrrrr rrr"}</p>
                        <p>{message??"wqeqwerrrrrrrqwer  rrrrrrrrrrrr rrr"}</p>
                        <p>{message??"wqeqwerrrrrrrqwer  rrrrrrrrrrrr rrr"}</p>
                        <p>{message??"wqeqwerrrrrrrqwer  rrrrrrrrrrrr rrr"}</p>
                        <p>{message??"wqeqwerrrrrrrqwer  rrrrrrrrrrrr rrr"}</p>
                        <p>{message??"wqeqwerrrrrrrqwer  rrrrrrrrrrrr rrr"}</p>
                        <p>{message??"wqeqwerrrrrrrqwer  rrrrrrrrrrrr rrr"}</p>
                        <p>{message??"wqeqwerrrrrrrqwer  rrrrrrrrrrrr rrr"}</p>
                        <p>{message??"wqeqwerrrrrrrqwer  rrrrrrrrrrrr rrr"}</p>
                        <p>{message??"wqeqwerrrrrrrqwer  rrrrrrrrrrrr rrr"}</p>
                        <p>{message??"wqeqwerrrrrrrqwer  rrrrrrrrrrrr rrr"}</p>
                        <p>{message??"wqeqwerrrrrrrqwer  rrrrrrrrrrrr rrr"}</p>
                        <p>{message??"wqeqwerrrrrrrqwer  rrrrrrrrrrrr rrr"}</p>
                        <p>{message??"wqeqwerrrrrrrqwer  rrrrrrrrrrrr rrr"}</p>
                        <p>{message??"wqeqwerrrrrrrqwer  rrrrrrrrrrrr rrr"}</p>
                        <p>{message??"wqeqwerrrrrrrqwer  rrrrrrrrrrrr rrr"}</p>
                        <p>{message??"wqeqwerrrrrrrqwer  rrrrrrrrrrrr rrr"}</p>
                        <p>{message??"wqeqwerrrrrrrqwer  rrrrrrrrrrrr rrr"}</p>
                        <p>{message??"wqeqwerrrrrrrqwer  rrrrrrrrrrrr rrr"}</p>
                        <p>{message??"wqeqwerrrrrrrqwer  rrrrrrrrrrrr rrr"}</p>
                        <p>{message??"wqeqwerrrrrrrqwer  rrrrrrrrrrrr rrr"}</p>
                        <p>{message??"wqeqwerrrrrrrqwer  rrrrrrrrrrrr rrr"}</p>
                        <p>{message??"wqeqwerrrrrrrqwer  rrrrrrrrrrrr rrr"}</p>
                        <p>{message??"wqeqwerrrrrrrqwer  rrrrrrrrrrrr rrr"}</p>
                        <p>{message??"wqeqwerrrrrrrqwer  rrrrrrrrrrrr rrr"}</p>
                        <p>{message??"wqeqwerrrrrrrqwer  rrrrrrrrrrrr rrr"}</p>
                        <p>{message??"wqeqwerrrrrrrqwer  rrrrrrrrrrrr rrr"}</p>
                        <p>{message??"wqeqwerrrrrrrqwer  rrrrrrrrrrrr rrr"}</p>
                        <p>{message??"wqeqwerrrrrrrqwer  rrrrrrrrrrrr rrr"}</p>
                        <p>{message??"wqeqwerrrrrrrqwer  rrrrrrrrrrrr rrr"}</p>
                        <p>{message??"wqeqwerrrrrrrqwer  rrrrrrrrrrrr rrr"}</p>
                        <p>{message??"wqeqwerrrrrrrqwer  rrrrrrrrrrrr rrr"}</p>
                        <p>{message??"wqeqwerrrrrrrqwer  rrrrrrrrrrrr rrr"}</p>
                        <p>{message??"wqeqwerrrrrrrqwer  rrrrrrrrrrrr rrr"}</p>
                        <p>{message??"wqeqwerrrrrrrqwer  rrrrrrrrrrrr rrr"}</p>
                        <p>{message??"wqeqwerrrrrrrqwer  rrrrrrrrrrrr rrr"}</p>
                        <p>{message??"wqeqwerrrrrrrqwer  rrrrrrrrrrrr rrr"}</p>
                        <p>{message??"wqeqwerrrrrrrqwer  rrrrrrrrrrrr rrr"}</p>
                        <p>{message??"wqeqwerrrrrrrqwer  rrrrrrrrrrrr rrr"}</p>
                        <p>{message??"wqeqwerrrrrrrqwer  rrrrrrrrrrrr rrr"}</p>
                        <p>{message??"wqeqwerrrrrrrqwer  rrrrrrrrrrrr rrr"}</p>
                        <p>{message??"wqeqwerrrrrrrqwer  rrrrrrrrrrrr rrr"}</p>
                        <p>{message??"wqeqwerrrrrrrqwer  rrrrrrrrrrrr rrr"}</p>
                        <p>{message??"wqeqwerrrrrrrqwer  rrrrrrrrrrrr rrr"}</p>
                        <p>{message??"wqeqwerrrrrrrqwer  rrrrrrrrrrrr rrr"}</p>
                        <p>{message??"wqeqwerrrrrrrqwer  rrrrrrrrrrrr rrr"}</p>
                        <p>{message??"wqeqwerrrrrrrqwer  rrrrrrrrrrrr rrr"}</p>
                        <p>{message??"wqeqwerrrrrrrqwer  rrrrrrrrrrrr rrr"}</p>

                    </div>

                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <input type="submit"></input>
                    </form>
           
            </div>
        </>
    )
}
