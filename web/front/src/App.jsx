/* extern */
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { SocketProvider } from "../tool/SocketContext"
import { useEffect, useState } from "react";
import checkCo from "BACK/fct1.js"

/* back */
import SocketM from "../tool/SocketManag";

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

// ./src/page/all_game
import MorpionTraining  from    "FRONT/page/all_game/Morpion/MorpionTraining.jsx";
import Pong3D           from    "FRONT/page/all_game/Pong3D/Pong3D.jsx";
import Morpion          from    "FRONT/page/all_game/Morpion/Morpion.jsx";





export default function App() {

    useEffect(() => {
        const init = async () => {
            const repco = await checkCo();
            if (!repco)
                return;
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
      {/* <SocketProvider> */}
        <BrowserRouter>
          <Routes>


            {/* Home */}
            <Route path={`/`}                       element={<Home />} />


            {/* Navigation */}
            <Route path={`/ContactUs`}              element={<Navigation>   <ContactUs/>          </Navigation>}/>
            <Route path={`/MorpionTraining`}        element={<Navigation>   <MorpionTraining/>    </Navigation>}/>
            <Route path={`/PrivateMessage`}         element={<Navigation>   <PrivateMessage/>     </Navigation>}/>
            <Route path={`/Profile`}                element={<Navigation>   <Profile/>            </Navigation>}/>
            <Route path={`/Stats`}                  element={<Navigation>   <Stats/>              </Navigation>}/>
            <Route path={`/Morpion`}                element={<Navigation>   <Morpion/>            </Navigation>}/>


            {/* bad path */}
            <Route path={`/*`}                      element={<Navigation>   <ErrorRedir/>         </Navigation>} />


          </Routes>
        </BrowserRouter>
      {/* </SocketProvider> */}
    </>
  );
}


