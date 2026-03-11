/* back */
import checkCo from "BACK/fct1.js"

/* Css */
import "./HomeCardWearher.scss";

/* Components */


export default function HomeCardWearher({children, path}) {

	const HomeCardWearher_clicked = async (path) => {
        console.log("HomeCardWearher_clicked(1) called");
        window.location.href = path;
    }

    return (

		<button onClick={() => {HomeCardWearher_clicked(path)}} className={`HomeCardWearher card-effect`}>
			{/*<img src="/app/media/aeroplane.svg" alt="grossepute" /> TODOOO*/}
			<p>
				{children}
			</p>
		</button>

	)
}


