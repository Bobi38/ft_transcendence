/* extern */
import { useRef, useEffect, useState }    from    "react";
import { useNavigate }                     from    "react-router-dom";

/* Css */
import "./Pong3D.scss";

/* Components */
import Button                   from    "COMP/Button/Button.jsx"
import checkCo                  from    "TOOL/fonction_usefull.js"
import {showAlert}              from    "TOOL/fonction_usefull.js"
import { App as GameApp }       from    "FRONT/game/App.ts";

function isMobileDevice() {
    const hasCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const hasTouchPoints = navigator.maxTouchPoints > 0;
    const hasTouchEvents = 'ontouchstart' in window;
    return hasCoarsePointer || hasTouchPoints || hasTouchEvents;
}

export default function Pong3D({type}) {

    const navigate = useNavigate();
    const canvasRef = useRef(null);
    const [isMobile,setIsMobile] = useState(false);
    const [gameKey, setGameKey] = useState(0);

    useEffect(() => {
        if (canvasRef.current == null)
            return ;
        const bool = isMobileDevice();
        if (bool)
        {
            setIsMobile(bool)
            return;
        }
        let gameApp = null;


        const init = async () => {
            const isConnected = await checkCo();
            if (!isConnected.success) {
                navigate('/');
                return;
            }

            gameApp = new GameApp(canvasRef.current, type, () => { navigate('/') });
            gameApp.onUnauthorized = () => showAlert("You already are playing Pong3D", "danger");
            gameApp.onReload = () => setGameKey(prev => prev + 1);
        };

        init();
        return async () => {
            gameApp?.dispose?.();
            gameApp = null;
        };
    }, [canvasRef.current, gameKey]);

    return (
        <main className={`Pong3D-root`}>
            <Button path="/">Home</Button>
			{/* <a href="/" className="button">Home</a> */}
            {isMobile && (
                <div className="error-game">
                    <h1>Desktop Required</h1>
                    <p>Sorry! This game requires a keyboard and mouse to play.</p>
                    <p>Please visit us on a computer to join the match.</p>
                </div>
            )}
            <canvas ref={canvasRef} />
        </main>
    )
}
