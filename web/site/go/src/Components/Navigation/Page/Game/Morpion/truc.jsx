import { useState, useEffect } from "react";
import { SocketM } from "../../../../../../SocketManag";

function handleclick(){
  SocketM.sendd({
        type: "truc",
        mess: "je pars"
  });
}

function RebootTruc() {
  return (
    <button
      onClick={() =>
        SocketM.sendd({ type: "truc", mess: "reboot" })
      }
    >
      Reboot (dev)
    </button>
  );
}

function Square({ value }) {
  return (
    <button className="square" onClick={handleclick}>
      {value}
    </button>
  );
}

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

  return (<><Square value="fin"/><p>{msg}</p><RebootTruc /></>);
}