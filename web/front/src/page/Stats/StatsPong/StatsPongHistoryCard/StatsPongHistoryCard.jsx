/* Css */
import "./StatsPongHistoryCard.scss";

/* Components */

export const format_time = (ms) => {
	const s = ms / 1000;
	const hours = Math.floor(s / 3600);
    const minutes = Math.floor((s % 3600) / 60);
    const seconds = Math.floor(s % 60);

    const parts = [];

    if (hours > 0) {
		parts.push(`${hours}h`)
	};
    if (hours > 0 || minutes > 0) {
        parts.push(`${minutes}m`);
    }
    parts.push(`${seconds.toString().padStart(2, '0')}s`);
    return parts.join(' ');
};

export default function StatsPongHistoryCard({ stats }) {
    return (
        <article className={`StatsPongHistoryCard-root`}>
			<p className={`time`}>Game duration: {format_time(stats.time)}</p>
			{stats.abortwinner ? (
				<>
					<p className={`stat`}>{`${stats.player1.name} game was aborted...`}</p>
					<p className={`stat`}>{`${stats.player2.name} game was aborted...`}</p>
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
