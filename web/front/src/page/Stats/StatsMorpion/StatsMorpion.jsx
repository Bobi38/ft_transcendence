/* extern */
import { useEffect, useState } from "react";

/* back */
// import checkCo from "BACK/fct1.js"

/* Css */
import "./StatsMorpion.scss";

/* Components */
import Paging from "COMP/Paging/Paging.jsx";    

export default function StatsMorpion() {

    // const data = {
    //     my_id: 1,
    //     history: [
    //         {
    //             gameid: 1,
    //             game_stats:{
                    
    //                 map: "OX--XO-XO",
    //                 //has_result: {same winner_id = green / not same winner_is = red}, "draw,abort" = blue
    //                 game_result: "has_result,draw,abort",
    //                 id_user: {
    //                     //null !has_result
    //                     winner_id: 1,//if is not my id i have lost
    //                     player:  [
    //                         {id:1, ox: 'X'},
    //                         {id:2, ox: 'O'}
    //                     ]
    //                 },
    //             }
    //         },
    //         {
    //             gameid: 2,
    //             game_stats:{
                    
    //                 map: "OX--XO-XO",
    //                 //has_result: {same winner_id = green / not same winner_is = red}, "draw,abort" = blue
    //                 game_result: "has_result,draw,abort",
    //                 id_user: {
    //                     //null !has_result
    //                     winner_id: 2,//if is not my id i have lost
    //                     player: [
    //                         {id:1, ox: 'X'},
    //                         {id:2, ox: 'O'}
    //                     ]
    //                 },
    //             }
    //         }
    //     ],
    //     stat_user:{
    //         total_game:20,
    //         win:{
    //             O_side:5,
    //             X_side:5,
    //             type: {
    //                 horizontal:1,
    //                 vertical:1,
    //                 diagonal:1,
    //             }
    //         },
    //         lost:{
    //             O_side:5,
    //             X_side:5,
    //             type: {
    //                 horizontal:1,
    //                 vertical:1,
    //                 diagonal:1,
    //             }
    //         },
    //         draw: {
    //             O_side:5,
    //             X_side:5,
    //             type: {
    //                 horizontal:1,
    //                 vertical:1,
    //                 diagonal:1,
    //             }
    //         },
    //         abort:{
    //             O_side:5,
    //             X_side:5,
    //             type: {
    //                 horizontal:1,
    //                 vertical:1,
    //                 diagonal:1,
    //             }
    //         },
    //     }
    // }

    const [currentPage, setCurrentPage] = useState("");


    async function fetch_stats(page_nb) {

        console.log("fetch_stats(1) called");

        try{
            const reponse = await fetch(`/api/get_morpion_stat/${page_nb}`, {
            // const reponse = await fetch(`/api/get_morpion_stat?page=${page_nb}`, {
                method: "GET",
                headers: {'Content-Type': 'application/json'},
                credentials: "include",
            });
            console.log("fetch_stats(1.5) ", reponse);
            const repjson = await reponse.json();
            if (repjson.success){
                console.log("fetch_stats(2) success stat_user: " , repjson.stat_user);
                console.log("fetch_stats(3) success history: " , repjson.history);
            } else
                console.error("fetch_stats(4) Error back ", repjson.message);
        }catch(error){
            console.error("fetch_stats(5) Error front: ", error);
        }
    }

    fetch_stats(1);

    return (
        <div className={`StatsMorpion-root border-base`}>

                <div className={`history-container border-red`}>

                    <div className={`history-card-container`}>

                    </div>
                    <Paging currentPage={currentPage} setNewPage={setCurrentPage}/>

                </div>

{/* ------------------------------------------------------------------------ */}

            <div className={`game-winrate border-yellow`}>
                    
                    <div className={`border wl-graph`}>
                        <p>Graph</p>
                    </div>

                    <div className={`border wl-o-x`}>
                        <p>ox-win-loss</p>
                    </div>

                    <div className={`border wl-horizontal`}>
                        <p>h</p>
                    </div>

                    <div className={`border wl-diagonal`}>
                        <p>d</p>
                    </div>

                    <div className={`border wl-vertical`}>
                        <p>v</p>
                    </div>

            </div>{/* game-winrate */}
{/* StatsMorpion-root */}
        </div>
    )
}
