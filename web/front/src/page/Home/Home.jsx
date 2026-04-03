/* extern */
import { useEffect, useRef } from "react";
import { AUTH, useAuth } from "TOOL/AuthContext.jsx"

/* back */
import checkCo from "TOOL/fonction_usefull.js"

/* Css */
import "./Home.scss";

/* Components */
// import PopUp from "./PopUp/PopUp.jsx"
import HomeChat from "./HomeChat/HomeChat.jsx";
import HomeCard from "./HomeCard/HomeCard.jsx";
import HomeCardWeather from "./HomeCard/HomeCardWeather/HomeCardWeather.jsx";


const cards_content = [
	{ text:"Pas ouf Intra", path: "/https://profile.intra.42.fr" },
	{ text:"Private Message", path: "/PrivateMessage" },
	{ text:"Morpion", path: "/Morpion" },
	{ text:"Pong3D vs Player", path: "/Pong3D" },
	{ text:"Pong3D vs IA", path: "/Pong3DIa" },
	{ text:"Contact Us", path: "/ContactUs" },
	{ text:"Stats", path: "/Stats" },
	{ text:"Nothing", path: "/Nothing" },
]

export default function Home() {

    const { showLog, setShowLog } = useAuth();

    const is_popup = showLog === AUTH.NONE ? "hidden" : "visible";
    const showLogRef = useRef(showLog);

    useEffect(() => {
        showLogRef.current = showLog;
    }, [showLog]);

    const home_handler = async (event) => {
        const sho = showLogRef.current;
        if (event && event.target && event.target.closest('.PopUp-root')) {
            console.log("home_handler(1) need to connect")
            return;
        }
        if (sessionStorage.getItem("CodeInput") == "true" || sessionStorage.getItem("CodeInput") == "false"){
            if (sho != AUTH.PASSFORGET) setShowLog(AUTH.PASSFORGET);
            return;
        }
        const resCo = await checkCo();
        console.log(resCo.success + " " + resCo.MPFA);
        if (!resCo.success && !resCo.MPFA) {
            if (sho !== AUTH.LOGIN) setShowLog(AUTH.LOGIN);
            sessionStorage.clear();
            return ;
        } else if (!resCo.success && resCo.MPFA === true) {
            console.log("in MPFA");
            if (sho !== AUTH.MPFA) setShowLog(AUTH.MPFA);
            sessionStorage.clear();
            return ;
        } else{
            if (sessionStorage.getItem("type") === null)
                sessionStorage.setItem('type', "success");
            if (sessionStorage.getItem("message") === null)
                sessionStorage.setItem('message', "Connexion réussie");
            if (sessionStorage.getItem("token") === null)
                sessionStorage.setItem('token', resCo.token);
            if (sessionStorage.getItem("username") === null)
                sessionStorage.setItem('username', resCo.username);
            if (sho !== AUTH.NONE) setShowLog(AUTH.NONE);
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
        console.log("in use home");
        home_handler();
    }, []);

    useEffect(() => {

        const home_root = document.getElementById("Home-root");
        if (!home_root) return;

        // home_handler();
        // const rec = showLog
        // console.log("show in HOME " + rec);
        home_root.addEventListener("click", home_handler);
        return () => home_root.removeEventListener("click", home_handler);

    }, [showLog]);

	return (

		<div id={`Home-root`}>

			<div className={`menu`}>
				<div className={`card-container`}>
					<HomeCardWeather />
					{cards_content.map((card, i) => (
						 <HomeCard key={i} path={card.path}>{card.text}</HomeCard>
					))}
				</div>
                <HomeChat/>
			</div>
            
		</div>
	)
}

