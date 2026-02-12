/* Css */
import "./Navigation.css";

/* Components */
import NavBar from "./NavBar/NavBar.jsx";

import ContactUs from "./Page/ContactUs/ContactUs.jsx";
import Morpion from "./Page/Game/Morpion/Morpion.jsx";
import WaitRoom from "./Page/WaitRoom/WaitRoom.jsx";
    
export default function Navigation({ screen }) {

    const renderScreenNav = () => {
        
        console.log("rendering screen nav with screen: ", screen);

        switch(screen) {
            case 'ContactUs':
                return <ContactUs/>;
            case 'Morpion':
                return <Morpion/>;
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
