/* Css */
import "./Navigation.css";

/* Nav */
import NavBar from "./NavBar/NavBar.jsx";

/* Page */
import ContactUs from "./Page/ContactUs/ContactUs.jsx";
import Nothing from "./Page/Nothing/Nothing.jsx";

    
export default function Navigation({changePage, screen}) {


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
            <NavBar changePage={changePage}/>
            {renderScreenNav()}
        </>
    );
}
