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

    const [currentPage, setCurrentPage] = useState(1);
    const [totalGames, setTotalGame] = useState(null);
    const [statToDisplay, setStatToDisplay] = useState(null);

    async function fetch_history(login , page_nb) {

        // if (page_nb < 0)
        //     return;

        const url = login 
            ? `/api/morpion/get_morpion_history/${page_nb}?name=${login}`
            : `/api/morpion/get_morpion_history/${page_nb}`;



        console.log(`${url}`)

        const repjson = await useFetch(`${url}`,  {
            method: "GET",
            headers: {'Content-Type': 'application/json'},
            credentials: "include",
        }, function(repjson){
            console.log("useFetch(info) success history: " , repjson.history);
        })
        if (!repjson || (repjson &&  !repjson.success))
            return;
    }

    async function fetch_stats(login) {

        const url = login 
            ? `/api/morpion/get_morpion_stat?name=${login}`
            : `/api/morpion/get_morpion_stat`;

        console.log(`${url}`)

        const repjson = await useFetch(`${url}`,  {
            method: "GET",
            headers: {'Content-Type': 'application/json'},
            credentials: "include",
        }, function(repjson){
            console.log("useFetch(info) success stat_user: " , repjson.stat_user);
        })
        if (!repjson || (repjson &&  !repjson.success))
            return;

        const data = repjson.stat_user;

        setTotalGame(data.total_game);

        const win_horizontal = data.type_X_horizontal_winner + data.type_O_horizontal_winner
        const win_vertical = data.type_X_vertical_winner + data.type_O_vertical_winner
        const win_diagonal = data.type_X_diagonal_winner + data.type_O_diagonal_winner


        const lose_horizontal = data.type_X_horizontal_loser + data.type_O_horizontal_loser
        const lose_vertical = data.type_X_vertical_loser + data.type_O_vertical_loser
        const lose_diagonal = data.type_X_diagonal_loser + data.type_O_diagonal_loser


        const type_X_win = data.type_X_horizontal_winner + data.type_X_vertical_winner + data.type_X_diagonal_winner
        const type_X_lose = data.type_X_horizontal_loser + data.type_X_vertical_loser + data.type_X_diagonal_loser
        
        const type_O_win = data.type_O_horizontal_winner + data.type_O_vertical_winner + data.type_O_diagonal_winner
        const type_O_lose = data.type_O_horizontal_winner + data.type_O_vertical_winner + data.type_O_diagonal_winner
        
        const win_abort = data.type_X_abort_winner + data.type_O_abort_winner
        const draw = data.type_X_draw + data.type_O_draw
        const lose_abort = data.type_X_abort_loser + data.type_O_abort_loser
        
        const all_win_without_abort = win_horizontal + win_vertical + win_diagonal
        const all_lose_without_abort = lose_horizontal + lose_vertical + lose_diagonal

        setStatToDisplay({
            win_horizontal: win_horizontal,
            win_vertical: win_vertical,
            win_diagonal: win_diagonal,
            lose_horizontal: lose_horizontal,
            lose_vertical: lose_vertical,
            lose_diagonal: lose_diagonal,
            type_X_win: type_X_win,
            type_X_lose: type_X_lose,
            type_O_win: type_O_win,
            type_O_lose: type_O_lose,
            win_abort: win_abort,
            draw: draw,
            lose_abort: lose_abort,
            all_win_without_abort: all_win_without_abort,
            all_lose_without_abort: all_lose_without_abort
        });

        console.log("statToDisplay:",statToDisplay);
    }


    
    useEffect(() => {
        fetch_stats("");
        // fetch_history("nana", 42);
        // fetch_history("nana", 0);
        // fetch_history(null, 0);
    }, [])

    useEffect(() => {
            // fetch_history("nana", currentPage);
    }, [currentPage]);

    return (
        
        <div className={`StatsMorpion-root border-base`}>

            <div className={`history-container border-1`}>

                <div className={`history-card-container`}>

                </div>
                <Paging totalPages={10} currentPage={currentPage} setNewPage={setCurrentPage}/>

            </div>

{/* ------------------------------------------------------------------------ */}

            <div className={`game-winrate border-1`}>
                    
                    <div className={`wl-graph border-2`}>
                        <p>Graph</p>
                        <p>win:{statToDisplay&&statToDisplay.all_win_without_abort}</p>
                        <p>lose:{statToDisplay&&statToDisplay.all_lose_without_abort}</p>
                        <p>win:{statToDisplay&&statToDisplay.win_abort}</p>
                        <p>lose:{statToDisplay&&statToDisplay.lose_abort}</p>

                    </div>

                    <div className={`wl-o-x border-2`}>

                        <p>ox-win-loss</p>
                        <p>winO:{statToDisplay&&statToDisplay.type_O_win}</p>
                        <p>loseO:{statToDisplay&&statToDisplay.type_O_lose}</p>
                        <p>winX:{statToDisplay&&statToDisplay.type_X_win}</p>
                        <p>loseX:{statToDisplay&&statToDisplay.type_X_lose}</p>

                    </div>

                    <div className={`wl-horizontal border-2`}>
                        <p>horizontal</p>
                        <p>win:{statToDisplay&&statToDisplay.win_horizontal}</p>
                        <p>lose:{statToDisplay&&statToDisplay.lose_horizontal}</p>
                    </div>

                    <div className={`wl-diagonal border-2`}>
                        <p>diagonal</p>
                        <p>win:{statToDisplay&&statToDisplay.win_diagonal}</p>
                        <p>lose:{statToDisplay&&statToDisplay.lose_diagonal}</p>
                    </div>

                    <div className={`wl-vertical border-2`}>
                        <p>vertical</p>
                        <p>win:{statToDisplay&&statToDisplay.win_vertical}</p>
                        <p>lose:{statToDisplay&&statToDisplay.lose_vertical}</p>
                    </div>

            </div>
        </div>
    )
}

