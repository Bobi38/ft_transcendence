/* Css */
import "./Home.css";

/* Components */
import HomeFooter from './HomeFooter/HomeFooter.jsx';
import HomeMessage from './HomeMessage/HomeMessage.jsx';
import HomeIcone from './HomeIcone/HomeIcone.jsx';
import HomeArrow from './HomeArrow/HomeArrow.jsx';

export default function Home(){

    return (
        <>
            <div className='Home-grid'>
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
                                    arg="/Jeu"
                                    text="Jeu"
                                    />

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