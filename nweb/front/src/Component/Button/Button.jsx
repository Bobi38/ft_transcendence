/* Css */
import "./Button.scss";

/* Components */
    
export default function Button({children, path}) {

	if (path)
	{

		return (
			<a className={`button`} href={path}>
				{children}
			</a>
		);
	}
	else
    return (

		<button className={`button`}>
			{children}
		</button>

	)
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