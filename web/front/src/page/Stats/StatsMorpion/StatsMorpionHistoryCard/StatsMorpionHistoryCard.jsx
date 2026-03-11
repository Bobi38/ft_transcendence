/* extern */
import { useEffect, useState } from "react";

/* back */

/* Css */
import "./StatsMorpionHistoryCard.scss";

/* Components */
import Board from "FRONT/page/all_game/MorpionDisplay/Morpion/Board/Board.jsx";


export default function StatsMorpionHistoryCard({ stats }) {

    function format_stats( stats ) {
        console. log("format_stats: ",format_stats)
    }

    const formated_stats = format_stats( stats );
    const style_card = () =>{
        if (1){}
    }

    return (
        <div className={`StatsMorpionHistoryCard-root border-base`}>
            <div className={`board-container`}>
                <Board board={stats} isGame={false}/>
            </div>
            <div className={`game-data border-1`}>
                <p className={`time`}>timer</p>
                <p className={`stat`}>TURN LOGIN X : 3 - MOY/(6MS DIV TURN)</p>
                <p className={`stat`}>TURN LOGIN O : 4 - MOY/(11MS DIV TURN)</p>
            </div>
            <hr/>
        </div>
    )
}

// date_game:"2026-03-04T15:55:23.000Z"

// ending:"win"

// how_win:"horizontal"

// id:19

// loser:5

// map:"----OOXXX"

// nb_turn_player_1:2

// nb_turn_player_2:3

// player_1:5

// player_2:1

// time_player_1:12744

// time_player_2:19879

// winner:1