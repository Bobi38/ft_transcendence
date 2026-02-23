/* Css */
import "./HomeCard.scss";

/* Components */
    




export default function HomeCard({children, path}) {





    // le boutton connard ? je l'ai oublier ps: c'est moi meme

    return (
        <a className={`HomeCard card-effect`} href={path}>
            {children}
        </a>
    )
}


