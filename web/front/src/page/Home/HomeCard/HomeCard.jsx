/* back */
import checkCo from "BACK/fct1.js"

/* Css */
import "./HomeCard.scss";

/* Components */


export default function HomeCard({children, path}) {

	const HomeCard_clicked = async (path) => {

        console.log("HomeCard_clicked(1) called");
        const resCo = await checkCo();
        if (!resCo) {
            console.log("HomeCard_clicked(2) checkco failed");
            return;
        }
        console.log("HomeCard_clicked(3) navigation autoriser");
        window.location.href = path;

    }

    return (
            <button onClick={() => {HomeCard_clicked(path)}} className={`HomeCard card-effect`}>
                <p>
                    {children}
                </p>
            </button>
    )
}


