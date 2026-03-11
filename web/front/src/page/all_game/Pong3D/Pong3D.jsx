/* extern */
import { useRef, useEffect, useState } from "react";

/* back */

/* Css */
import "./Pong3D.scss";

/* Components */
import { App as GameApp } from "FRONT/game/app.ts";
import useFetch from "HOOKS/useFetch.jsx";


    
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


    // async function namefct(){

    //     const url = `/api/game/serv`;

    //     console.log(`${url}`)

    //     const repjson = await useFetch(`${url}`, {
    //             method: 'GET',
    //             headers: { 'Content-Type': 'application/json' },
    //             credentials: "include"
    //     });
    //     if (!repjson)
    //         return;
    // }

    // namefct();

    return (
        <div className={`Pong3D-root`}>
            <canvas ref={canvasRef} />
        </div>
    )
}
