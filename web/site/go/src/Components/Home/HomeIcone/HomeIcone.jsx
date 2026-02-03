/* Css */
import "./HomeIcone.css";

/* Components */
import { Link } from "react-router-dom"; 

export default function HomeIcone({ grid_style, arg, text }) {


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
