import "./Homemessage.css";
import "../../Home.css"

export default function Homemessage({message}) {
    return (
        <>
            <div className="grid-pos-4-3 iconecolor">
                {message??<p>wqer</p>}
                {message??<p>wqer</p>}
                {message??<p>wqer</p>}
                {message??<p>wqer</p>}
            </div>
        </>
    )
}
