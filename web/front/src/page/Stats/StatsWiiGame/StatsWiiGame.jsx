/* extern */
import { useEffect, useState } from "react";

/* back */

/* Css */
import "./StatsWiiGame.scss";

/* Components */
import useFetch from "HOOKS/useFetch.jsx";   
// import Paging from "COMP/Paging/Paging.jsx";




export default function StatsWiiGame({ username, setUsername }) {

    const [totalGames, setTotalGame] = useState(null);
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
        const data_formated = {oui: "oui"}
        setStatToDisplay(data_formated);
    }

    
    return (
        <>
            <div>
                
            </div>
        </>
    )
}
