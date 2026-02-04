import { useState, useEffect } from "react"
import { postJson, initial } from "./postjson"


function Square({ value }) {
  return (
    <button className="square">
      {value}
    </button>
  );
}

export default function Truc(){
    const [msg, setMsg] = useState("")
    const [tab, setTab] = useState("")
    const [start, setStart] = useState("")
    useEffect(() => {
        const sendMessage = async () => {
            try {
                const reponse = await fetch(
                    "/api/truc",
                    postJson(initial));

                const result = await reponse.json();
                if (result.sucess === false)
                    throw new Error(result.message);
                setTab(result.data.tab);    
                setMsg(result.data.message);
                setStart(result.data.start);
            } catch (err) {console.error(err);}
        };
        sendMessage();
    }, []);

    return (
    <>
      <div className="status">{msg}</div>
      <div className="board-row">
        <Square value={tab[0]} />
        <Square value={tab[1]} />
        <Square value={tab[2]} />
      </div>
      <div className="board-row">
        <Square value={tab[3]} />
        <Square value={tab[4]} />
        <Square value={tab[5]} />
      </div>
      <div className="board-row">
        <Square value={tab[6]} />
        <Square value={tab[7]} />
        <Square value={tab[8]} />
      </div><p>
        affiche tab :
        </p><ol>{tab}</ol></>)
}