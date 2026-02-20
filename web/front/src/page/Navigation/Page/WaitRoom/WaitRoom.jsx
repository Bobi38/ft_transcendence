import "./waitRoom.scss";
import { SocketM } from "/app/back/src/SocketManag";
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

    const [input, setInput] = useState("");


        const handltest = async (e) => {
        e.preventDefault();
        console.log("in handltest ", input);
        try{
            // const key = "b26266decd6341248ef151027261902";
            // const location = input;
            // const api = "http://api.weatherapi.com/v1/current.json?key=" + key + "&q=" + location;
            // console.log("look api " , api);
        //     const rep = await fetch('/api/fetchConv' ,{
        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/json",
        //         },
        //         credentials: "include",
        //         body: JSON.stringify({input}),
        //     });
        //     const repp = await rep.json();
        //     if (repp.success){
        //         const chats = repp.message;
        //         console.log("chattt 1 ", chats[0].PrivMesses[0].contenu)
        //         console.log("chattt 2 ", chats[1].PrivMesses[0].contenu)
        //         console.log("test join ", chats[0].user1.name);
        //     }
        //     else
        //         console.log("errrr back ", repp.message)
        }catch(err){
            console.log("errrr front " ,err);
        }
    }
    // const handltest = async (e) => {
    //     e.preventDefault();
    //     console.log("in handltest ", input);
    //     try{
    //         const rep = await fetch('/api/fetchConv' ,{
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             credentials: "include",
    //             body: JSON.stringify({input}),
    //         });
    //         const repp = await rep.json();
    //         if (repp.success){
    //             const chats = repp.message;
    //             console.log("chattt 1 ", chats[0].PrivMesses[0].contenu)
    //             console.log("chattt 2 ", chats[1].PrivMesses[0].contenu)
    //             console.log("test join ", chats[0].user1.name);
    //         }
    //         else
    //             console.log("errrr back ", repp.message)
    //     }catch(err){
    //         console.log("errrr front " ,err);
    //     }
    // }
    // const navigate = useNavigate();
    // console.log("render wait room");
    // useEffect(() => {
    //     console.log("use effect wait room");
    //     console.log("nb co = " + SocketM.nb());
    //     if (SocketM.nb() === 0) {
    //         SocketM.connect();
    //     }
    //     const toto = {
    //         type: "waitRoom",
    //         mess: "je suis dans wait room",
    //     }



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
    };

    return (
        <>
        <div><GoOUT /></div>
        <div><Training /></div>
        <p>test Room</p>
        <form onSubmit={handltest}>
            <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">Modifier mes informations</button>
        </form>
        </>
    )
}
