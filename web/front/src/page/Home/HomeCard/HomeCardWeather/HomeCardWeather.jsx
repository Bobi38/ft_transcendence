/* extern */
import { useEffect, useState } from "react";

import { useAuth, AUTH } from "TOOL/AuthContext.jsx"

/* back */

/* Css */
import "./HomeCardWeather.scss";

/* Components */

export default function HomeCardWeather() {

	  const { showLog } = useAuth();

	const [weather, setWeather] = useState({
		icon: null,
		descript: null,
		title: null,
		temp: null,
	});
	useEffect(() => {
		async function fetchWeather() {
			try {
				const current = showLog;
				if (current != AUTH.NONE)
					return ;
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
	}, [showLog]);

	const [activeWeather, setActiveWeather] = useState({"": ""})

	useEffect(() => {

		setActiveWeather({
			backgroundImage: `url(${weather.icon})`,
		})
	}, [weather]);

    return (
		<button className={`HomeCard-root HomeCardWeather`}>
			<div className="background" style={activeWeather}></div>
			<span>{weather.descript}</span>
			<span>{weather.title}</span>
			<span>{weather.temp}</span>
		</button>
	)
}


