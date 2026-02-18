/* Css */
import "./Navigation.css";

/* Components */
import NavBar from "./NavBar/NavBar.jsx";

import ContactUs from "./Page/ContactUs/ContactUs.jsx";
import ErrorRedir from "./Page/ErrorRedir/ErrorRedir.jsx";
import Morpion from "./Page/Game/Morpion/Morpion.jsx";
import Nothing from "./Page/Nothing/Nothing.jsx";
import Profile from "./Page/Profile/Profile.jsx";
import Stats from "./Page/Stats/Stats.jsx";
import WaitRoom from "./Page/WaitRoom/WaitRoom.jsx";
import PrivateMessage from "./Page/PrivateMessage/PrivateMessage.jsx";
import checkCo from "../../../../fct1.js"
import { useNavigate } from "react-router-dom";
    
export default function Navigation({ screen }) {

    const navigate = useNavigate();


    const titi = async () => {
        const res = await checkCo();
        if (!res){
            navigate('/');
        }
    };

    const renderScreenNav = () => {

        titi();

        switch(screen) {
            case 'ContactUs':
                return <ContactUs/>;
            case 'ErrorRedir':
                return <ErrorRedir/>;
            case 'Morpion':
                return <Morpion/>;
            case 'Profile':
                return <Profile/>;
            case 'PrivateMessage':
                return <PrivateMessage/>;
            case 'Stats':
                return <Stats/>;
            case 'WaitRoom':
                return <WaitRoom/>;
            default:
                return <Nothing/>;
        }
    }
    
    return (
        <>

            <div className="Navigation-root">

                <NavBar/>
                
                <div className={screen === "PrivateMessage" ? "Navigation-renderScreenNav-privatechat":"Navigation-renderScreenNav"}>

                    {renderScreenNav()}
                    
                </div>
            
            </div>     

        </>
    );
}
