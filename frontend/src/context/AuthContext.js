import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);
const API_URL = process.env.REACT_APP_BACKEND_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('session_token'));
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    const storedToken = localStorage.getItem('session_token');
    
    if (storedToken) {
      try {
        const response = await axios.get(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${storedToken}` }
        });
        setUser(response.data);
        setToken(storedToken);
      } catch (error) {
        console.log('Sovereign session verification failed:', error);
        localStorage.removeItem('session_token');
        localStorage.removeItem('user');
        setUser(null);
        setToken(null);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const loginUser = (userData, sessionToken) => {
    setUser(userData);
    setToken(sessionToken);
    localStorage.setItem('session_token', sessionToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/api/auth/login`, { email, password });
    const { access_token, user: userData } = response.data;
    loginUser(userData, access_token);
    return userData;
  };

  const loginWithGoogle = async (credential) => {
    const response = await axios.post(`${API_URL}/api/auth/google`, { credential });
    const { access_token, user: userData } = response.data;
    loginUser(userData, access_token);
    return userData;
  };

  const register = async (name, email, password) => {
    const response = await axios.post(`${API_URL}/api/auth/register`, { name, email, password });
    const { access_token, user: userData } = response.data;
    loginUser(userData, access_token);
    return userData;
  };

  const logout = () => {
    // For sovereign JWT, we just clear local state
    setUser(null);
    setToken(null);
    localStorage.removeItem('session_token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, token, loginUser, login, loginWithGoogle, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
