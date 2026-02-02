import "./HomeIconeDisplay.css";
import HomeIcone from './HomeIcone/HomeIcone.jsx';
import Homemessage from "./Homemessage/Homemessage.jsx";    

export default function HomeIconeDisplay() {

    return (
        <div className="grid_display grid_row_columns">
                <HomeIcone link="https://open.spotify.com/"
                />
                <HomeIcone text="intra" link="https://meta.intra.42.fr/clusters"/>
                <HomeIcone text="weather"/>
                <HomeIcone text="general message"/>      {/* on garde */}
 
                <HomeIcone text="jeu"/>
                <HomeIcone text="stat"/>
                <HomeIcone />
                <HomeIcone text="private message"/>      {/* on garde */}
                <Homemessage/>
                <HomeIcone />
                <HomeIcone />
                <HomeIcone />
                <HomeIcone text="contact friend"/>      {/* on garde */}

        </div>
    )

}
