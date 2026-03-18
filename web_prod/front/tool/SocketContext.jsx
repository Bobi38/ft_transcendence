import { createContext, useContext, useEffect, useState } from "react";
import SocketM from "./SocketManag";

const SocketContext = createContext();

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!SocketM.getState() || SocketM.getState() === "closed") {
      SocketM.connect();
    }
    setSocket(SocketM);
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);