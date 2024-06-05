// src/hooks/useAuth.js
import { useState, useEffect, createContext, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({ isLoggedIn: false, isAdmin: false });

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      // Logic to verify token and extract user info
      // Replace with actual token verification logic
      const userInfo = { isLoggedIn: true, isAdmin: true, token }; // Example
      setUser(userInfo);
    }
  }, []);

  const login = (userInfo) => {
    setUser({ ...userInfo, isLoggedIn: true });
    sessionStorage.setItem('token', userInfo.token); // Assuming token is part of userInfo
  };

  const logout = () => {
    setUser({ isLoggedIn: false, isAdmin: false });
    sessionStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
