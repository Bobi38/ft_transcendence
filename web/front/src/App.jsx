/* extern */
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

/* back */
import SocketM from "TOOL/SocketManag";
import checkCo from "TOOL/fonction_usefull.js"
import { useAuth } from "TOOL/AuthContext.jsx"
import { FRIEND, useFriend } from "TOOL/FriendContext.jsx";

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

// ./src/page/all_game
import Pong3D           from    "FRONT/page/all_game/Pong3D/Pong3D.jsx";
import MorpionDisplay          from    "FRONT/page/all_game/MorpionDisplay/MorpionDisplay.jsx";


export default function App() {
  const [notif, setNotif] = useState(null);
  const { showLog } = useAuth();
  const { setShowFriend } = useFriend();

    useEffect(() => {
        const init = async () => {
            const repco = await checkCo();
            if (!repco){
                return;
            }
            if (!SocketM.getState("chat") || SocketM.getState("chat") === "closed")
                SocketM.connectsocket("chat");
            if (!SocketM.getState("priv") || SocketM.getState("priv") === "closed")
                SocketM.connectsocket("priv");
            if (!SocketM.getState("morp") || SocketM.getState("morp") === "closed")
                SocketM.connectsocket("morp");
            if (!SocketM.getState("friend") || SocketM.getState("friend") === "closed")
                SocketM.connectsocket("friend");
            console.log("App.jsx useEffect(1) SocketM.connect() called");

            const handle_friend_co = (data) => {
              console.log("friend HANDLE:");
              if (data.type == 'co'){
                setNotif(`${data.login} vient de se connecter`);
                setShowFriend(FRIEND.GREEN);
              }
              if (data.type == 'deco'){
                setNotif(`${data.login} vient de se DEconnecter`);
                setShowFriend(FRIEND.RED);
              }
              setTimeout(() => {
              setNotif(null);
              }, 3000);
            }
            SocketM.on("friend", handle_friend_co, "un");
        }
        init();
        return () => {
          SocketM.off("friend", "un");
          // SocketM.disconnect("friend");
          // if (SocketM.socket)
          //   SocketM.disco();
          // console.log("App.jsx useEffect(2) SocketM.disconnect() called");
        };
    }, [showLog]);
    //fait le check co a la place de home et envoyer le result

    return (
        <>
          {notif && (
          <div className="global-notif">
            {notif}
          </div>
          )}

            <BrowserRouter>
                <Routes>

                    {/* Home */}
                    <Route path={`/`}               element={<Navigation> <Home />          </Navigation>} />
                    <Route path={`/ContactUs`}      element={<Navigation> <ContactUs/>      </Navigation>}/>
                    <Route path={`/PrivateMessage`} element={<Navigation> <PrivateMessage/> </Navigation>}/>
                    <Route path={`/Profile`}        element={<Navigation> <Profile/>        </Navigation>}/>
                    <Route path={`/Stats`}          element={<Navigation> <Stats/>          </Navigation>}/>
                    <Route path={`/Morpion`}        element={<Navigation> <MorpionDisplay/> </Navigation>}/>
                    <Route path={`/Pong3D`}         element={<Pong3D/>}/>

                    {/* bad path */}
                    <Route path={`/*`}              element={<Navigation> <ErrorRedir/>     </Navigation>} />

                </Routes>
            </BrowserRouter>
        </>
    );
}


