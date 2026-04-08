/* extern */
import { useNavigate, useLocation}      from    "react-router-dom";
import { useEffect, useRef }            from    "react";

/* Css */
import "./Navigation.scss";

/* Components */
import checkCo                          from    "TOOL/fonction_usefull.js";
import { AUTH, useAuth }                from    "HOOKS/useAuth.jsx";
import NavBar                           from    "COMP/NavBar/NavBar.jsx";
import PopUp                            from    "./PopUp/PopUp.jsx";

export default function Navigation({ children }) {

    const navigate = useNavigate();
    const {pathname} = useLocation();
    const refNavigationRoot = useRef(null);
    const { showLog, setShowLog } = useAuth();


    const is_popup = showLog === AUTH.NONE ? "hidden" : "visible";
    useEffect(() => {

        const connection_check = async () => {
            const res = await checkCo();
            if (!res.success && !res.MPFA && pathname !== '/'){
                navigate('/');
            }
        };

        connection_check();
    }, []);

    let showLogRef;

    useEffect(() => {
        showLogRef = showLog;
    }, [showLog]);
    console.log("connection_handler called with event:", event);

    const connection_handler = async (event) => {
        const sho = showLogRef;
        if (event && event.target && event.target.closest('.PopUp-root')) {
            console.log("connection_handler(1) need to connect")
            return;
        }
        if (sessionStorage.getItem("CodeInput") == "true" || sessionStorage.getItem("CodeInput") == "false"){
            if (sho != AUTH.PASSFORGET) setShowLog(AUTH.PASSFORGET);
            return;
        }
        const resCo = await checkCo();
        console.log("connection_handler(2) resCo: ",resCo)
        console.log("connection_handler(3) resCo:", resCo.success + " " + resCo.MPFA);
        if (!resCo.success && !resCo.MPFA) {
            if (sho !== AUTH.LOGIN) setShowLog(AUTH.LOGIN);
            sessionStorage.clear();
            return ;
        } else if (!resCo.success && resCo.MPFA === true) {
            console.log("in MPFA");
            if (sho !== AUTH.MAILA2F) setShowLog(AUTH.MAILA2F);
            sessionStorage.clear();
            return ;
        } else{
            if (sessionStorage.getItem("type") === null)
                sessionStorage.setItem('type', "success");
            if (sessionStorage.getItem("message") === null)
                sessionStorage.setItem('message', "Connexion réussie");
            if (sessionStorage.getItem("token") === null)
                sessionStorage.setItem('token', resCo.token);
            if (sessionStorage.getItem("username") === null)
                sessionStorage.setItem('username', resCo.username);
            if (sho !== AUTH.NONE) setShowLog(AUTH.NONE);
            if (event && event.target && event.target.id === "HomeChatsubmit"){
                const form = event.target.form
                if (form) {
                    form.requestSubmit();
                }
                return
            }
        }
    };


    useEffect(() => {
        if (!refNavigationRoot.current) return;

        connection_handler();

    }, [showLogRef, refNavigationRoot.current]);

    return (
		<main ref={refNavigationRoot} className={`Navigation-root`}>

            <div className={`${is_popup}`} >
                <div className={`${is_popup} Navigation-PopUp`} >
                    {showLog !== AUTH.NONE && <PopUp/>}
                </div>
            </div>

			<div className={`children-container`}>
				{children}
			</div>

			<NavBar/>
		</main>
    );
}
