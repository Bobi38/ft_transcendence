/* Css */
import "./HomeCard.scss";

/* Components */
    
export default function HomeCard({children, path}) {
    return (
        <a className={`HomeCard`} href={path}>
            {children}
        </a>
    )
}


