/* Css */
import "FRONT/page/Home/Home.scss";


/* Components */
import PopUp from "./PopUp/PopUp.jsx"
import HomeChat from "./HomeChat/HomeChat.jsx";
import HomeCard from "./HomeCard/HomeCard.jsx";

    /* other */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";



/* back */
import checkCo from "BACK/fct1.js"



export const AUTH = {
    NONE: 0,
    LOGIN: 1,
    MAILA2F: 2,
    REGISTER: 3,
};


export default function Home() {

    
    const [showLog, setShowLog] = useState(AUTH.NONE);
    const navigate = useNavigate();
    
    const is_popup = showLog === AUTH.NONE ? "hidden" : "visible";
    


    const Home_handler = async (event) => {

        if (event.target.closest('#PopUp')) {
            console.log("Home_handler(1) need to connect")
            return;
        }

        const resCo = await checkCo();
        if (!resCo) {
            setShowLog(AUTH.LOGIN);
        } else {
            if (event.target.id === "HomeChatsubmit"){
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

        Home_handler();

        home_root.addEventListener("click", Home_handler);
        return () => home_root.removeEventListener("click", Home_handler);

    }, []);












	const cards = [];
	const cards_content = [
		{ text:"Weather", path: "/Weather" },
		{ text:"Intra", path: "/https://profile.intra.42.fr" },
		{ text:"WaitRoom", path: "/WaitRoom" },
		{ text:"Stats", path: "/Stats" },
		{ text:"Game", path: "/Game" },
		{ text:"PrivateMessage", path: "/PrivateMessage" },
		{ text:"Nothing", path: "/Nothing" },
		{ text:"Morpion", path: "/Morpion" },
		{ text:"Friends", path: "/FriendsList" },
	]

	cards_content.forEach((el, index) => {
		cards.push( <HomeCard key={index} path={el.path}>{el.text}</HomeCard> )
	})

    

	return (

		<section id="Home-root">

            <div className={`Home-PopUp ${is_popup}`} >

                {showLog !== AUTH.NONE && <PopUp setShowLog={setShowLog} showLog={showLog}/>}

            </div>

			<div className={`menu`}>

				<div className={`card-continer`}>
					{cards}
				</div>

                <HomeChat/>

			</div>

			<div className={`footer`}>

				im the footer

			</div>

		</section>
	)
}




// const [user, setUser] = useState(null);
// const fetchUserData = async () => {

//     console.log("fetchUserData(1) called");
//     try {
//         const rep = await fetch("/api/user/profile");
//         const repjson = await rep.json();
//         if (repjson.success){

//             console.log("fetchUserData(2) User data fetched successfully:", repjson.message);
//             setUser(repjson.message);

//         }else{

//             console.error("fetchUserData(3) Error:", repjson.message);

//         }
//     } catch (error) {
//         console.error("fetchUserData(4) Error", error);
//     }

// };