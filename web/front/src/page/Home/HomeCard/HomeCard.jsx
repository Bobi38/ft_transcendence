import { Link } from "react-router-dom";


/* back */

/* Css */
import "./HomeCard.scss";

/* Components */


export default function HomeCard({children, path}) {

    return (
		<Link to={path} className={`HomeCard-root`}>
			<p>
				{children}
			</p>
		</Link>
	)
}


