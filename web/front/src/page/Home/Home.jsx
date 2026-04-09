/* Css */
import "./Home.scss";

/* Components */
import HomeChat 			from	"./HomeChat/HomeChat.jsx";
import HomeCard 			from	"./HomeCard/HomeCard.jsx";
import HomeCardWeather 		from	"./HomeCard/HomeCardWeather/HomeCardWeather.jsx";

const cards_content = [
	{ text:"Terms and privacy", path: "/TermsAndPrivacy" },
	{ text:"Friends", path: "/PrivateMessage" },
	{ text:"Pong3D vs Player", path: "/Pong3D" },
	{ text:"Pong3D vs IA", path: "/Pong3DIa" },
	{ text:"Morpion", path: "/Morpion" },
	{ text:"Spectate", path: "/SpecMorpion" },
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
