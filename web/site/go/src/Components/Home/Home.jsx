/* Css */
import "./Home.scss";

/* Components */
import HomeFooter from './HomeFooter/HomeFooter.jsx';
import HomeMessage from './HomeMessage/HomeMessage.jsx';
import HomeIcone from './HomeIcone/HomeIcone.jsx';
import HomeArrow from './HomeArrow/HomeArrow.jsx';
import Log from "./LogRegister/Jsx/Log.jsx"
import Register from "./LogRegister/Jsx/Register.jsx"
import Qrcode from "./LogRegister/Jsx/Qrcode.jsx"


import checkCo from "../../../../fct1.js"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AUTH = {
    NONE: 0,
    LOGIN: 1,
    QRCODE: 2,
    REGISTER: 3,
    MISSPSWD: 4,
};

export default function Home(){

    const [showLog, setShowLog] = useState(AUTH.NONE);
    // const [user, setUser] = useState(null);
    const navigate = useNavigate();


    // const fetchUserData = async () => {

    //     console.log("fetchUserData(1) called");
    //     try {
    //         const rep = await fetch("/api/user/profile");
    //         const repjson = await rep.json();
    //         if (repjson.success){

    //             console.log("fetchUserData(2) User data fetched successfully:", repjson.message);
    //             setUser(repjson.message);

    //         }else{

    //             console.error("fetchUserData(3) Error:", repjson.message);

    //         }
    //     } catch (error) {
    //         console.error("fetchUserData(4) Error", error);
    //     }

    // };

    useEffect(() => {

        const home_root = document.getElementById("home_root");
        if (!home_root) return;

        const Home_handler = async (event) => {

            if (event.target.closest('.LogRegister-flex1')) {
                console.log("Home_handler(1) need to connect")
                return;
            }
            const resCo = await checkCo();
            if (!resCo) {
                setShowLog(AUTH.LOGIN);
            } else {
                if (event.target.id === "HomeMessagesubmit"){
                    const form = event.target.form
                    if (form) {
                        form.requestSubmit();
                    }
                    return
                }
            }
        };

        home_root.addEventListener("click", Home_handler);
        return () => home_root.removeEventListener("click", Home_handler);

    }, []);

    const home_login = showLog === AUTH.NONE ? "hidden" : "visible";
    const home_css = "Home-iconedisplay Home-iconemargin iconecolor";

    return (
        <>
            <div className='Home-grid' id="home_root">

                <div id="home-login" className={`Home-pos full ${home_login}`} >

                    {showLog === AUTH.LOGIN && <Log setShowLog={setShowLog} />}
                    {showLog === AUTH.QRCODE && <Qrcode setShowLog={setShowLog} />}
                    {showLog === AUTH.REGISTER && <Register setShowLog={setShowLog} />}
                    {showLog === AUTH.MISSPSWD && <Psw setShowLog={setShowLog}/>}

                </div>
                <>
                    <HomeIcone      grid_style={`Home-div1 ${home_css}`}
                                    arg="/Weather"
                                    text="Weather"/>

                    <HomeIcone      grid_style={`Home-div2 ${home_css}`}
                                    // arg="/Intra"
                                    text="Intra"
                                    arg="https://profile.intra.42.fr"/>
                                    {/* // link={`https://profile.intra.42.fr/users/${user.login42}`}/> */}

                    <HomeIcone      grid_style="Home-div3 Home-iconedisplay Home-iconemargin iconecolor"
                                    arg="/WaitRoom"
                                    text="WaitRoom"
                                    />
                </>

                <>

                    <HomeIcone      grid_style={`Home-div4 ${home_css}`}
                                    arg="/Stats"
                                    text="Stats"
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
                                    // text="Nothing"
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
