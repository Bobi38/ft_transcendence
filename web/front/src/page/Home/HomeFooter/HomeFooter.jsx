/* extern */
import { Link } from "react-router-dom";
import  SocketM  from "TOOL/SocketManag.js"
import { useEffect, useState } from "react";

/* back */

/* Css */
import "./HomeFooter.scss"

/* Components */
import { AUTH } from "TOOL/AuthContext.jsx";
import Button from "FRONT/Component/Button/Button.jsx"
import useClock from "FRONT/hooks/useClock.jsx";


export default function HomeFooter({setShowLog}) {


    const username = sessionStorage.getItem('username');

    function logout() {
        console.log("logout(1) called")
        fetch('/api/auth/logout', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: "include"
        })
        .then(response => response.json())
        .then(data => {

            if (data.success) {
                setShowLog(AUTH.LOGIN)
                SocketM.disconnect('friend');
                SocketM.disconnect('morp');
                SocketM.disconnect('priv');
                SocketM.disconnect('chat');
            } else {
                console.error("logout(2) failed");
            }

        })
        .catch(error => {
            console.error("logout(3) Error:", error);
        });
    }


    const time = useClock();

    return (
        <>
            <nav className={`HomeFooter-root`}>

				<Button path={`/ContactUs`}>
					Contact us
				</Button>

                <div className={`HomeFooter-center`}>
                    {/* <p>{username}</p> */}
                    <p>{time}</p>
                    <button className={`logout`}onClick={(logout)}>
                        Logout
                    </button>

                </div>
                
				<Button path={`/Profile`}>
					Profile
				</Button>

            </nav>
        </>
    );
}