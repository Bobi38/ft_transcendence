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



// /* Css */
// import "./HomeCard.scss";

// /* Components */
    
// export default function HomeCard({children, path}) {
//     return (
//         <div className={`HomeCard`}>
//             <a href={path}>
//                 {children}
//             </a>
//         </div>
//     )
// }
