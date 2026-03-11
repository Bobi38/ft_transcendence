/* extern */
import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/* back */
import checkCo from "../../../../tool/fct1.js"

/* Css */
import "./Pong3D.scss";

/* Components */
import { App as GameApp } from "FRONT/game/app.ts";
import useFetch from "HOOKS/useFetch.jsx";

export default function Pong3D() {

    
    const navigate = useNavigate();

    const canvasRef = useRef(null);

    useEffect(() => {
        let gameApp = null;

        const init = async () => {
            const isConnected = await checkCo();
            
            if (!isConnected) {
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
