/* extern */
import { useEffect, useState }      from "react";

/* back */
/* Css */
import "./StatsPong.scss";

/* Components */
import useFetch                     from "TOOL/useFetch.jsx";
import Paging                       from "COMP/Paging/Paging.jsx";
import StatsPongHistoryCard         from "./StatsPongHistoryCard/StatsPongHistoryCard";
import { format_time }				from "./StatsPongHistoryCard/StatsPongHistoryCard"

function cal_percentage(value, max)
{
	if (max === 0)
		return 0
	return (Math.round(value / max * 100))
}

export default function StatsPong({ username, setUsername }) {

    const limit = 5;
    const [statToDisplay, setStatToDisplay] = useState(null);
    const [historyUser, setHistoryUser] = useState([]);
    const [currentPage, setNewPage] = useState(0);

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
            console.log(repjson.message)
            setStatToDisplay(null);
            setHistoryUser([]);
            setNewPage(0);
            return;
        }

        const data = repjson.stat_user;

		const win = data.win;// + data.abortwinner;
		const lose = data.lose;// + data.abortloser;
		const abort = data.abortwinner + data.abortloser;

        const data_formated = {
			total_game: data.total_game,
			time_played: data.time_played,
			win: win,
			lose: lose,
			abort: abort,
			winrate: cal_percentage(win, win + lose)
        };

        if (statToDisplay === null || statToDisplay.total_game < data.total_game) {
            setNewPage(0)
        }
		setStatToDisplay(data_formated);
    }

    async function fetch_history(page_nb) {

        console.log("fetch_history",page_nb)
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
        if (!repjson)
            return;
		if ((repjson && !repjson.success)){
            console.log(repjson.message);
			setHistoryUser([]);
        }
		else
			setHistoryUser(repjson.history_user);
    }

    useEffect(() => {
        const test = async ()  => {
            await fetch_stats();
        }
        test();
        fetch_history(currentPage);
    }, [username, currentPage]);

    return (
        <section className={`StatsPong-root`}>

            <div className={`history-container`}>

				{historyUser?.length !== 0 ? (
					<>
						<div className={`history-card-container`}>

							{historyUser?.map((element, index) => {
								return (<StatsPongHistoryCard key={index} stats={element}/>)
							})}

						</div>
						<Paging totalPages={Math.ceil((statToDisplay?.total_game ?? 1) / limit)} currentPage={currentPage} setNewPage={setNewPage}/>
					</>
				):(
					<div className="histoy-empty">
						<p>Go play games, nothing here...</p>
					</div>
				)}
            </div>

            <aside>

				<form onSubmit={(e) => {e.preventDefault();
					if (e.target.name.value.lenght === 0) return
					setUsername(e.target.name.value); setNewPage(0);}}>
					<input type={`text`} id="name" name="name" placeholder="Username" required/>
					<input type={`submit`} value={`Search`}/>
				</form>

				<hr />

				<div className="content">
					<p>Total time played: { format_time(statToDisplay?.time_played) }</p>
					<p>Total game played: { statToDisplay?.total_game }</p>
					<p>Total win: { statToDisplay?.win }</p>
					<p>Total lose: { statToDisplay?.lose }</p>
					<p>Game aborted: { statToDisplay?.abort }</p>
					<p>Winrate: { statToDisplay?.winrate }%</p>
				</div>
			</aside>
			</section>
		)
}

