/* extern */
import { useEffect, useState } from "react";

/* back */

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

        const win = data.win;
        const lose = data.lose;
        const total_game = data.total_game;
        const time_played = data.time_played;

        const winrate = total_game > 0 ? ((win / total_game) * 100).toFixed(2) : 0;

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

                    <div>
                        win:1
                        lose:1
                    </div>
                
                    <div>
                        abort win:0
                        abort lose:0
                    </div>
                    <div>
                        total time player: 8:00
                        total ball hit: 80
                    </div>
                    <div>
                        Moy time/game: 4:00
                        Moy ballhit/game: 40
                    </div>

                </div>
            </aside>
        </section>
    )
}
