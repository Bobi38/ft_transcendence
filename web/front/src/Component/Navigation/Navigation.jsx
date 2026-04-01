/* extern */
import { useNavigate, useLocation} from "react-router-dom";
import { useEffect } from "react";

/* back */
import checkCo from "TOOL/fonction_usefull.js"

/* Css */
import "./Navigation.scss";

/* Components */
import { AUTH, useAuth } from "TOOL/AuthContext.jsx"
import PopUp from "./PopUp/PopUp.jsx"
import NavBar from "FRONT/Component/NavBar/NavBar.jsx";

export default function Navigation({ children }) {

    const navigate = useNavigate();
    const {pathname} = useLocation();

    const connection_check = async () => {
        const res = await checkCo();
        if (!res.success && pathname !== '/'){
            navigate('/');
            // setShowLog(AUTH.LOGIN)
        }
    };

    useEffect(() => {
        connection_check();
    }, []);


    const { showLog, setShowLog } = useAuth();

    const is_popup = showLog === AUTH.NONE ? "hidden" : "visible";


    return (
		<main className={`Navigation-root`}>

            <div className={`${is_popup}`} >
                <div className={`${is_popup} Navigation-PopUp`} >
                    {showLog !== AUTH.NONE && <PopUp setShowLog={setShowLog} showLog={showLog}/>}
                </div>
            </div>

			<div className={`children-container`}>
				{children}
			</div>

			<NavBar/>

		</main>
    );
}
