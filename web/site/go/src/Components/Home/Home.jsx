/* Css */
import "./Home.css";

/* Components */
import HomeFooter from './HomeFooter/HomeFooter.jsx';
import HomeMessage from './HomeMessage/HomeMessage.jsx';
import HomeIcone from './HomeIcone/HomeIcone.jsx';
import HomeArrow from './HomeArrow/HomeArrow.jsx';
import Log from "../LogRegister/Jsx/Log.jsx"

import checkCo from "../../../../fct1.js"
import { useEffect } from "react";
import { useNavigate} from "react-router-dom";

export default function Home(){
    const navigate = useNavigate();
    useEffect(() => {
        const el = document.getElementById("OUIOUI");
        if (!el) return;

        const handler = async () => {
            
            const resCo = await checkCo();
            if (resCo) {
                console.log("coooooooooooooooooooo");
            }else {
                el.appendChild(<Log/>)
                // navigate("/");
            }
            console.log("FVAFB");
        };

        el.addEventListener("click", handler);

        return () => {
            el.removeEventListener("click", handler);
        };
    }, []);

    return (
        <>
            <div className='Home-grid' id="OUIOUI">
                
                <>
                    <HomeIcone      grid_style="Home-div1 Home-iconedisplay Home-iconemargin iconecolor"
                                    arg="/Weather"
                                    text="Weather"/>

                    <HomeIcone      grid_style="Home-div2 Home-iconedisplay Home-iconemargin iconecolor"
                                    arg="/Intra"
                                    text="Intra"
                                    link="https://meta.intra.42.fr/clusters"/>

                    <HomeIcone      grid_style="Home-div3 Home-iconedisplay Home-iconemargin iconecolor"
                                    arg="/Nothing"
                                    />
                </>

                <>
                    <HomeIcone      grid_style="Home-div4 Home-iconedisplay Home-iconemargin iconecolor"
                                    arg="/Stat"
                                    text="Stat"
                                    />

                    <HomeIcone      grid_style="Home-div5 Home-iconedisplay Home-iconemargin iconecolor"
                                    arg="/Morpion"
                                    text="Jeu de enfant"/>

                    <HomeIcone      grid_style="Home-div6 Home-iconedisplay Home-iconemargin iconecolor"
                                    arg="/PrivateMessage"
                                    text="Private Message"
                                    />

                </>

                    <HomeArrow      grid_style="Home-div12 Home-iconedisplay"/>

                <>
                    <HomeIcone      grid_style="Home-div7 Home-iconedisplay Home-iconemargin iconecolor"
                                    arg="/Nothing"
                                    />

                    <HomeIcone      grid_style="Home-div8 Home-iconedisplay Home-iconemargin iconecolor"
                                    arg="/Nothing"
                                    />

                    <HomeIcone      grid_style="Home-div9 Home-iconedisplay Home-iconemargin iconecolor" 
                                    arg="/ContactUs" text="contact friend"
                                    />

                </>


                <HomeMessage        grid_style="Home-div10 Home-iconedisplay Home-iconemargin iconecolor"/>
                
                <HomeFooter         grid_style="Home-div11"
                                    />

            </div>
        </>
    )
}
