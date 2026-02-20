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

export const AUTH = {
    NONE: 0,
    LOGIN: 1,
    QRCODE: 2,
    REGISTER: 3,
    PASSWORD_LOST: 4,
};

export default function Home(){

    const [showLog, setShowLog] = useState(AUTH.NONE);
    
    // const [user, setUser] = useState(null);
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

    const Home_handler = async (event) => {

        if (event.target.closest('.LogRegister-flex1')) {
            console.log("Home_handler(1) need to connect");
            return;
        }
        const resCo = await checkCo();
        if (!resCo) {
            setShowLog(AUTH.LOGIN);
        } else {
            if (event.target.id === "HomeMessagesubmit"){
                const form = event.target.form;
                if (form) {
                    form.requestSubmit();
                }
                return;
            }
        }
    };


    useEffect(() => {

        const home_root = document.getElementById("home_root");
        if (!home_root) return;

        home_root.addEventListener("click", Home_handler);
        return () => home_root.removeEventListener("click", Home_handler);

    }, []);

    const home_login = showLog === AUTH.NONE ? "hidden" : "visible";
    const css = "Home-iconedisplay Home-iconemargin iconecolor";

    return (
        <>
            <div className='Home-grid' id="home_root">
                
                <div id="home-login" className={`Home-pos full ${home_login}`} >
                    
                    {showLog === AUTH.LOGIN && <Log setShowLog={setShowLog} />}
                    {showLog === AUTH.QRCODE && <Qrcode setShowLog={setShowLog} />}
                    {showLog === AUTH.REGISTER && <Register setShowLog={setShowLog} />}
                    
                </div>
                <>
                    <HomeIcone      parent_style={`Home-div1 ${css}`}
                                    arg="/Weather"
                                    text="Weather"/>

                    <HomeIcone      parent_style={`Home-div2 ${css}`}
                                    text="Intra"
                                    arg="https://profile.intra.42.fr"/>
                                    {/*arg={`https://profile.intra.42.fr/users/${user.login42}`}/> */}

                    <HomeIcone      parent_style="Home-div3 Home-iconedisplay Home-iconemargin iconecolor"
                                    arg="/WaitRoom"
                                    text="WaitRoom"
                                    />
                </>

                <>

                    <HomeIcone      parent_style={`Home-div4 ${css}`}
                                    arg="/Stats"
                                    text="Stats"
                                    />

                    <HomeIcone      parent_style={`Home-div5 ${css}`}
                                    arg="/jeux"
                                    text="jeux"/>

                    <HomeIcone      parent_style={`Home-div6 ${css}`}
                                    arg="/PrivateMessage"
                                    text="Private Message"
                                    />

                </>

                    <HomeArrow      parent_style={`Home-div12 Home-iconedisplay`}/>

                <>
                    <HomeIcone      parent_style={`Home-div7 ${css}`}
                                    arg="/Nothing"
                                    // text="Nothing"
                                    />

                    <HomeIcone      parent_style={`Home-div8 ${css}`}
                                    arg="/Morpion"
                                    text="Mini-games"
                                    />

                    <HomeIcone      parent_style={`Home-div9 ${css}`} 
                                    arg="/Friends-List" 
                                    text="Friends-List"
                                    />

                </>


                <HomeMessage        parent_style={`Home-div10 ${css}`}/>
                
                <HomeFooter         parent_style={`Home-div11`}
                                    setShowLog={setShowLog}
                                    />

            </div>
        </>
    )
}
