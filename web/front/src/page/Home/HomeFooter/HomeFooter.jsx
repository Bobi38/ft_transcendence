/* Css */
import "./HomeFooter.scss"

/* Components */
import { Link, useNavigate } from "react-router-dom";

export default function HomeFooter({ grid_id }) {

    const navigate = useNavigate();
    function LOGOUT() {

        console.log("oui")

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
            <div className={`${grid_id} HomeFooter-grid`}>

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
                                LOGOUT quand pas log on enleve
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