/* extern */
import { useEffect, useState }      from "react";

/* back */
/* Css */
import "./StatsMorpion.scss";

/* Components */
import useFetch                     from "TOOL/useFetch.jsx";
import Paging                       from "COMP/Paging/Paging.jsx";
import StatsMorpionHistoryCard      from "./StatsMorpionHistoryCard/StatsMorpionHistoryCard";

function cal_percentage(value, max)
{
	if (max === 0)
		return 0
	return (Math.round(value / max * 100))
}

export default function StatsMorpion({ username, setUsername }) {

    const limit = 5;
    const [statToDisplay, setStatToDisplay] = useState(null);
    const [historyUser, setHistoryUser] = useState([]);
    const [currentPage, setNewPage] = useState(0);

    async function fetch_stats() {

        const url = username
            ? `/api/morpion/get_stat?name=${username}`
            : `/api/morpion/get_stat`;


        const repjson = await useFetch(`${url}`,  {
            method: "GET",
            headers: {'Content-Type': 'application/json'},
            credentials: "include",
        })
        if (!repjson || (repjson &&  !repjson.success)){
            setStatToDisplay(null);
            setHistoryUser([]);
            setNewPage(0);
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
            username: username,
			total_game: data.total_game,

            all_win_without_abort: all_win_without_abort,
            all_lose_without_abort: all_lose_without_abort,
			draw: draw,

			win_abort: win_abort,
			lose_abort: lose_abort,

			winrate_total: cal_percentage(all_win_without_abort, (all_win_without_abort + all_lose_without_abort)),
			winrate_X: cal_percentage(type_X_win, (type_X_lose + type_X_win)),
			winrate_O: cal_percentage(type_O_win, (type_O_lose + type_O_win)),
			winrate_horizontal: cal_percentage(win_horizontal, all_win_without_abort),
			winrate_vertical: cal_percentage(win_vertical, all_win_without_abort),
			winrate_diagonal: cal_percentage(win_diagonal, all_win_without_abort),
        };

        if (statToDisplay === null || statToDisplay.total_game < data.total_game) {
            setNewPage(0)
        }
		setStatToDisplay(data_formated);
    }

    async function fetch_history(page_nb) {

        
        const url = username
            ? `/api/morpion/get_history/${page_nb}?limit=${limit}&name=${username}`
            : `/api/morpion/get_history/${page_nb}?limit=${limit}`;


        const repjson = await useFetch(`${url}`,  {
            method: "GET",
            headers: {'Content-Type': 'application/json'},
            credentials: "include",
        })
        if (!repjson)
            return;
		if ((repjson && !repjson.success))
			setHistoryUser([]);
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
        <section className={`StatsMorpion-root`}>

            <div className={`history-container`}>

				{historyUser?.length !== 0 ? (
					<>
						<div className={`history-card-container`}>

							{historyUser?.map((element, index) => {
								return (<StatsMorpionHistoryCard key={index} stats={element} nameSearched={username}/>)
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
					<p>Total game played: { statToDisplay?.total_game }</p>
					<p>Total win: { statToDisplay?.all_win_without_abort }</p>
					<p>Total lose: { statToDisplay?.all_lose_without_abort }</p>
					<p>Total draw: { statToDisplay?.draw }</p>
					<p>Win by surrender: { statToDisplay?.win_abort }</p>
					<p>Lose by surrender: { statToDisplay?.lose_abort }</p>
					<p>Winrate: { statToDisplay?.winrate_total }%</p>
					<p>Winrate with X: { statToDisplay?.winrate_O }%</p>
					<p>Winrate with O: { statToDisplay?.winrate_X }%</p>
					<p>Winrate in horizontal: { statToDisplay?.winrate_horizontal }%</p>
					<p>Winrate in vertical: { statToDisplay?.winrate_vertical }%</p>
					<p>Winrate in digonal: { statToDisplay?.winrate_diagonal }%</p>
				</div>
			</aside>
			</section>
		)
}

