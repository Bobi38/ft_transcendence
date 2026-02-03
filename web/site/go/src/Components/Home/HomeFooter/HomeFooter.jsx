/* Css */
import "./HomeFooter.css"
import "../../../index.css"

/* Components */
import { Link } from "react-router-dom"; 

export default function HomeFooter({grid_style}) {
    
    return (
        <>
            <div className={`${grid_style} HomeFooter-grid stretch`}>

                    <Link   to='/ContactUs'
                            className="HomeFooter1 Home-iconemargin iconecolor center">
                            Contact us
                    </Link>


                    <div className="HomeFooter2 center">
                        <p>8:42</p>
                    </div>
                    

                    <Link   to='/Profile'
                            className="HomeFooter3 Home-iconemargin iconecolor center">
                            Profile
                    </Link>

            </div>
        </>
    );
}