import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/lib/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({ user: null, loading: true });
  const { login, logout, register, refreshToken } = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await refreshToken();
        setAuthState({ user, loading: false });
      } catch {
        setAuthState({ user: null, loading: false });
      }
    };
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ authState, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);