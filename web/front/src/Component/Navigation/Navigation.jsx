/* extern */
import { useNavigate, useLocation} from "react-router-dom";
/* back */
import checkCo from "TOOL/fonction_usefull.js"

/* Css */
import "./Navigation.scss";

/* Components */
import NavBar from "FRONT/Component/NavBar/NavBar.jsx";
import { useEffect } from "react";

export default function Navigation({ children }) {

    const navigate = useNavigate();
    const {pathname} = useLocation();
    // const { showLog, setShowLog } = useAuth();

    const connection_check = async () => {
        const res = await checkCo();
        if (!res && pathname != '/'){
            console.log('pathname:',pathname);
            navigate('/');
        }
    };

    useEffect(() => {
        connection_check();
    }, []);


    return (
		<main className={`Navigation-root`}>

			<div className={`children-container`}>
				{children}
			</div>

			<NavBar/>

		</main>
    );
}
