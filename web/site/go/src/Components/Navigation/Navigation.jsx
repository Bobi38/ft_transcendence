/* Css */
import "./Navigation.css";

/* Components */
import NavBar from "./NavBar/NavBar.jsx";
import ContactUs from "./Page/ContactUs/ContactUs.jsx";
import Nothing from "./Page/Nothing/Nothing.jsx";
import Morpion from "./Page/Jeu/Morpion/Morpion.jsx";

    
export default function Navigation({ screen }) {

    const renderScreenNav = () => {
        switch(screen) {
            case 'ContactUs':
                return <ContactUs/>;
            case 'Morpion':
                return <Morpion/>;
            default:
                return <Nothing/>;
        }
    }
    
    return (
        <>
            <div className="full Navigation-grid" > 

                <NavBar grid_style="Navigation-div1"/>
                        
                <div className="full Navigation-div2" >{renderScreenNav()}</div>

            </div>
        </>
    );
}
