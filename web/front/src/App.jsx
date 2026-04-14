/* extern */
import { BrowserRouter, Routes, Route } from    "react-router-dom";
import { useEffect, useState }          from    "react";

/* back */
import checkCo                          from    "TOOL/fonction_usefull.js"
import SocketM                          from    "TOOL/SocketManag";
import { FRIEND, useFriend }            from    "TOOL/FriendContext.jsx";
import { AUTH, useAuth }                from    "HOOKS/useAuth.jsx"

/* Css */
import './style/index.scss'

/* Components */
import Navigation                       from    "FRONT/Component/Navigation/Navigation.jsx";
// ./src/page/
import Home                             from    "FRONT/page/Home/Home.jsx";
import ContactUs                        from    "FRONT/page/ContactUs/ContactUs.jsx";
import ErrorRedir                       from    "FRONT/page/ErrorRedir/ErrorRedir.jsx";
import PrivateMessage                   from    "FRONT/page/PrivateMessage/PrivateMessage.jsx";
import Profile                          from    "FRONT/page/Profile/Profile.jsx";
import Stats                            from    "FRONT/page/Stats/Stats.jsx";
import TermsAndPrivacy                  from    "COMP/TermsAndPrivacy/TermsAndPrivacy.jsx";

// ./src/page/all_game
import Pong3D                           from    "FRONT/page/all_game/Pong3D/Pong3D.jsx";
import MorpionDisplay                   from    "FRONT/page/all_game/MorpionDisplay/MorpionDisplay.jsx";


export default function App() {

    const { showLog, setShowLog } = useAuth();
    const [notif, setNotif] = useState(null);
    const { setShowFriend } = useFriend();

    useEffect(() => {
				const logout = async () => {
					const handle_logout = (data) => {
						if (data.type == 'logout'){
							setShowLog(AUTH.LOGIN)
							SocketM.disconnect('friend');
							SocketM.disconnect('morp');
							SocketM.disconnect('priv');
							SocketM.disconnect('chat');
							sessionStorage.clear();
							window.location.href = '/';
						}
					}
					SocketM.on("friend", handle_logout, "logout");
				}
				logout();
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

            const handle_friend_co = (data) => {
              if (data.type == 'co'){
                setNotif({
                    message:`${data.login} just login`,
                    type: "co",
                });
                setShowFriend(FRIEND.GREEN);
              }
              if (data.type == 'deco'){
                setNotif({
                    message:`${data.login} just disconnect`,
                    type: "deco",
                });
                setShowFriend(FRIEND.RED);
              }
              if (data.type == 'add' && window.location.pathname !== "/Friends"){
                setNotif({
                    message:`${data.login} send friend request`,
                    type: "add",
                });
              }
            }

            const handle_msg_notif = (data) => {
                if (data.type == 'notif' && window.location.pathname !== "/PrivateMessage" && window.location.pathname !== "/Friends"){
                    setNotif({
                        message: `${data.login} send you a message`,
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
					SocketM.off("friend", "logout");
        };
    }, [showLog]);

    useEffect(() => {
        if (notif) {
            const timer = setTimeout(() => {
            setNotif(null);
        }, 2000); // 2 secondes

        return () => clearTimeout(timer);
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
            <BrowserRouter>
                <Routes>

                    {/* Home */}
                    <Route path={`/`}               	element={<Navigation> <Home />          </Navigation>} />
                    <Route path={`/ContactUs`}      	element={<Navigation> <ContactUs/>      </Navigation>}/>
                    <Route path={`/Friends`} 	element={<Navigation> <PrivateMessage/> </Navigation>}/>
                    <Route path={`/Profile`}        	element={<Navigation> <Profile/>        </Navigation>}/>
                    <Route path={`/Stats`}          	element={<Navigation> <Stats/>          </Navigation>}/>
                    <Route path={`/Morpion`}        	element={<Navigation> <MorpionDisplay isGame={true}/> </Navigation>}/>
                    <Route path={`/SpecMorpion`}    	element={<Navigation> <MorpionDisplay isGame={false}/> </Navigation>}/>

                    {/* type: false = vs player / true = vs ia */}
                    <Route path={`/Pong3D`}         	element={<Pong3D type={false}/>}/>
                    <Route path={`/Pong3DIa`}         	element={<Pong3D type={true}/>}/>
                    <Route path={`/TermsAndPrivacy`}	element={<TermsAndPrivacy/>}/>

                    {/* bad path */}
                    <Route path={`/*`}              element={<Navigation> <ErrorRedir/>     </Navigation>} />

                </Routes>
            </BrowserRouter>
        </>
    );
}


