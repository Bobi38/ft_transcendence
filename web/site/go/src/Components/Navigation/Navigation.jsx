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
    
export default function Navigation({ screen }) {

    const renderScreenNav = () => {
        
        console.log("rendering screen nav with screen: ", screen);

        switch(screen) {
            case 'ContactUs':
                return <ContactUs/>;
            case 'ErrorRedir':
                return <ErrorRedir/>;
            case 'Morpion':
                return <Morpion/>;
            case 'Profile':
                return <Profile/>;
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

            <div className="full Navigation-root">

                <NavBar grid_style="Navigation-nav"/>
                
                <div className={`Navigation-renderScreenNav`}>

                    {renderScreenNav()}
                    
                </div>
            
            </div>     

        </>
    );
}
