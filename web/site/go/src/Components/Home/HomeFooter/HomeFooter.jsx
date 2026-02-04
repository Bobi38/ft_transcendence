/* Css */
import "./HomeFooter.css"
import "../../../index.css"

/* Components */
import { Link, useNavigate } from "react-router-dom"; 
import AUTH from "../Home.jsx"

export default function HomeFooter({ grid_style, setShowLog }) {

    const navigate = useNavigate();
    function LOGOUT() {
        fetch('/api/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: "include"
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                navigate("/");
            } else {
                console.error("Logout failed");
            }
        })
        .catch(error => {
            console.error("Error during logout:", error);
        });
    }
    
    return (
        <>
            <div className={`${grid_style} HomeFooter-grid stretch`}>

                    <Link   to='/ContactUs'
                            className="HomeFooter1 Home-iconemargin iconecolor center">
                            Contact us
                    </Link>


                    <div className="HomeFooter2 center">
                        <div className="hidden-box-shadow iconecolor HomeFooter-padding ">
                            8:42
                        </div>
                        <div className="iconecolor HomeFooter-padding"
                             onClick={(LOGOUT)}>
                                LOGOUT
                        </div>
                    </div>
                    

                    <Link   to='/Profile'
                            className="HomeFooter3 Home-iconemargin iconecolor center">
                            Profile
                    </Link>

            </div>
        </>
    );
}