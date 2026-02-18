/* Css */
import "./PrivateMessageConv.scss"; 

/* Components */
import { useEffect, useState } from "react"; 

export default function PrivateMessageConv({navamis}) {    

// useEffect
// fetch(navamis = login)
// JSON
// data
// setDisplayedMessages(data)
// ws

    const [displayedMessages, setDisplayedMessages] = useState([]);

    const handler = (e) =>{
        e.preventDefault();
        console.log("uai handler")
    }

    return (
        <>

                <div className="PrivateMessageConv-flex1">

                    <div><h5 className="center">{navamis}</h5></div>

                    <div className="PrivateMessageConv-flex2">
                        <div>

                            {displayedMessages && displayedMessages.map((msg, index) => { return ( 

                                <div key={index} style={{border: "1px solid", padding: "0.5rem"}}>

                                    <h3>{msg.login}</h3>
                                    <p>{msg.message}</p>

                                </div>

                            );})}

                        </div>

                    </div>

                    <div>
                        <form onSubmit={handler}>
                            <input type="text"/>
                            <button type="submit">button</button>
                        </form>
                    </div>
                </div>
        </>
    )
}

