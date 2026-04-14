/* extern */
import { useEffect, useState } from "react";

/* back */

/* Css */
import "./StatsPongHistoryCard.scss";

/* Components */

export default function StatsPongHistoryCard({ stats }) {

    //const format_time = (ms) => {
    //    const totalSeconds = Math.floor(ms / 1000);
    //    const minutes = Math.floor(totalSeconds / 60);
    //    const seconds = totalSeconds % 60;
    //    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    //};

    return (
        <article className={`StatsMorpionHistoryCard-root`}>
			<p className={`time`}>time: {stats.time}</p>
			<p className={`stat`}>{`${stats.player1.name} : ${stats.winnner ? 'win' : 'lose'} ${stats.score_1}`}</p>
			<p className={`stat`}>{`${stats.player2.name} : ${stats.winnner ? 'win' : 'lose'} ${stats.score_2}`}</p>
        </article>
    )
}
