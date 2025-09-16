import React, { createContext, useState, useEffect } from 'react';
import * as authApi from '../api/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const loginUser = async (email, password) => {
    const res = await authApi.login(email, password);
    if (res.success) setUser(res.user);
    return res;
  };

  const registerUser = async (email, password) => {
    const res = await authApi.register(email, password);
    if (res.success) setUser(res.user);
    return res;
  };

  const logoutUser = async () => {
    await authApi.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, registerUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};
