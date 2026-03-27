/* Css */
import "./NavBar.scss";

/* Components */
import Button from "FRONT/Component/Button/Button.jsx"
import useClock from "FRONT/hooks/useClock.jsx";

export default function NavBar() {

    const time = useClock();

    return (
		<nav className={`Navbar-root`}>

			<Button path={`/`}> Home </Button>

			<div className={`Navbar-center`}>
				<p>{time}</p>

				{/*onClick={(logout)}*/}
				<button className={`logout`}>
					Logout
				</button>
			</div>

			<Button path={`/ContactUs`}>Contact Us</Button>
		</nav>
    );
}
