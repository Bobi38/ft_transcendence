/* Css */
import "./NavBar.scss";

/* Components */
import { AUTH, useAuth } from "TOOL/AuthContext.jsx"
import Button from "FRONT/Component/Button/Button.jsx"
import useClock from "FRONT/hooks/useClock.jsx";
import  SocketM  from "TOOL/SocketManag.js"

export default function NavBar() {

    const { showLog, setShowLog } = useAuth();

	const state = showLog;
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
				sessionStorage.clear();
	        	setShowLog(AUTH.LOGIN);
	           // SocketM.sendd('friend', {type: "logout"});
	        	SocketM.disconnect('friend');
	        	SocketM.disconnect('morp');
	        	SocketM.disconnect('priv');
	        	SocketM.disconnect('chat');
				window.location.href = '/'
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
		<nav className={`Navbar-root`}>

			<Button path={`/`}> Home </Button>
			{showLog === AUTH.NONE &&(
				<a href="/privacy" target="_blank" rel="noopener noreferrer">
                Politique de confidentialité
				</a>
			)}
			<div className={`Navbar-center`}>
				<p>{time}</p>

				
				<button className={`logout`} onClick={(logout)}>
					Logout
				</button>
				
			</div>
			{state === AUTH.NONE && (
				<a href="/terms" target="_blank" rel="noopener noreferrer">
                Conditions d'utilisation
				</a>
			)}
			<Button path={`/Profile`}>Profile</Button>
		</nav>
    );
}
