/* extern */
import { useEffect, useState } from "react";

/* back */
// import checkCo from "BACK/fct1.js"

/* Css */
import "./StatsPong3D.scss";

/* Components */
import useFetch from "HOOKS/useFetch.jsx";   
import Paging from "COMP/Paging/Paging.jsx"; 
import StatsPong3DHistoryCard from "./StatsPong3DHistoryCard/StatsPong3DHistoryCard";

export default function StatsPong3D({ username, setUsername }) {

    const limit = 5;
    const [totalGames, setTotalGame] = useState(1);
    const [statToDisplay, setStatToDisplay] = useState(null);
    const [historyUser, setHistoryUser] = useState([]);
    const [currentPage, setNewPage] = useState(1);

    async function fetch_stats() {

        const url = username 
            ? `/api/pong3d/get_stat?name=${username}`
            : `/api/pong3d/get_stat`;

        console.log(`${url}`)

        const repjson = await useFetch(`${url}`,  {
            method: "GET",
            headers: {'Content-Type': 'application/json'},
            credentials: "include",
        }, function(repjson){
            console.log("useFetch(info) success stat_user: " , repjson.stat_user);
        })
        if (!repjson || (repjson &&  !repjson.success)){
            setTotalGame(null);
            setStatToDisplay(null);
            setHistoryUser([]);
            setNewPage(1);
            return;
        }

        const data = repjson.stat_user;

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

        const data_formated = {
            win_horizontal: win_horizontal + 1,
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
        };

        setStatToDisplay(data_formated);

        if (totalGames < data.total_game){
            setTotalGame(data.total_game);
            setNewPage(1)
        }
    }


    async function fetch_history(page_nb) {

        const url = username 
            ? `/api/pong3d/get_history/${page_nb}?limit=${limit}&name=${username}`
            : `/api/pong3d/get_history/${page_nb}?limit=${limit}`;

        console.log(`${url}`)

        const repjson = await useFetch(`${url}`,  {
            method: "GET",
            headers: {'Content-Type': 'application/json'},
            credentials: "include",
        }, function(repjson){
            console.log("useFetch(info) success history_user: " , repjson.history_user);
        })
        if (!repjson || (repjson &&  !repjson.success))
            return;
        setHistoryUser(repjson.history_user);
    }


    useEffect(() => {
        fetch_stats();
        fetch_history(currentPage - 1);
    }, [username, currentPage]);



    /* form */
    const [inputValue, setInputValue] = useState("");


    return (
        
        <section className={`StatsPong3D-root border-base`}>
            <div className={`history-container border-1`}>

                <div className={`history-card-container border-2`}>

                    {historyUser?.map((element, index) => {
                        return (<StatsPong3DHistoryCard key={index} stats={element} nameSearched={username}/>)
                    })}

                </div>
                <Paging totalPages={Math.ceil(totalGames / limit)} currentPage={currentPage} setNewPage={setNewPage}/>

            </div>

            <aside className={`aside border-1`}>

                <div className={`search border-2`}>
                    <form className={`searchmorp`} onSubmit={(e) => {e.preventDefault(); setUsername(inputValue); setNewPage(1);setInputValue("")}}>
                        <input type={`text`} value={inputValue}
                            onChange={(e) => {setInputValue(e.target.value);}} 
                            />
                        <input type={`submit`} value={`search`}/>
                    </form>
                </div>

                <div className={`game-winrate border-2`}>

                </div>
            </aside>
        </section>
    )
}

