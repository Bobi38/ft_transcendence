/* extern */
import { useRef, useEffect }    from    "react";
import { useNavigate }          from    "react-router-dom";

/* Css */
import "./Pong3D.scss";

/* Components */
import checkCo                  from    "TOOL/fonction_usefull.js"
import {showAlert}              from    "TOOL/fonction_usefull.js"
import { App as GameApp }       from    "FRONT/game/app.ts";

export default function Pong3D() {


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
                gameApp.onUnauthorized = () => showAlert("Tu as deja une page ouverte sur Pong3D", "danger");
            }
        };

        init();

        return () => {
            console.log("testsaasdawd");
            gameApp?.dispose?.();
        };
    }, [canvasRef]);

    return (
        <main className={`Pong3D-root`}>
			<a href="/" className="button">Home</a>
            <canvas ref={canvasRef} />
        </main>
    )
}
