/* extern */
import { useState, useEffect } from "react";

/* back */
import  SocketM  from "/app/tool/SocketManag.js";

/* Css */
import './Morpion.scss';

/* Components */
import Board from "./Board/Board.jsx";

function RebootTruc() {

    return (
        <button onClick={() => {
            SocketM.sendd(SocketM.socket.morp,{
                type: "reboot",
                message: "reboot"
            })
        }}>
            Reboot (dev - ne pas utiliser - a supprimer en prod)
        </button>
    );
}

function GoOut(){

    return (
        <button onClick={() =>{
            SocketM.sendd(SocketM.socket.morp,{
                type: "leave",
            })
        }}>
            je veux partir
        </button>
    );
}

function SelectSecondPlayer(){
    return (
        <button onClick={() => {
            SocketM.sendd(SocketM.socket.morp,{
                type: "second",
            })
        }}>
            je veux jouer en second
        </button>
    ); 
}

function NouvellePartie({ setBoard }){

    return (
        <button onClick={() => {
            setBoard(Array(9).fill(""));
            SocketM.sendd(SocketM.socket.morp,{
                type: "play",
            })
        }}>
            Nouvelle Partie
        </button>
    );
}

export default function Morpion() {


    const [msg, setMsg] = useState("Royal Morpion(the ultim morpion)");
    const [board, setBoard] = useState(null);
    const [wait, setWait] = useState(0);

      useEffect(() => {

        console.log("Morpion component called");

        const handleTest = (data) => {
         
            console.log("Morpion component handleTest data:", data)
            if (data.message !== msg){
                setMsg(data.message);
            }
            if (data.board && data.board !== board){
                setBoard(data.board);
            }
        };

        SocketM.on("morp",handleTest, "un");

        return () => {
            SocketM.off("morp", "un");
        }

    }, []);

    useEffect(() => {
        if (msg !== "search") return;

        const interval = setInterval(() => {
            setWait((prev) => (prev + 1) % 5);
        }, 900);
        return () => clearInterval(interval);
    }, [msg]);

    return (
        <div className={`Morpion-root`}>

            <div className={`info`}>

                <RebootTruc/>

                <GoOut/>

                <SelectSecondPlayer/>

                <div className="status">
                    {msg === "search"
                        ? <>
                            recherche en cours<span className="wait">{".".repeat(wait)}</span>
                        </>
                        : msg
                    }
                </div>

            </div>

            <Board board={board} isGame={true}/>

            <NouvellePartie setBoard={setBoard}/>

        </div>
    );
}

// /* extern */
// import { useState, useEffect } from "react";

// /* back */
// import  SocketM  from "/app/tool/SocketManag.js";

// /* Css */
// import './Morpion.scss';

// /* Components */
// import Board from "./Board/Board.jsx";

// function Reboot() {
//   return (
//     <button
//       onClick={() =>
//         SocketM.sendd(SocketM.socket.morp, {
//           type: "reboot",
//           mess: "reboot"
//         })
//       }
//     >
//       Reboot (dev - ne pas utiliser - a supprimer en prod)
//     </button>
//   );
// }

// function GoOut(){
//   return (
//   <button onClick={() =>
//     SocketM.sendd(SocketM.socket.morp, {
//         type: "leave",
//         mess: "bye bye"
//       })
//     }
//   > 
//     je veux partir
//   </button>
//   );
// }

// function SelectSecondPlayer(){
//   return (
//   <button onClick={() =>
//     SocketM.sendd(SocketM.socket.morp, {
//         type: "second",
//         mess: "fairplay"
//       })
//     }
//   > 
//     play second
//   </button>
//   );
// }

// function NewParty(){
//   return (
//   <button onClick={() =>
//     SocketM.sendd(SocketM.socket.morp, {
//         type: "play",
//         mess: "start"
//       })
//     }
//   > 
//     play play
//   </button>
//   );
// }

// export default function Morpion() {

//     const [msg, setMsg] = useState("Royal Morpion(the ultim morpion)");
//     const [board, setBoard] = useState(null);
//     const [wait, setWait] = useState(0);

//       useEffect(() => {

//         console.log("Morpion component called");

//         const handleTest = (data) => {
         
//             console.log("Morpion component handleTest data:", data)
//             if (data.message){
//                 setMsg(data.message);
//             }
//             if (data.board){
//                 setBoard(data.board);
//             }
//         };

//         SocketM.on("morp", handleTest, "un");

//         return () => {
//             SocketM.off("morp", "un");
//         }

//     }, []);

//     useEffect(() => {
//         if (msg !== "recherche") return;

//         const interval = setInterval(() => {
//             setWait((prev) => (prev + 1) % 5);
//         }, 900);

//         return () => clearInterval(interval);
//     }, [msg]);

//     return (
//         <div className={`Morpion-root`}>

//             <div className={`info`}>

//                 <Reboot/>

//                 <GoOut/>

//                 <SelectSecondPlayer/>

//                 <div className="status">
//                     {msg === "search"
//                         ? <>
//                             search<span className="wait">{".".repeat(wait)}</span>
//                         </>
//                         : msg
//                     }
//                 </div>

//             </div>

//             <Board board={board} isGame={true}/>

//             <NewParty setBoard={setBoard}/>

//         </div>
//     );
// }