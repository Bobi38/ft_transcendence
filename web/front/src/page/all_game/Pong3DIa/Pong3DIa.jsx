/* extern */
import { useRef, useEffect }    from    "react";
import { useNavigate }          from    "react-router-dom";

/* Css */
import "./Pong3DIa.scss";

/* Components */
import checkCo                  from    "TOOL/fonction_usefull.js"
import { App as GameApp }       from    "FRONT/game/App.ts";

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
                gameApp = new GameApp(canvasRef.current, true);
            }
        };

        init();

        return () => {
            gameApp?.dispose?.();
        };
    }, [canvasRef.current]);

    return (
        <main className={`Pong3DIa-root`}>
			<a href="/" className="button">Huome</a>
            <canvas ref={canvasRef} />
        </main>
    )
}
