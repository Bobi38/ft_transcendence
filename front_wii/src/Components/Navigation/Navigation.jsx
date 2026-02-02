/* Css */
import "./Navigation.css";

/* Nav */
import NavBar from "./NavBar/NavBar.jsx";

/* Page */
import ContactUs from "./Page/ContactUs/ContactUs.jsx";
import Nothing from "./Page/Nothing/Nothing.jsx";

    
export default function Navigation({screen}) {

    const renderScreenNav = () => {
        switch(screen) {
            case 'ContactUs':
                return <ContactUs/>;
            default:
                return <Nothing/>;
        }
    }
    
    return (
        <>
            <div className="full Navigation-grid" >

                <NavBar grid_style="Navigation-div1"/>
                        
                <div className="Navigation-div2" >{renderScreenNav()}</div>

            </div>
        </>
    );
}
