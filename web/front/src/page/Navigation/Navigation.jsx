/* Css */
import "./Navigation.scss";

/* Components */
import NavBar from "../../Component/nav/NavBar/NavBar.jsx";


import checkCo from "/app/back/src/fct1.js"
	
import { useNavigate } from "react-router-dom";
import { Children } from "react";
    
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

                <NavBar/>{/* la taille */}
                
                <div className={"Navigation-renderScreenNav"}> {/* le reste */}

                    {children}
                    
                </div>
            
            </div>     

        </>
    );
}
