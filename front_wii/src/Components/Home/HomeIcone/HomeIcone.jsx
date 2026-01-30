import "./HomeIcone.css";
import "../Home.css"


export default function HomeIcone({grid_style, changePage, arg, text, link}) {


    return (
        <>
        <button className={`${grid_style}`} 
                onClick={() => changePage(arg)}>
            <p>
                {text ?? "nothing for moment"}
            </p>
        </button>
        </>
    )
}
