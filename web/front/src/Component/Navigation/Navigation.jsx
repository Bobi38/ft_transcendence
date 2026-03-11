/* extern */
import { useNavigate } from "react-router-dom";

/* back */
import checkCo from "../../../tool/fct1.js"

/* Css */
import "./Navigation.scss";

/* Components */
import NavBar from "FRONT/Component/NavBar/NavBar.jsx";

    
export default function Navigation({ children }) {
    
    const navigate = useNavigate();

    const connection_check = async () => {
        const res = await checkCo();
        if (!res){
            navigate('/');
        }
    };


    connection_check();


    return (
        <>
            <section className={`Navigation-root`}>

                <div className={`children-container`}>
                    {children}
                </div>
                
                <NavBar/>

            </section>
        </>
    );
}
