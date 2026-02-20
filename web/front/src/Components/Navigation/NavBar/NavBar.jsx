/* Css */
import "../../../index.scss";
import "./NavBar.scss";

/* Components */
import { Link } from "react-router-dom";

export default function NavBar() {
    return (
        <>
            <nav className="NavBar-display">

                <Link to="/" className="NavBar-button iconecolor">
                    Home
                </Link>


                <Link to="/ContactUs" className="NavBar-button iconecolor">
                    Contact
                </Link>
            </nav>
        </>
    )
}
