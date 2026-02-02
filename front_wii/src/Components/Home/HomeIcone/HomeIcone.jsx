/* Css */
import "../Home.css"
import "./HomeIcone.css";

import { Link } from "react-router-dom"; 

export default function HomeIcone({grid_style, arg, text, link}) {


    return (
        <>
        <Link to={arg} className={`${grid_style}`} >
            <p>
                {text ?? "nothing for moment"}
            </p>
        </Link>
        </>
    )
}
