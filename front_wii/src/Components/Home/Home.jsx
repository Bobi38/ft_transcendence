import HomeFooter from './HomeFooter/HomeFooter.jsx';
import HomeIconeDisplay from './HomeIconeDisplay/HomeIconeDisplay.jsx';
import HomeArrow from './HomeArrow/HomeArrow.jsx';

import "./Home.css";

export default function Home(){

    return (
        <>
            <div className='Homewii'>
                <HomeIconeDisplay />
                <HomeArrow/>
                <HomeFooter />
            </div>
        </>
    )
}