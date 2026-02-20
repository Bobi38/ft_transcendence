/* Css */
import "./HomeCard.scss";

/* Components */
    
export default function HomeCard({children}) {
    return (
        <div className={`HomeCard`}>
            {children}
        </div>
    )
}
