import HomeFooter from './HomeFooter/HomeFooter.jsx';
import HomeIconeDisplay from './HomeIconeDisplay/HomeIconeDisplay.jsx';
import HomeArrow from './HomeArrow/HomeArrow.jsx';
import Profil from '../Profil/Profil';
import { Routes, Route } from "react-router-dom";

import "./Home.css";

export default function Home(){

    return (
        <>
            <Route path="/Profil" element={<Profil />} />
            <div className='Homewii'>
                <HomeIconeDisplay />
                <HomeArrow/>
                <HomeFooter />
            </div>
        </>
    )
}