import "./HomeIcone.css";
import "../Home.css"


export default function HomeIcone({text, link, grid_style}) {


    return (
        <>
        <a  href={link} 
            target="_blank" 
            className={`${grid_style}`}>
            
            
            <p>
                {text ?? "nothing for moment"}
            </p>
        </a>
        </>
    )
}
