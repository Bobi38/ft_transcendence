/* extern */
import { Link } from "react-router-dom";

/* back */

/* Css */
import "./HomeFooter.scss"

/* Components */
import Button from "FRONT/Component/Button/Button"

import { AUTH } from "FRONT/page/Home/Home.jsx"

export default function HomeFooter({setShowLog}) {

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
                setShowLog(AUTH.LOGIN)
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
            <div className={`HomeFooter-root`}>

				<Button path={`/ContactUs`}>
					Contact us
				</Button>

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