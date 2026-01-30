import HomeFooter from './HomeFooter/HomeFooter.jsx';
import HomeIconeDisplay from './HomeIconeDisplay/HomeIconeDisplay.jsx';
import HomeArrow from './HomeArrow/HomeArrow.jsx';
import { Outlet } from "react-router-dom";
import "./Home.css";

export default function Home(){

    return (
        <>
            <div className='Homewii'>
                <HomeIconeDisplay />
                <HomeArrow/>
                <HomeFooter />
                <Outlet/>
            </div>
        </>
    )
}