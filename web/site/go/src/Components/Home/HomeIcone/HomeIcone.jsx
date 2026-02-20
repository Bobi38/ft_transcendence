/* Css */
import "./HomeIcone.scss";

/* Components */
import checkCo from "../../../../../fct1.js"

export default function HomeIcone({ parent_style, arg, text }) {

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
            <button onClick={() => {HomeIcone_clicked(arg)}} className={`${parent_style}`}>

                <p>
                    {text ?? "nothing for moment"}
                </p>

            </button>
        </>
    )
}
