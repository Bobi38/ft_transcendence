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

export default function Pong3D() {

    const navigate = useNavigate();
    const canvasRef = useRef(null);
    const [isMobile,setIsMobile] = useState(false);

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

            if (canvasRef.current) {
                gameApp = new GameApp(canvasRef.current);
                gameApp.onUnauthorized = () => showAlert("Tu as deja une page ouverte sur Pong3D", "danger");
            }
        };

        init();

        return () => {
            gameApp?.dispose?.();
        };
    }, [canvasRef]);

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
