/* Css */
import "../../../index.css";
import "./NavBar.css";

/* Components */
import { Link } from "react-router-dom"; 

export default function NavBar({ grid_style }) { 
    return (
        <>
            <div className={`${grid_style} NavBar-grid`}>
                
                <Link to="/" className="NavBar-div1 NavBar-button iconecolor">
                    Home
                </Link>
                
                <Link to="/oui" className="NavBar-div2 NavBar-button iconecolor">
                    Oui
                </Link>
                
                <Link to="/contact" className="NavBar-div3 NavBar-button iconecolor">
                    Contact
                </Link>

            </div>
        </>
    )
}