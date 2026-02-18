/* Css */
import "./PrivateMessageConv.css"; 

/* Components */
import { useEffect, useState } from "react"; 

export default function PrivateMessageConv() {    

    const [displayedMessages, setDisplayedMessages] = useState([
        {login: "test1", message: "oui oui ch0zure"},
        {login: "test1", message: "oui oui ch0zure"},
        {login: "test1", message: "oui oui ch0zure"},
        {login: "test1", message: "oui oui ch0zure"},
        {login: "test1", message: "oui oui ch0zure"},
        {login: "test1", message: "oui oui ch0zure"},
        {login: "test1", message: "oui oui ch0zure"},
        {login: "test1", message: "oui oui ch0zure"},
        {login: "test1", message: "oui oui ch0zure"},
        {login: "test1", message: "oui oui ch0zure"},
        {login: "test1", message: "oui oui ch0zure"},
        {login: "test1", message: "oui oui ch0zure"},
        {login: "test1", message: "oui oui ch0zure"},
        {login: "test1", message: "oui oui ch0zure"},
        {login: "test1", message: "oui oui ch0zure"},
        {login: "test1", message: "oui oui ch0zure"},
        {login: "test1", message: "oui oui ch0zure"},
        {login: "test1", message: "oui oui ch0zure"},
        {login: "test1", message: "oui oui ch0zure"},
        {login: "test1", message: "oui oui ch0zure"},
        {login: "test1", message: "oui oui ch0zure"},
        {login: "test1", message: "oui oui ch0zure"},
        {login: "test1", message: "oui oui ch0zure"},
        {login: "test1", message: "oui oui ch0zure"},
        {login: "test1", message: "oui oui ch0zure"},
        {login: "test1", message: "oui oui ch0zure"},
        {login: "test1", message: "oui oui ch0zure"},
        {login: "test1", message: "oui oui ch0zure"},
        // {login: "test1", message: "oui oui ch0zure"},
        // {login: "test1", message: "oui oui ch0zure"},
        // {login: "test1", message: "oui oui ch0zure"},
        // {login: "test1", message: "oui oui ch0zure"},
        // {login: "test1", message: "oui oui ch0zure"},
        // {login: "test1", message: "oui oui ch0zure"},
    ]);

    const handler = (e) =>{
        e.preventDefault();
        console.log("uai handler")
    }

    
    return (
        <>

                <div className="PrivateMessageConv-flex1">

                    <div><h5 className="center">{"msg.login"}</h5></div>



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

