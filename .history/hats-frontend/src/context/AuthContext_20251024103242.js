import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authData, setAuthData] = useState(() => {
    const saved = localStorage.getItem('authData');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (authData) {
      localStorage.setItem('authData', JSON.stringify(authData));
      localStorage.setItem('token', authData.token);
    } else {
      localStorage.removeItem('authData');
      localStorage.removeItem('token');
    }
  }, [authData]);

  return <AuthContext.Provider value={{ authData, setAuthData }}>{children}</AuthContext.Provider>;
}
