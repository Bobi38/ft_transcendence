/* extern */
import { useEffect, useState }  from    "react";

/* Css */
import "./Paging.scss";

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
    },[currentPage, totalPages])


    const change_page = (arg) => {
        setNewPage(arg)
    }

    return (
        <div className={`Paging-root`}>

            <ul> 

                <li className={`onhover`}>
                    <button onClick={(e) => {(currentPage == 1) ? null : change_page(currentPage - 1)}}>
                        &lt;prev {/* "<"prev */}
                    </button>
                </li>

                {tabWithDot?.map((page, index) => {

                    if (page === "...") {
                        return (
                            <li key={index} >
                                ...
                            </li>
                        );
                    }
                    if (page === currentPage){
                        return(
                            <li key={index} onClick={() => setNewPage(page)} className={`active`}>
                                {page}
                            </li>
                        )
                    }
                    return (
                        <li key={index} onClick={() => setNewPage(page)} className={`onhover`}>
                            {page}
                        </li>
                    );
                })}

                <li className={`onhover`}>
                    <button onClick={(e) => {(currentPage == totalPages) ? null : change_page(currentPage + 1)}}>
                        next&gt;  {/* next">" */}
                    </button>
                </li>

            </ul>

        </div>
    )
}