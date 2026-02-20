/* Css */
import "./HomeIcone.scss";

/* Components */
import checkCo from "/app/back/src/fct1.js"

export default function HomeIcone({ grid_id, arg, text }) {

	const HomeIcone_clicked = async (arg) => {

        console.log("HomeIcone_clicked(1) called");
        const resCo = await checkCo();
        if (!resCo) {
            console.log("HomeIcone_clicked(2) checkco failed");
            return;
        }
        console.log("HomeIcone_clicked(3) navigation autoriser");
        window.location.href = arg;

    }

    return (
        <>
            <button onClick={() => {HomeIcone_clicked(arg)}} className={`${grid_id} Home-iconedisplay Home-iconemargin iconecolor`}>

                <p>
                    {text ?? "nothing for moment"}
                </p>

            </button>
        </>
    )
}
