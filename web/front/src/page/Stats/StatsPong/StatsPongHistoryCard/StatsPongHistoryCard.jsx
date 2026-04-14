/* Css */
import "./StatsPongHistoryCard.scss";

/* Components */

export const format_time = (s) => {
	const hours = Math.floor(s / 3600)
	const minutes = Math.floor(s % 3600 / 60);
	const seconds = s % 60;
	return `${hours > 0 ? `${hours}h` : ''} ${minutes}m ${seconds.toString().padStart(2, '0')}s`;
};

export default function StatsPongHistoryCard({ stats }) {
    return (
        <article className={`StatsPongHistoryCard-root`}>
			<p className={`time`}>Game duration: {format_time(stats.time)}</p>
			{stats.abortwinner ? (
				<>
					<p className={`stat`}>{`${stats.player1.name} ${stats.id_player_1 == stats.abortwinner ? 'won' : 'lost'} after abort with ${stats.score_1} point${stats.score_1 <= 1 ? '' : 's'}`}</p>
					<p className={`stat`}>{`${stats.player2.name} ${stats.id_player_2 == stats.abortwinner ? 'won' : 'lost'} after abort with ${stats.score_2} point${stats.score_2 <= 1 ? '' : 's'}`}</p>
				</>
			) : (
				<>
					<p className={`stat`}>{`${stats.player1.name} ${stats.id_player_1 == stats.winner ? 'won' : 'lost'} with ${stats.score_1} point${stats.score_1 <= 1 ? '' : 's'}`}</p>
					<p className={`stat`}>{`${stats.player2.name} ${stats.id_player_2 == stats.winner ? 'won' : 'lost'} with ${stats.score_2} point${stats.score_2 <= 1 ? '' : 's'}`}</p>
				</>
			) }
        </article>
    )
}
