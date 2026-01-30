import HomeFooter from './HomeFooter/HomeFooter.jsx';
import HomeMessage from './HomeMessage/HomeMessage.jsx';
import HomeIcone from './HomeIcone/HomeIcone.jsx';
import HomeArrow from './HomeArrow/HomeArrow.jsx';

import "./Home.css";

export default function Home(){

    return (
        <>
            <div className='Homewii'>
                <>
                    <HomeIcone grid_style="div1 iconedisplay iconecolor" text="jeu"/>
                    <HomeIcone grid_style="div2 iconedisplay iconecolor" text="intra" link="https://meta.intra.42.fr/clusters"/>
                    <HomeIcone grid_style="div3 iconedisplay iconecolor" text="general message"/>      {/* on garde */}
                </>
                
                <>
                    <HomeIcone grid_style="div4 iconedisplay iconecolor" />
                    <HomeIcone grid_style="div5 iconedisplay iconecolor" text="weather"/>
                    <HomeIcone grid_style="div6 iconedisplay iconecolor" text="private message"/>      {/* on garde */}
                </>

                <HomeArrow grid_style="div12 iconedisplay"/>

                <>
                    <HomeIcone grid_style="div7 iconedisplay iconecolor" text="stat"/>
                    <HomeIcone grid_style="div8 iconedisplay iconecolor" />
                    <HomeIcone grid_style="div9 iconedisplay iconecolor" text="contact friend"/>      {/* on garde */}
                </>


                <HomeMessage grid_style="div10 iconedisplay iconecolor"/>
                
                <HomeFooter grid_style="div11"/>

            </div>
        </>
    )
}