/* extern */
import { useEffect, useState } from "react";

/* back */
// import checkCo from "BACK/fct1.js"

/* Css */
import "./StatsMorpion.scss";

/* Components */
import Paging from "COMP/Paging/Paging.jsx"; 
import useFetch from "HOOKS/useFetch.jsx";   

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
        if (page_nb < 0)
            return;

        const url = `/api/morpion/get_morpion_stat/${page_nb}`;         // const page = parseInt(req.params.page);
        // const url = `/api/get_morpion_stat?page=${page_nb}`; // const page = parseInt(req.query.page);

        console.log(`${url}`)

        const repjson = await useFetch(`${url}`,  {
            method: "GET",
            headers: {'Content-Type': 'application/json'},
            credentials: "include",
        }, function(repjson){
            console.log("useFetch(info) success stat_user: " , repjson.stat_user);
            console.log("useFetch(info) success history: " , repjson.history);
        })
        if (!repjson || (repjson &&  !repjson.success))
            return;
        // setCurrentPage(...)
    }


    fetch_stats(0);

    return (
        <div className={`StatsMorpion-root border-base`}>

                <div className={`history-container border-1`}>

                    <div className={`history-card-container`}>

                    </div>
                    <Paging currentPage={currentPage} setNewPage={setCurrentPage}/>

                </div>

{/* ------------------------------------------------------------------------ */}

            <div className={`game-winrate border-4`}>
                    
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
