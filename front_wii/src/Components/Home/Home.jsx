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
                    <HomeIcone grid_style="iconedisplay iconecolor div1" text="jeu"/>
                    <HomeIcone grid_style="iconedisplay iconecolor div2" text="intra" link="https://meta.intra.42.fr/clusters"/>
                    <HomeIcone grid_style="iconedisplay iconecolor div3" text="general message"/>      {/* on garde */}
                </>
                
                <>
                    <HomeIcone grid_style="iconedisplay iconecolor div4" />
                    <HomeIcone grid_style="iconedisplay iconecolor div5" text="weather"/>
                    <HomeIcone grid_style="iconedisplay iconecolor div6" text="private message"/>      {/* on garde */}
                </>

                <HomeArrow grid_style="iconedisplay div12"/>

                <>
                    <HomeIcone grid_style="iconedisplay iconecolor div7" text="stat"/>
                    <HomeIcone grid_style="iconedisplay iconecolor div8" />
                    <HomeIcone grid_style="iconedisplay iconecolor div9" text="contact friend"/>      {/* on garde */}
                </>


                <HomeMessage grid_style="iconedisplay iconecolor div10"/>
                
                <HomeFooter grid_style="div11"/>

            </div>
        </>
    )
}