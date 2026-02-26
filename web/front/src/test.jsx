import { useRef, useEffect } from "react";
import { App as GameApp } from "./game/app.ts";

export default function Test() {
    console.log("ocuocu");
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const gameApp = new GameApp(canvasRef.current);

    return () => {
      if (gameApp.dispose) gameApp.dispose?.();
    };
  }, []);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100vh" }} />;
}