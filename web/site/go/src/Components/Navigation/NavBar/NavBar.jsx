/* Css */
import "../../../index.css";
import "./NavBar.css";

/* Components */
import { Link } from "react-router-dom"; 

export default function NavBar({ grid_style }) { 
    return (
        <>
            <nav className={`${grid_style}`}>

                <div className="NavBar-display">
                    <Link to="/" className="NavBar-button iconecolor">
                        Home
                    </Link>
                    
                    <Link to="/oui" className="NavBar-button iconecolor">
                        Oui
                    </Link>
                    
                    <Link to="/contact" className="NavBar-button iconecolor">
                        Contact
                    </Link>
                </div>

            </nav>
        </>
    )
}
