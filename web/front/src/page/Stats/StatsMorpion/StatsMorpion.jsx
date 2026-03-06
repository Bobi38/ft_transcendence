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



    const [currentPage, setCurrentPage] = useState(null);
    const [totalPage, setTotalPage] = useState(null);

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

        // setCurrentPage(...)
        // setTotalPage(...)
    }


    
    useEffect(() => {
        // fetch_history("nana", 42);
        // fetch_history("nana", 0);
        // fetch_history(null, 0);
        // fetch_stats("nana");
    }, [])

    return (
        <div className={`StatsMorpion-root border-base`}>

            <div className={`history-container border-1`}>

                <div className={`history-card-container`}>

                </div>
                <Paging  currentPage={currentPage} setNewPage={setCurrentPage}/>

            </div>

{/* ------------------------------------------------------------------------ */}

            <div className={`game-winrate border-1`}>
                    
                    <div className={`wl-graph border-2`}>
                        <p>Graph</p>
                    </div>

                    <div className={`wl-o-x border-2`}>
                        <p>ox-win-loss</p>
                    </div>

                    <div className={`wl-horizontal border-2`}>
                        <p>h</p>
                    </div>

                    <div className={`wl-diagonal border-2`}>
                        <p>d</p>
                    </div>

                    <div className={`wl-vertical border-2`}>
                        <p>v</p>
                    </div>

            </div>
        </div>
    )
}

