/* extern */
import { useEffect, useState } from "react";

/* back */

/* Css */
import "./HomeCardWeather.scss";

/* Components */

export default function HomeCardWeather() {

	const [weather, setWeather] = useState({
		icon: null,
		descript: null,
		title: null, 
		temp: null,
	});
	useEffect(() => {
		
		async function fetchWeather() {
			try {
				console.log("fetchWeather(1) called");
				const response = await fetch("/api/profile/Homeweather", {
					method: "GET",
					headers: {'Content-Type': 'application/json'},
					credentials: "include",
				});
				const data = await response.json();

				setWeather({
					icon: data.message.current.condition.icon,
					descript: `${data.message.current.condition.text}`,
					title: `${data.message.location.name}`,
					temp: `${data.message.current.temp_c}°C`,
				});

			} catch (err) {
				console.log("weather error", err);
			}
		}

		fetchWeather();
	}, []);
	
	const [activeWeather, setActiveWeather] = useState({"": ""})
	
	useEffect(() => {

		setActiveWeather({
			backgroundImage: `url(${weather.icon})`,
		})
	}, [weather]);
	
    return (
		<button className={`HomeCard-root HomeCardWeather`} style={activeWeather}>
				<p>
					<span>{weather.descript}</span><br/><br/>
					<span>{weather.title}</span><br/>
					<span>{weather.temp}</span>
				</p>
		</button>
	)
}


