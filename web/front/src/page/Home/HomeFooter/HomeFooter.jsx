/* extern */
import { Link, useNavigate } from "react-router-dom";

/* back */

/* Css */
import "./HomeFooter.scss"

/* Components */

export default function HomeFooter({setShowLog}) {

    const navigate = useNavigate();
    
    function logout() {
        console.log("logout(1) called")

        fetch('/api/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: "include"
        })
        .then(response => response.json())
        .then(data => {

            if (data.success) {
                setShowLog()
            } else {
                console.error("logout(2) failed");
            }

        })
        .catch(error => {
            console.error("logout(3) Error:", error);
        });
    }

    return (
        <>
            <div className={``}>

                    <Link   to={`/ContactUs`}
                            className={``}>
                            Contact us
                    </Link>


                    <div className={``}>

                        <div className={``}>
                            8:42
                        </div>

                        <button className={``}
                                onClick={(logout)}>
                                logout quand pas log on enleve
                        </button>

                    </div>

                    <Link   to={`/Profile`}
                            className={``}>
                            Profile
                    </Link>

            </div>
        </>
    );
}