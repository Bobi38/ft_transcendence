/* Css */
import "./Home.css";

/* Components */
import HomeFooter from './HomeFooter/HomeFooter.jsx';
import HomeMessage from './HomeMessage/HomeMessage.jsx';
import HomeIcone from './HomeIcone/HomeIcone.jsx';
import HomeArrow from './HomeArrow/HomeArrow.jsx';
import Log from "./LogRegister/Jsx/Log.jsx"
import Register from "./LogRegister/Jsx/Register.jsx"

import checkCo from "../../../../fct1.js"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AUTH = {
    NONE: 0,
    LOGIN: 1,
    REGISTER: 2,
    LOGOUT: 3,
};

export default function Home(){

    const [showLog, setShowLog] = useState(AUTH.NONE);
    const navigate = useNavigate();
    
    useEffect(() => {

        const home_root = document.getElementById("home_root");

        if (!home_root) return;

        const handler = async (event) => {

            if (event.target.closest('.LogRegister-flex1')) {
                return;
            }

            event.preventDefault();

            const resCo = await checkCo();

            if (!resCo) {
                setShowLog(AUTH.LOGIN);

            } else {
            
                // console.log(event.target)

                const link = event.target.closest("a");
                if (link){
                    navigate(link.pathname);
                    return
                } 

                if (event.target.id === "HomeMessagesubmit"){
                    // console.log(event.target.id);

                    const form = event.target.form
                    if (form) {
                        // console.log(form);
                        form.requestSubmit();
                    }
                    return
                }
            }

        };

        home_root.addEventListener("click", handler);
        return () => home_root.removeEventListener("click", handler);

    }, []);

    const home_login = showLog === AUTH.NONE ? "hidden" : "visible";
    const home_css = "Home-iconedisplay Home-iconemargin iconecolor";

    return (
        <>
            <div className='Home-grid' id="home_root">
                
                <div id="home-login" className={`Home-pos full ${home_login}`} >
                    {showLog === AUTH.LOGIN && <Log setShowLog={setShowLog} />}
                    {showLog === AUTH.REGISTER && <Register setShowLog={setShowLog} />}
                </div>
                <>
                    <HomeIcone      grid_style={`Home-div1 ${home_css}`}
                                    arg="/Weather"
                                    text="Weather"/>

                    <HomeIcone      grid_style={`Home-div2 ${home_css}`}
                                    arg="/Intra"
                                    text="Intra"
                                    link="https://meta.intra.42.fr/clusters"/>

                    <HomeIcone      grid_style={`Home-div3 ${home_css}`}
                                    arg="/Nothing"
                                    />
                </>

                <>

                    <HomeIcone      grid_style={`Home-div4 ${home_css}`}
                                    arg="/Stat"
                                    text="Stat"
                                    />

                    <HomeIcone      grid_style={`Home-div5 ${home_css}`}
                                    arg="/jeux"
                                    text="jeux"/>

                    <HomeIcone      grid_style={`Home-div6 ${home_css}`}
                                    arg="/PrivateMessage"
                                    text="Private Message"
                                    />

                </>

                    <HomeArrow      grid_style={`Home-div12 Home-iconedisplay`}/>

                <>
                    <HomeIcone      grid_style={`Home-div7 ${home_css}`}
                                    arg="/Nothing"
                                    />

                    <HomeIcone      grid_style={`Home-div8 ${home_css}`}
                                    arg="/Morpion"
                                    text="Mini-games"
                                    />

                    <HomeIcone      grid_style={`Home-div9 ${home_css}`} 
                                    arg="/Friends-List" 
                                    text="Friends-List"
                                    />

                </>


                <HomeMessage        grid_style={`Home-div10 ${home_css}`}/>
                
                <HomeFooter         grid_style={`Home-div11`}
                                    setShowLog={setShowLog}
                                    />

            </div>
        </>
    )
}
