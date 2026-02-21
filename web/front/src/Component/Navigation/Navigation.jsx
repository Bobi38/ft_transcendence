/* extern */
import { useNavigate } from "react-router-dom";

/* back */
import checkCo from "BACK/fct1.js"

/* Css */
import "./Navigation.scss";

/* Components */
import NavBar from "FRONT/Component/NavBar/NavBar.jsx";

    
export default function Navigation({ children }) {

    
    
    const connection_check = async () => {
        if (screen == "ErrorRedir"){return}

        const res = await checkCo();
        if (!res){
            const navigate = useNavigate();
            navigate('/');
        }
    };

    connection_check();

    return (
        <>
            <div className="Navigation-root"> {/* 100vh */}

                <NavBar/>

                <div className={`children-container`}>

                    {children}

                </div>
            
            </div>
        </>
    );
}
