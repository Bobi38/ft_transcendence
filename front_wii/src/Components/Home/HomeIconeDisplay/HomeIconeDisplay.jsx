import "./HomeIconeDisplay.css";
import HomeIcone from './HomeIcone/HomeIcone.jsx';
import HomeMessage from "./HomeMessage/HomeMessage.jsx";    

export default function HomeIconeDisplay() {

    return (
        <div className="grid_display grid_row_columns">
                <HomeIcone text="jeu"/>
                <HomeIcone text="intra" link="https://meta.intra.42.fr/clusters"/>
                <HomeIcone text="general message"/>      {/* on garde */}
                <HomeIcone link="https://open.spotify.com/"/>
 
                <HomeIcone text="weather"/>
                <HomeIcone text="private message"/>      {/* on garde */}

                <HomeIcone text="stat"/>
                <HomeIcone />
                <HomeIcone text="contact friend"/>      {/* on garde */}
                <HomeMessage/>

        </div>
    )

}
