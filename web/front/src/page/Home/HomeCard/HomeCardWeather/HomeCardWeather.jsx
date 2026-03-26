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

				// adapte selon ton backend
				setWeather({
					icon: data.message.current.condition.icon, // ex: "https://..."
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
			//backgroundSize: 'cover',
			// width: '100%',
			// height: '100%',
			// opacity: '100%',
			// display: "flex",
			// justifyContent: "center",
			// alignItems: "center",
		})
	}, [weather]);
	
    return (
		<button className={`HomeCardWeather-root card-effect`}
			style={activeWeather}>

			{/* {weather.icon && (
				<div style={{
					backgroundImage: `url(${weather.icon})`,
					backgroundSize: 'cover',
					width: '100%',
					height: '100%',
					opacity: '100%',
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}> */}
				<p>
					<span>{weather.descript}</span><br/><br/>
					<span>{weather.title}</span><br/>
					<span>{weather.temp}</span>
				</p>
		</button>
	)
}


