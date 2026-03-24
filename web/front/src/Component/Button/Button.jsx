import { Link } from "react-router-dom";

/* Css */
import "./Button.scss";

/* Components */

export default function Button({children, path, targ = "_self"}) {

	return (
		<Link className={`button`} to={path} target={`${targ}`}>
			{children}
		</Link>
	);
}


// Components de referance

// export default function Button({ children, type_css }) {

//     const css = () =>{
//         switch (type_css){
//             case 1:
//                 return "type1"
//             default:
//                 return "type0"
//         }
//     }

//     return (
//         <>
//             <button className={css}>
//                 {children}
//             </button>
//         </>
//     )
// }