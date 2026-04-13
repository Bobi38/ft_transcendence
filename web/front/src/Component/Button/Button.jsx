import { Link } 	from	"react-router-dom";

/* Css */
import "./Button.scss";

/* Components */

export default function Button({children, path, targ = "_self"}) {

	if (path)
	{
		return (
			<Link className={`button`} to={path} target={`${targ}`}>
				{children}
			</Link>
		);
	}
	return (
		<button className={`button`}>
			{children}
		</button>
	);
}
