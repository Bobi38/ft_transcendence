/* extern */
import { Link } 	from	"react-router-dom";

/* Css */
import "./HomeCard.scss";

export default function HomeCard({children, path}) {

    return (
		<Link to={path} className={`HomeCard-root`}>
			<p>
				{children}
			</p>
		</Link>
	);
}


