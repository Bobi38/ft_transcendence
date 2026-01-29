import "./HomeMessage.css";
import "../../Home.css"

export default function HomeMessage({message}) {
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
