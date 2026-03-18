/* Css */
import "./NavBar.scss";

/* Components */
import Button from "FRONT/Component/Button/Button.jsx"

import useClock from "FRONT/hooks/useClock.jsx";

export default function NavBar() {
    
    const time = useClock();

    return (

        <>
            <nav className={`NavBar-root`}>

				<Button path={`/`}>
                    Home
				</Button>

                <p> {time} </p>
				
                <Button path={`/ContactUs`}>
					Contact
				</Button>

            </nav>
        </>

    );
    
}
