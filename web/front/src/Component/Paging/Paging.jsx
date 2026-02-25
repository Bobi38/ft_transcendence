/* extern */
// import { useEffect, useState } from "react";

/* back */
// import checkCo from "BACK/fct1.js"

/* Css */
import "./Paging.scss";

/* Components */


    
export default function Paging({currentPage , setCurrentPage}) {

    const change_page = (arg) => {
        
        console.log("change_page(1) go to:", arg)
        setCurrentPage(arg)
    }

    return (
        <div className={`Paging-root`}>

            <nav aria-label="pagination">

                <ul className="pagination">
                    <li>
                        <button>
                            <span aria-hidden="true">&laquo;</span>
                        </button>
                    </li>

                    <li>
                        <button onClick={(e) => {change_page(1)}}>1</button>
                    </li>

                    <li>
                        <button aria-current="page" onClick={(e) => {change_page(2)}}>2</button>
                    </li>

                    <li>
                        <button onClick={(e) => {e.preventDefault();change_page(3)}}>3</button>
                    </li>

                    <li>
                        <button onClick={(e) => {change_page(4)}}>4</button>
                    </li>

                    <li>
                        <button>
                            <span aria-hidden="true">&raquo;</span>
                        </button>
                    </li>
                </ul>

            </nav>

        </div>
    )
}
