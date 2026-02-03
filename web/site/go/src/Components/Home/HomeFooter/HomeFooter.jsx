/* Css */
import "./HomeFooter.css"
import "../../../index.css"

/* Components */
import { Link, useNavigate } from "react-router-dom"; 

export default function HomeFooter({grid_style}) {

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

                        <a href="">
                            Contact us
                        </a>

                    </Link>


                    <div className="HomeFooter2 center">
                        <p>8:42</p>
                    </div>
                    
                    <div className="HomeFooter2 center">
                        <button type="button" onClick={(LOGOUT)}>LOGOUT</button>
                    </div>

                    <Link   to='/Profile'
                            className="HomeFooter3 Home-iconemargin iconecolor center">

                        <a href="">
                            Profile
                        </a>

                    </Link>

            </div>
        </>
    );
}