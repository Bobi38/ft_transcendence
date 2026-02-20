/* Css */
import "./Navigation.scss";

/* Components */
import NavBar from "./NavBar/NavBar.jsx";

import ContactUs from "/app/front/src/page/Navigation/Page/ContactUs/ContactUs.jsx";
import ErrorRedir from "/app/front/src/page/Navigation/Page/ErrorRedir/ErrorRedir.jsx";
import MorpionTraining from "/app/front/src/page/Navigation/Page/Game/Morpion/MorpionTraining.jsx";
import Morpion from "/app/front/src/page/Navigation/Page/Game/Morpion/Morpion.jsx";
import Profile from "/app/front/src/page/Navigation/Page/Profile/Profile.jsx";
import Stats from "/app/front/src/page/Navigation/Page/Stats/Stats.jsx";
import WaitRoom from "/app/front/src/page/Navigation/Page/WaitRoom/WaitRoom.jsx";
import PrivateMessage from "/app/front/src/page/Navigation/Page/PrivateMessage/PrivateMessage.jsx";

import checkCo from "/app/back/src/fct1.js"
	
import { useNavigate } from "react-router-dom";
    
export default function Navigation({ screen }) {

    const navigate = useNavigate();


    const connectioncheck = async () => {
        if (screen == "ErrorRedir"){
            return // 
        }

        const res = await checkCo();
        if (!res){
            navigate('/');
        }
    };

    const renderScreenNav = () => {

        connectioncheck();

        switch(screen) {
            case 'ContactUs':
                return <ContactUs/>;//
            case 'ErrorRedir':
                return <ErrorRedir/>;//
            case 'Morpion':
                return <Morpion/>;
            case 'MorpionTraining':
                return <MorpionTraining/>;
            case 'Profile':
                return <Profile/>;//
            case 'PrivateMessage':
                return <PrivateMessage/>;//
            case 'Stats':
                return <Stats/>;// 50% mais on att de la data du morpion 
            case 'WaitRoom':
                return <WaitRoom/>;
        }
    }
    
    return (
        <>

            <div className="Navigation-root"> {/* 100vh */}

                <NavBar/>{/* la taille */}
                
                <div className={"Navigation-renderScreenNav"}> {/* le reste */}

                    {renderScreenNav()}
                    
                </div>
            
            </div>     

        </>
    );
}
