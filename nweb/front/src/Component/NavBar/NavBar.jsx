/* Css */
import "./NavBar.scss";

/* Components */
import { Link } from "react-router-dom";

export default function NavBar() {


    return (

        <>
            <nav className={`NavBar-container`}>

                <Link to="/" className={`Link`}>
                    Home
                </Link>


                <Link to="/ContactUs" className={`Link`}>
                    Contact
                </Link>
            </nav>
        </>

    );
    
}
