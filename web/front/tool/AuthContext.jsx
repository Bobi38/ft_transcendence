import { createContext, useContext, useState } from 'react';

export const AUTH = {
    NONE: 0,
    LOGIN: 1,
    MAILA2F: 2,
    REGISTER: 3,
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [showLog, setShowLog] = useState(AUTH.NONE);

  return (
    <AuthContext.Provider value={{ showLog, setShowLog }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);