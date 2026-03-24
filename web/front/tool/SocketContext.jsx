import { createContext, useContext, useEffect } from 'react';
import { useAuth, AUTH } from './AuthContext';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { showLog } = useAuth();

  useEffect(() => {
    if (showLog !== AUTH.NONE) {
      SocketM.disconnect("chat");
      SocketM.disconnect("priv");
      SocketM.disconnect("friend");
      SocketM.disconnect("morp");
      return;
    }
    ["chat", "priv", "morp", "friend"].forEach(s => {
      if (!SocketM.getState(s) || SocketM.getState(s) === "closed")
        SocketM.connectsocket(s);
    });

    return () => {
      SocketM.disconnect("friend");
    };
  }, [showLog]);

  return (
    <SocketContext.Provider value={{}}>
      {children}
    </SocketContext.Provider>
  );
}