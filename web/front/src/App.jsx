/* extern */
import { BrowserRouter, Routes, Route } from "react-router-dom";

/* back */
// import checkCo from BACK/fct1.js

/* Css */
import './style/index.scss'

/* Components */
  // ./src/page/
import Home             from    "FRONT/page/Home/Home.jsx";
import Navigation       from    "FRONT/page/Navigation/Navigation.jsx";
import ContactUs        from    "FRONT/page/ContactUs/ContactUs.jsx";
import ErrorRedir       from    "FRONT/page/ErrorRedir/ErrorRedir.jsx";
import PrivateMessage   from    "FRONT/page/PrivateMessage/PrivateMessage.jsx";
import Profile          from    "FRONT/page/Profile/Profile.jsx";
import Stats            from    "FRONT/page/Stats/Stats.jsx";
import WaitRoom         from    "FRONT/page/WaitRoom/WaitRoom.jsx";

  // ./src/page/game
import MorpionTraining  from    "FRONT/page/Game/Morpion/MorpionTraining.jsx";




export default function App() {

    //fait le check co a la place de home et envoyer le result

  return (
    <>
        <BrowserRouter>
          <Routes>


            {/* Home */}
            <Route path="/"                       element={<Home />} />


            {/* Navigation */}
            <Route path="/ContactUs"              element={<Navigation>   <ContactUs/>          </Navigation>}/>
            <Route path="/MorpionTraining"        element={<Navigation>   <MorpionTraining/>    </Navigation>}/>
            <Route path="/PrivateMessage"         element={<Navigation>   <PrivateMessage/>     </Navigation>}/>
            <Route path="/Profile"                element={<Navigation>   <Profile/>            </Navigation>}/>
            <Route path="/Stats"                  element={<Navigation>   <Stats/>              </Navigation>}/>
            <Route path="/WaitRoom"               element={<Navigation>   <WaitRoom/>           </Navigation>}/>


            {/* bad path */}
            <Route path="/*"                      element={<Navigation>   <ErrorRedir/>         </Navigation>} />


          </Routes>
        </BrowserRouter>
    </>
  );
}