import "./HomeIcone.css";
import "../../Home.css"


export default function HomeIcone({text, link}) {


    return (
        <>
        <a  href={link} 
            target="_blank" 
            className="iconedisplay iconecolor">
            
            
            <p>
                {text ?? "nothing for moment"}
            </p>
        </a>
        </>
    )
}
