/* Css */
import "./HomeIcone.css";

/* Components */
import { Link } from "react-router-dom"; 

export default function HomeIcone({grid_style, arg, text, children}) {


    return (
        <>
        <Link to={arg} className={grid_style}>
        {children ? children : text ?? <p>nothing for moment</p>}
        </Link>
        </>
    )
}
