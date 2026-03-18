/* extern */
import { useEffect, useState } from "react";

/* back */

/* Css */
import "./StatsMorpionHistoryCard.scss";

/* Components */
import Board from "FRONT/page/all_game/MorpionDisplay/Morpion/Board/Board.jsx";

    
export default function StatsMorpionHistoryCard({ stats, nameSearched }) {

    function format_stats( stats ) {
        console. log("format_stats: ",stats)
    }



    const style_card = (arg) => {
        if (arg === "horizontal"){return ("scanline-win-h")}
        else if (arg === "diagonal"){return ("scanline-win-d-rl")}
        else if (arg === "diagonal"){return ("scanline-win-d-lr")}
        else if (arg === "vertical"){return ("scanline-win-v")}
        else return ("")
    }

    const color_card = (how_win, winnerUser)=> {
        console.log(winnerUser)
        if (how_win === "draw") {
            return ("draw")
        } else if (how_win === "abort"){
            return ("abort")
        } else if (winnerUser === nameSearched){
            return ("win")
        } else {
            return ("lose")
        }
    }
    const format_time = (ms) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    
    return (
        <article className={`StatsMorpionHistoryCard-root border-base`}>
            <div className={`${style_card(stats.how_win)}`}></div>

            <div className={`board-container ${color_card(stats.how_win, stats?.winnerUser?.name)}`}>
                <Board board={stats.map.split('')} isGame={false}/>
            </div>

            <div className={`game-data border-1`}>
                <p className={`time`}>time: {format_time(stats.time_player_1 + stats.time_player_2)}</p>
                <p className={`stat`}>{`${stats.player1.name} [X] : ${stats.nb_turn_player_1} turn - MOY/${Math.round(stats.time_player_1 / stats.nb_turn_player_1)}ms`}</p>
                <p className={`stat`}>{`${stats.player2.name} [O] : ${stats.nb_turn_player_2} turn - MOY/${Math.round(stats.time_player_2 / stats.nb_turn_player_2)}ms`}</p>
            </div>

        </article>
    )
}


// date_game:"2026-03-04T15:55:23.000Z"

// ending:"win"

// how_win:"horizontal"

// id:19

// loser:5

// loserUser:{name: '⏰ni⏰'}

// map:"----OOXXX"

// nb_turn_player_1:2

// nb_turn_player_2:3

// player1:{name: '⏰ni⏰'}

// player2:{name: 'toto'}

// player_1:5

// player_2:1

// time_player_1:12744

// time_player_2:19879

// winner:1

// winnerUser:{name: 'toto'}