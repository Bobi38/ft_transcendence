/* back */

/* Css */
import "./HomeCard.scss";

/* Components */


export default function HomeCard({children, path}) {

	const HomeCard_clicked = async (path) => {
        console.log("HomeCard_clicked(1) called");
        window.location.href = path;
    }

    return (

		<button onClick={() => {HomeCard_clicked(path)}} className={`HomeCard-root card-effect`}>
			{/*<img src="/app/media/aeroplane.svg" alt="grossepute" /> TODOOO*/}
			<p>
				{children}
			</p>
		</button>

	)
}


