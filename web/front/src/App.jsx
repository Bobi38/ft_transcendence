/* extern */
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SocketM  from "../tool/SocketManag";
import { useEffect } from "react";
import checkCo from "BACK/fct1.js"

/* back */

/* Css */
import './style/index.scss'

/* Components */
import Navigation       from    "FRONT/Component/Navigation/Navigation.jsx";
  // ./src/page/
import Home             from    "FRONT/page/Home/Home.jsx";
import ContactUs        from    "FRONT/page/ContactUs/ContactUs.jsx";
import ErrorRedir       from    "FRONT/page/ErrorRedir/ErrorRedir.jsx";
import PrivateMessage   from    "FRONT/page/PrivateMessage/PrivateMessage.jsx";
import Profile          from    "FRONT/page/Profile/Profile.jsx";
import Stats            from    "FRONT/page/Stats/Stats.jsx";
import WaitRoom         from    "FRONT/page/WaitRoom/WaitRoom.jsx";
import Test             from    "./test.jsx";

  // ./src/page/game
import MorpionTraining  from    "FRONT/page/Game/Morpion/MorpionTraining.jsx";





export default function App() {

  useEffect(() => {
    const init = async () => {
            const repco = await checkCo();
            if (!repco) return;
    if (!SocketM.getState() || SocketM.getState() === "closed")
      SocketM.connect();
    console.log("App.jsx useEffect(1) SocketM.connect() called");
}
init();
    return () => {
      // SocketM.disco();
      // console.log("App.jsx useEffect(2) SocketM.disconnect() called");
    };
  }, []);
    //fait le check co a la place de home et envoyer le result

  return (
    <>
        <BrowserRouter>
          <Routes>


            {/* Home */}
            <Route path={`/`}                       element={<Home />} />


            {/* Navigation */}
            <Route path={`/ContactUs`}              element={<Navigation>   <ContactUs/>          </Navigation>}/>
            <Route path={`/Morpion`}                element={<Navigation>   <MorpionTraining/>    </Navigation>}/>
            <Route path={`/PrivateMessage`}         element={<Navigation>   <PrivateMessage/>     </Navigation>}/>
            <Route path={`/Profile`}                element={<Navigation>   <Profile/>            </Navigation>}/>
            <Route path={`/Stats`}                  element={<Navigation>   <Stats/>              </Navigation>}/>
            <Route path={`/WaitRoom`}               element={<Navigation>   <WaitRoom/>           </Navigation>}/>
            <Route path={`/Test`}                   element={<Test/>}/>


            {/* bad path */}
            <Route path={`/*`}                      element={<Navigation>   <ErrorRedir/>         </Navigation>} />


          </Routes>
        </BrowserRouter>
    </>
  );
}


