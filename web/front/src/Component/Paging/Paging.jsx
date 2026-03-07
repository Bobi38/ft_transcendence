/* extern */
import { useEffect, useState } from "react";

/* back */
// import checkCo from "BACK/fct1.js"

/* Css */
import "./Paging.scss";

/* Components */


    
export default function Paging({ totalPages, currentPage, setNewPage}) {

    function default_tab() {
        const tab = []

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1) ) {
                tab.push(i);
            }
        }
        return tab;
    }

    function add_dot( tab ){
        const tab_with_dot = [];
        let last;

        for (let i of tab) {

            if (last) {

                if (i - last === 2) {
                    tab_with_dot.push(last + 1);
                }

                else if (i - last > 2) {
                    tab_with_dot.push("...");
                }

            }

            tab_with_dot.push(i);
            last = i;
        }
        return tab_with_dot;
    }


    const [tabWithDot, setTabWithDot] = useState([])


    useEffect(()=> {
        const tab = default_tab();
        setTabWithDot(add_dot(tab));

    },[currentPage])


    const change_page = (arg) => {setNewPage(arg)
        console.log("newCurrentPage: ", arg)
    }

    useEffect(() => {
        console.log("tabWithDot: ", tabWithDot)
    }, [])

    return (
        <div className={`Paging-root`}>

            <ul> 

                <li>
                    <button onClick={(e) => {change_page(currentPage - 1)}}>
                        <span>&lt;</span> prev {/* "<"prev */}
                    </button>
                </li>



                {tabWithDot && tabWithDot.map((page, index) => {

                    if (page === "...") {
                        return (
                            <li key={index} >
                                <span>...</span>
                            </li>
                        );
                    }

                    return (
                        <li key={index} onClick={() => setNewPage(page)} >
                            <span>{page}</span>
                        </li>
                    );
                })}
                {/*
                        if (totalPages < 7)
                            display all
                        


                        if (currentPage <= 4)
                            display '1' +0 / +1 / +2 / +3 / +4
                            single dot before high
                            display highest totalPages

                        <li><button onClick={(e) => {change_page(currentPage - 1)}}>1</button></li>
                        <li><button onClick={(e) => {change_page(currentPage - 1)}}>2</button></li>
                        <li><button onClick={(e) => {change_page(currentPage - 1)}}>3</button></li>
                                <li><button onClick={(e) => {change_page(currentPage - 1)}}>4</button></li>
                        <li><button onClick={(e) => {change_page(currentPage - 1)}}>5</button></li>
                        <li><button onClick={(e) => {change_page(currentPage - 1)}}>…</button></li>
                        <li><button onClick={(e) => {change_page(currentPage - 1)}}>{`${totalPages}`}</button></li> 



                        if (currentPage > 5 && currentPage < totalPages - 4)
                            display lower(everytime 1)
                            dot
                            current -1
                            current
                            current +1
                            dot
                            display highest totalPages

                        <li><button onClick={(e) => {change_page(currentPage - 1)}}>1</button></li>
                        <li><button onClick={(e) => {change_page(currentPage - 1)}}>…</button></li>
                        <li><button onClick={(e) => {change_page(currentPage - 1)}}>4</button></li>
                                <li><button onClick={(e) => {change_page(currentPage - 1)}}>5</button></li>
                        <li><button onClick={(e) => {change_page(currentPage - 1)}}>6</button></li>
                        <li><button onClick={(e) => {change_page(currentPage - 1)}}>…</button></li>
                        <li><button onClick={(e) => {change_page(currentPage - 1)}}>{`${totalPages}`}</button></li> 
                        


                        
                        if (currentPage >= totalPages - 3)
                            display lower(everytime 1)
                            single dot after low
                            display 'totalPages' -4 / -3 / -2 / -1 / -0

                        <li><button onClick={(e) => {change_page(currentPage - 1)}}>1</button></li>
                        <li><button onClick={(e) => {change_page(currentPage - 1)}}>…</button></li>
                        <li><button onClick={(e) => {change_page(currentPage - 1)}}>{`${totalPages - 4}`}</button></li>

                                <li><button onClick={(e) => {change_page(currentPage - 1)}}>{`${totalPages - 3}`}</button></li>
                        
                        <li><button onClick={(e) => {change_page(currentPage - 1)}}>{`${totalPages - 2}`}</button></li>
                        <li><button onClick={(e) => {change_page(currentPage - 1)}}>{`${totalPages - 1}`}</button></li>
                        <li><button onClick={(e) => {change_page(currentPage - 1)}}>{`${totalPages}`}</button></li> 
                    */}

                <li>
                    <button onClick={(e) => {change_page(currentPage + 1)}}>
                        next <span>&gt;</span>  {/* next">" */}
                    </button>
                </li>

            </ul>

        </div>
    )
}