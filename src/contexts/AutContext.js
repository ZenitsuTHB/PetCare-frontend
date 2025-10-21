import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as authApi from '../api/services/auth';

export const AuthContext = createContext();

const TOKEN_STORAGE_KEY = 'authToken';
const USER_STORAGE_KEY = 'authUser';

const storeAuthData = async (tokenValue, userValue) => {
  try {
    if (tokenValue) {
      await AsyncStorage.setItem(TOKEN_STORAGE_KEY, tokenValue);
    } else {
      await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
    }

    if (userValue) {
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userValue));
    } else {
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
    }
  } catch (error) {
    console.error('Error storing auth data:', error);
  }
};

const hydrateAuthState = async (setToken, setUser) => {
  try {
    const [storedToken, storedUser] = await Promise.all([
      AsyncStorage.getItem(TOKEN_STORAGE_KEY),
      AsyncStorage.getItem(USER_STORAGE_KEY),
    ]);

    if (storedToken) {
      setToken(storedToken);
    }

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (parseError) {
        console.error('Error parsing stored user:', parseError);
        await AsyncStorage.removeItem(USER_STORAGE_KEY);
      }
    }
  } catch (error) {
    console.error('Error hydrating auth state:', error);
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    hydrateAuthState(setToken, setUser);
  }, []);

  const loginUser = async (email, password) => {
    const res = await authApi.login({ email, password });

    if (res.success) {
      const tokenValue = res.token ?? res.data?.token ?? null;
      const resolvedUser = res.user || res.data?.user || res.data || null;

      setToken(tokenValue ?? null);
      setUser(resolvedUser ?? null);
      await storeAuthData(tokenValue, resolvedUser);
    }

    return res;
  };

  const registerUser = async (payload) => {
    const res = await authApi.register(payload);

    if (res.success) {
      const tokenValue = res.token ?? res.data?.token ?? null;
      const resolvedUser = res.user || res.data?.user || res.data || null;

      setToken(tokenValue ?? null);
      setUser(resolvedUser ?? null);
      await storeAuthData(tokenValue, resolvedUser);
    }

    return res;
  };

  const logoutUser = async () => {
    try {
      if (token) {
        await authApi.logout(token);
      }
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setUser(null);
      setToken(null);
      await storeAuthData(null, null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loginUser, registerUser, logoutUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
