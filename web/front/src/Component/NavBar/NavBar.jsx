/* extern */
import { useNavigate }      from    "react-router-dom";

/* Css */
import "./NavBar.scss";

/* Components */
import SocketM  			from	"TOOL/SocketManag.js";
import { AUTH, useAuth } 	from	"HOOKS/useAuth.jsx";
import useClock 			from	"HOOKS/useClock.jsx";
import Button 				from	"COMP/Button/Button.jsx";

export default function NavBar() {

    const { setShowLog } = useAuth();
    const navigate = useNavigate();

	function logout() {

	   fetch('/api/auth/session', {
	       method: 'DELETE',
	       headers: { 'Content-Type': 'application/json' },
	       credentials: "include"
	   })
	   .then(response => response.json())
	   .then(data => {

	       if (data.success) {
				sessionStorage.clear();
	        	setShowLog(AUTH.LOGIN);
	           SocketM.sendd('friend', {type: "logout"});
	        	SocketM.disconnect('friend');
	        	SocketM.disconnect('morp');
	        	SocketM.disconnect('priv');
	        	SocketM.disconnect('chat');
				navigate('/')
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

			<Button path={`/`}>Home</Button>

			<div className={`Navbar-center`}>
				<p>{time}</p>

				<button className={`logout`} onClick={(logout)}>
					Logout
				</button>

			</div>

			<Button path={`/Profile`}>Profile</Button>

		</nav>
    );
}
