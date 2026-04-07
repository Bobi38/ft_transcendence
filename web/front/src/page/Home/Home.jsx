/* Css */
import "./Home.scss";

/* Components */
import HomeChat 			from	"./HomeChat/HomeChat.jsx";
import HomeCard 			from	"./HomeCard/HomeCard.jsx";
import HomeCardWeather 		from	"./HomeCard/HomeCardWeather/HomeCardWeather.jsx";


const cards_content = [
	{ text:"Pas ouf Intra", path: "/https://profile.intra.42.fr" },
	{ text:"Friends", path: "/PrivateMessage" },
	{ text:"Pong3D vs Player", path: "/Pong3D" },
	{ text:"Pong3D vs IA", path: "/Pong3DIa" },
	{ text:"Morpion", path: "/Morpion" },
	{ text:"Spec.", path: "/SpecMorpion" },
	{ text:"Stats", path: "/Stats" },
	{ text:"Contact Us", path: "/ContactUs" },
]

export default function Home() {

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
	);
}
