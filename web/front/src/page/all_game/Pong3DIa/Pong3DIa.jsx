/* extern */
import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/* back */
import checkCo from "TOOL/fonction_usefull.js"

/* Css */
import "./Pong3DIa.scss";

/* Components */
import { App as GameApp } from "FRONT/gameVsIa/app.ts";
import Button from "FRONT/Component/Button/Button.jsx"
import useFetch from "HOOKS/useFetch.jsx";

export default function Pong3DIa() {


    const navigate = useNavigate();

    const canvasRef = useRef(null);

    useEffect(() => {
        if (canvasRef.current == null)
            return ;

        let gameApp = null;

        const init = async () => {
            const isConnected = await checkCo();
            if (!isConnected.success) {
                navigate('/');
                return;
            }

            if (canvasRef.current) {
                gameApp = new GameApp(canvasRef.current);
            }
        };

        init();

        return () => {
            gameApp?.dispose?.();
        };
    }, [canvasRef]);

    return (
        <main className={`Pong3DIa-root`}>
			<a href="/" className="button">Huome</a>
            <canvas ref={canvasRef} />
        </main>
    )
}
