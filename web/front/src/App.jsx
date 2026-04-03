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
import PrivacyPolicy    from "./Component/PP&ToS/Privacy_Policy.jsx";
import TermsOfService   from "./Component/PP&ToS/Terme_Security.jsx";

// ./src/page/all_game
import Pong3D           from    "FRONT/page/all_game/Pong3D/Pong3D.jsx";
import Pong3DIa         from    "FRONT/page/all_game/Pong3DIa/Pong3DIa.jsx";
import MorpionDisplay          from    "FRONT/page/all_game/MorpionDisplay/MorpionDisplay.jsx";


export default function App() {

    const { showLog, setShowLog } = useAuth();
    const [notif, setNotif] = useState(null);
    const { setShowFriend } = useFriend();

    console.log("App.jsx showLog:", import.meta.env.VITE_GOOGLE_ID_CLIENT);
    useEffect(() => {
        const init = async () => {

            const repco = await checkCo();

            if (!repco.success){
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
                setNotif({
                    message:`${data.login} vient de se connecter`,
                    type: "co",
                });
                setShowFriend(FRIEND.GREEN);
              }
              if (data.type == 'deco'){
                setNotif({
                    message:`${data.login} vient de se deconnecter`,
                    type: "deco",
                });
                setShowFriend(FRIEND.RED);
              }
            }

            const handle_msg_notif = (data) => {
                if (data.type == 'notif' && window.location.pathname !== "/PrivateMessage"){
                    setNotif({
                        message: `${data.login} vient de vous envoyer un message`,
                        type: "msg",
                    });
                }
            }
            SocketM.on("friend", handle_friend_co, "un");
            SocketM.on("priv", handle_msg_notif, "deux")
        }
        init();
        return () => {
          SocketM.off("friend", "un");
          SocketM.off("priv", "deux");
          // SocketM.disconnect("friend");
          // if (SocketM.socket)
          //   SocketM.disco();
          // console.log("App.jsx useEffect(2) SocketM.disconnect() called");
        };
    }, [showLog]);

    useEffect(() => {
        if (notif) {
            const timer = setTimeout(() => {
            setNotif(null);
        }, 1000); // 2 secondes

        return () => clearTimeout(timer); // cleanup si notif change vite
        }
    }, [notif]);
    //fait le check co a la place de home et envoyer le result

    return (
        <>
            {notif && (
                <div className={`global-notif ${notif.type}`}>
                    {notif.message}
                </div>
            )}
            {/* <div id={`alert-container`}></div> */}
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
                    <Route path={`/Pong3DIa`}       element={<Pong3DIa/>}/>
                    <Route path={`/terms`}          element={<TermsOfService/>}/>
                    <Route path={`/privacy`}        element={<PrivacyPolicy/>}/>

                    {/* bad path */}
                    <Route path={`/*`}              element={<Navigation> <ErrorRedir/>     </Navigation>} />

                </Routes>
            </BrowserRouter>
        </>
    );
}


