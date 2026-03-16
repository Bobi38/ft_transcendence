/* extern */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/* back */
import checkCo from "../../../tool/fct1.js"

/* Css */
import "./Home.scss";

/* Components */
import PopUp from "./PopUp/PopUp.jsx"
import HomeChat from "./HomeChat/HomeChat.jsx";
import HomeCard from "./HomeCard/HomeCard.jsx";
import HomeCardWeather from "./HomeCard/HomeCardWeather/HomeCardWeather.jsx";
import HomeFooter from "./HomeFooter/HomeFooter.jsx";

export const AUTH = {
    NONE: 0,
    LOGIN: 1,
    MAILA2F: 2,
    REGISTER: 3,
};


export default function Home() {

    const [showLog, setShowLog] = useState(AUTH.NONE);

    const is_popup = showLog === AUTH.NONE ? "hidden" : "visible";


    const home_handler = async (event) => {

		//sorry idk where to put this, but here that worked
		//const cards = document.querySelectorAll('.card-effect');
		//cards.forEach(card => {
		//	const tiltLimit = 20;

		//	card.addEventListener('mousemove', (e) => {
		//		const rect = card.getBoundingClientRect();
		//		const x = e.clientX - rect.left;
		//		const y = e.clientY - rect.top;
		//		const xPercent = (x / rect.width) - 0.5;
		//		const yPercent = (y / rect.height) - 0.5;

		//		const rotateX = yPercent * -tiltLimit;
		//		const rotateY = xPercent * tiltLimit;

		//		card.style.transform = `
		//		rotateX(${rotateX}deg)
		//		rotateY(${rotateY}deg)
		//		scale3d(1.05, 1.05, 1.05)
		//		translateY(-3px)
		//		`;
		//	});

		//	// Reset rotation when mouse leaves
		//	card.addEventListener('mouseleave', () => {
		//		card.style.transform = `rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
		//	});
		//});


        if (event && event.target && event.target.closest('.PopUp-root')) {
            console.log("home_handler(1) need to connect")
            return;
        }

        const resCo = await checkCo();
        if (!resCo) {
            setShowLog(AUTH.LOGIN);
        } else {
            if (event && event.target && event.target.id === "HomeChatsubmit"){
                const form = event.target.form
                if (form) {
                    form.requestSubmit();
                }
                return
            }
        }
    };


    useEffect(() => {

        const home_root = document.getElementById("Home-root");
        if (!home_root) return;

        home_handler();

        home_root.addEventListener("click", home_handler);
        return () => home_root.removeEventListener("click", home_handler);

    }, []);



	const cards = [];
	const cards_content = [
		// { text:"Weather", path: "/Weather" },
		{ text:"Pas ouf Intra", path: "/https://profile.intra.42.fr" },
		{ text:"Private Message", path: "/PrivateMessage" },
		{ text:"Morpion", path: "/Morpion" },
		{ text:"Pong3D", path: "/Pong3D" },
		{ text:"Pond2D", path: "/Pond2D" },
		{ text:"Nothing", path: "/Nothing" },
		{ text:"Stats", path: "/Stats" },
		{ text:"Nothing", path: "/Nothing" },
	]

	cards.push( <HomeCardWeather key={0}/> )
	cards_content.forEach((el, index) => {
			cards.push( <HomeCard key={index + 1} path={el.path}>{el.text}</HomeCard> )
	})


	return (

		<div id={`Home-root`}>
			<div className="scanlines"></div>

            <div className={`${is_popup}`} >
                <div className={`${is_popup} Home-PopUp`} >
                    {showLog !== AUTH.NONE && <PopUp setShowLog={setShowLog} showLog={showLog}/>}
                </div>
            </div>

			<main className={`menu`}>
				<section className={`card-container`}>
					{cards}
				</section>
                <HomeChat/>
			</main>

			<HomeFooter setShowLog={setShowLog}/>

		</div>
	)
}

