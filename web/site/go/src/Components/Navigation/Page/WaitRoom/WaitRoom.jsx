import "./waitRoom.css";
import { SocketM } from "../../../../../SocketManag";
import { useEffect, } from "react";
import { useNavigate} from "react-router-dom";

function Training(){
  return (
  <button onClick={() =>
    SocketM.sendd({
        type: "waitRoom",
        mess: "Training"
      })
    }> 
    training sur le meme ecran
  </button>
  );
}

function GoOUT(){
  return (
  <button onClick={() =>
    SocketM.sendd({
        type: "waitRoom",
        mess: "je pars"
      })
    }> 
    je veux partir
  </button>
  );
}

export default function WaitRoom() {

    const navigate = useNavigate();
    console.log("render wait room");
    useEffect(() => {
        console.log("use effect wait room");
        console.log("nb co = " + SocketM.nb());
        if (SocketM.nb() === 0) {
            SocketM.connect();
        }
        const toto = {
            type: "morpion",
            mess: "init",
        }

        const handleRoom = (rawData) => {
            if (!rawData) return;

            let data;
            try {
                data = typeof rawData === "string" ? JSON.parse(rawData) : rawData;
            } catch (err) {
                console.error("JSON invalide reçu in WaitRoom:", rawData);
                return;
            }

            // console.log("Message reçu via SocketM.onRoom:", data.mess);

            switch (data.mess) {
                case "yes":
                    alert("La partie va commencer");
                    navigate("/Morpion");
                    return;

                case "wait":
                    return;

                case "training":
                    navigate("/MorpionTraining");
                    return;

                case "reboot":
                    alert("Le serveur a reboot");
                    navigate(-1);
                    return;

                default:
                    console.log("[Waiting Room] other message :", data.mess)
                    navigate(-1);
                    return;
            }
        };

        SocketM.onRoom(handleRoom);        
        const sendWhenReady = () => {
            if (SocketM.socket && SocketM.socket.readyState === WebSocket.OPEN) {
                SocketM.sendd(toto);
            } else {
                setTimeout(sendWhenReady, 50);
            }
        };
        sendWhenReady();
        return () => {
            console.log("cleanup wait room");
            SocketM.offRoom(handleRoom);
        };
    }, []);

    return (
        <>
        <div><GoOUT /></div>
        <div><Training /></div>
        <p>Wait Room</p>
        </>
    )
}
