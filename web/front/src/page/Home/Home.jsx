/* extern */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AUTH, useAuth } from "TOOL/AuthContext.jsx"

/* back */
import checkCo from "TOOL/fonction_usefull.js"

/* Css */
import "./Home.scss";

/* Components */
import PopUp from "./PopUp/PopUp.jsx"
import HomeChat from "./HomeChat/HomeChat.jsx";
import HomeCard from "./HomeCard/HomeCard.jsx";
import HomeCardWeather from "./HomeCard/HomeCardWeather/HomeCardWeather.jsx";
import HomeFooter from "./HomeFooter/HomeFooter.jsx";


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

export default function Home() {

    const { showLog, setShowLog } = useAuth();

    const is_popup = showLog === AUTH.NONE ? "hidden" : "visible";

    const home_handler = async (event) => {
        if (event && event.target && event.target.closest('.PopUp-root')) {
            console.log("home_handler(1) need to connect")
            return;
        }

        const resCo = await checkCo();
        if (!resCo) {
            setShowLog(AUTH.LOGIN);
        } else {
			setShowLog(AUTH.NONE);
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

	return (

		<div id={`Home-root`}>

            <div className={`${is_popup}`} >
                <div className={`${is_popup} Home-PopUp`} >
                    {showLog !== AUTH.NONE && <PopUp setShowLog={setShowLog} showLog={showLog}/>}
                </div>
            </div>

			<main className={`menu`}>
				<section className={`card-container`}>
					<HomeCardWeather />
					{cards_content.map((card, i) => (
						 <HomeCard key={i} path={card.path}>{card.text}</HomeCard>
					))}
				</section>
                <HomeChat/>
			</main>

			<HomeFooter setShowLog={setShowLog}/>

		</div>
	)
}

