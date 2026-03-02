/* extern */
import { Link } from "react-router-dom";
import  SocketM  from "../../../../tool/SocketManag.js"

/* back */

/* Css */
import "./HomeFooter.scss"

/* Components */


import { AUTH } from "FRONT/page/Home/Home.jsx"

export default function HomeFooter({setShowLog}) {

    
    function logout() {
        console.log("logout(1) called")

        fetch('/api/auth/logout', {
            method: 'GET',//TODO TITOU post sans body?
            headers: { 'Content-Type': 'application/json' },
            credentials: "include"
        })
        .then(response => response.json())
        .then(data => {

            if (data.success) {
                setShowLog(AUTH.LOGIN)
                SocketM.disco();
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