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


    async function  test(){

        console.log("fet tes game(1) called");
        try {
            const reponse = await fetch('/api/game/serv', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: "include"
            });

        } catch (error) {
            console.error("fet tes game(4) Error front:", error);
        }
    }
    
    return (
        <div className={`Pong3D-root`}>
            {test()}
            <canvas ref={canvasRef} />
        </div>
    )
}
