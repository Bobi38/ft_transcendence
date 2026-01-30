import HomeFooter from './HomeFooter/HomeFooter.jsx';
import HomeMessage from './HomeMessage/HomeMessage.jsx';
import HomeIcone from './HomeIcone/HomeIcone.jsx';
import HomeArrow from './HomeArrow/HomeArrow.jsx';

import "./Home.css";

export default function Home({changePage}){

    return (
        <>
            <div className='Homewii'>
                <>
                    <HomeIcone      grid_style="div1 iconedisplay iconecolor"
                                    changePage={changePage}
                                    arg="Home"
                                    text="weather"/>

                    <HomeIcone      grid_style="div2 iconedisplay iconecolor"
                                    changePage={changePage}
                                    arg="Home"
                                    text="intra"
                                    link="https://meta.intra.42.fr/clusters"/>

                    <HomeIcone      grid_style="div3 iconedisplay iconecolor"
                                    changePage={changePage}
                                    arg="Home"
                                    text="general message"/>
                </>
                
                <>
                    <HomeIcone      grid_style="div4 iconedisplay iconecolor"
                                    changePage={changePage}
                                    arg="Home"
                                    text="stat"
                                    />

                    <HomeIcone      grid_style="div5 iconedisplay iconecolor"
                                    changePage={changePage}
                                    arg="Home"
                                    text="jeu"
                                    />

                    <HomeIcone      grid_style="div6 iconedisplay iconecolor"
                                    changePage={changePage}
                                    arg="Home"
                                    text="private message"
                                    />

                </>

                    <HomeArrow      grid_style="div12 iconedisplay"/>

                <>
                    <HomeIcone      grid_style="div7 iconedisplay iconecolor"
                                    changePage={changePage}
                                    arg="Home"
                                    />

                    <HomeIcone      grid_style="div8 iconedisplay iconecolor"
                                    changePage={changePage}
                                    arg="Home"
                                    />

                    <HomeIcone      grid_style="div9 iconedisplay iconecolor" 
                                    changePage={changePage}
                                    arg="ContactUs" text="contact friend"
                                    />

                </>


                <HomeMessage        grid_style="div10 iconedisplay iconecolor"/>
                
                <HomeFooter         grid_style="div11" 
                                    changePage={changePage}
                                    />

            </div>
        </>
    )
}