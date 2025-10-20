import React, { createContext, useState } from 'react';
import * as authApi from '../api/services/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const loginUser = async (email, password) => {
    const res = await authApi.login({ email, password });

    if (res.success) {
      const tokenValue = res.token ?? res.data?.token ?? null;
      if (tokenValue) setToken(tokenValue);

      const resolvedUser = res.user || res.data?.user || res.data || null;
      if (resolvedUser) setUser(resolvedUser);
    }

    return res;
  };

  const registerUser = async (payload) => {
    const res = await authApi.register(payload);

    if (res.success) {
      const tokenValue = res.token ?? res.data?.token ?? null;
      if (tokenValue) setToken(tokenValue);

      if (res.user) setUser(res.user);
    }

    return res;
  };

  const logoutUser = async () => {
    await authApi.logout(token);
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loginUser, registerUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};
