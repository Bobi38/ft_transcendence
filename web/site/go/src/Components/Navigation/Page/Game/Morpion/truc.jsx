import { useState, useEffect } from "react";
import { SocketM } from "../../../../../../SocketManag";


export default function Truc() {
  const [msg, setMsg] = useState("En attente...");

    useEffect(() => {
    if(SocketM.nb() === 0){
        SocketM.connect()
    }

    SocketM.sendd({
          type: "truc",
          mess: "est-ce que tu me reçois ?"
    });
    
    console.log("after co");

    const handleTest = (data) => {
      setMsg(data.mess);
    };

    SocketM.ontruc(handleTest);

    return () => {
      SocketM.offtruc(handleTest);
    }
  }, []);

  return <p>{msg}</p>;
}