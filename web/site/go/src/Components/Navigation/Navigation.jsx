/* Css */
import "./Navigation.css";

/* Components */
import NavBar from "./NavBar/NavBar.jsx";
import ContactUs from "./Page/ContactUs/ContactUs.jsx";
import Morpion from "./Page/Game/Morpion/Morpion.jsx";
import ErrorRedir from "./Page/ErrorRedir/ErrorRedir.jsx";
import Nothing from "./Page/Nothing/Nothing.jsx";

    
export default function Navigation({ screen }) {

    const renderScreenNav = () => {
        console.log("renderScreenNav: ", screen);
        switch(screen) {

            case 'ContactUs':
                return <ContactUs/>;
            case 'Morpion':
                return <Morpion/>;
            case'ErrorRedir':
            return <ErrorRedir/>;
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
