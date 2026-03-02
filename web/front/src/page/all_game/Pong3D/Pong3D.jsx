/* extern */
import { useRef, useEffect, useState } from "react";

/* back */

/* Css */
import "./Pong3D.scss";

/* Components */
import { App as GameApp } from "FRONT/game/app.ts";


    
export default function Pong3D() {

    const canvasRef = useRef(null);

    useEffect(() => {
        if (!canvasRef.current)
            return;
        const gameApp = new GameApp(canvasRef.current);

        return () => {
            if (gameApp.dispose)
                gameApp.dispose?.();
        };
    }, []);
    
    return (
        <div className={`Pong3D-root`}>
            <canvas ref={canvasRef} />
        </div>
    )
}
