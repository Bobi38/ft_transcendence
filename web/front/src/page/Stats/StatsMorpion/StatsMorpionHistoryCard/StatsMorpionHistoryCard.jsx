/* extern */
import { useEffect, useState } from "react";

/* back */
import checkCo from "BACK/fct1.js"

/* Css */
import "./StatsMorpionHistoryCard.scss";

/* Components */


    
export default function StatsMorpionHistoryCard() {
    return (
        <div className={`StatsMorpionHistoryCard-root border-base`}>
            <div className={`map border-1`}>

            </div>
            <div className={`game-data border-1`}>
                <p className={`time`}>timer</p>
                <p className={`stat`}>TURN  LOGIN X : 3 - MOY/(6MS DIV TURN)<hr/>TURN  LOGIN O : 4 - MOY/(11MS DIV TURN)</p>
            </div>
        </div>
    )
}
