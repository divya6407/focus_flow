import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/auth';
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('ff_token'));
  const [loading, setLoading] = useState(!!localStorage.getItem('ff_token'));

  useEffect(() => {
    const storedToken = localStorage.getItem('ff_token');
    if (!storedToken) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // 5s timeout

    fetch(`${BASE_URL}/me`, {
      headers: { Authorization: `Bearer ${storedToken}` },
      signal: controller.signal,
    })
      .then(r => r.json())
      .then(data => {
        if (data.success) setUser(data.data);
        else {
          localStorage.removeItem('ff_token');
          setToken(null);
        }
      })
      .catch(() => {
        // On error or timeout, clear token so user sees login page
        localStorage.removeItem('ff_token');
        setToken(null);
      })
      .finally(() => {
        clearTimeout(timeout);
        setLoading(false);
      });

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      // Handle bad responses (400, 401, 500, etc.) safely
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        return { 
          success: false, 
          msg: errorData.msg || `Server error: ${res.status}` 
        };
      }

      const data = await res.json();
      if (data.success) {
        localStorage.setItem('ff_token', data.token);
        setToken(data.token);
        setUser(data.data);
      }
      return data;
    } catch (error) {
      console.error("Login failed:", error);
      return { success: false, msg: "Network error. Please try again." };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      // Handle bad responses safely
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        return { 
          success: false, 
          msg: errorData.msg || `Server error: ${res.status}` 
        };
      }

      const data = await res.json();
      if (data.success) {
        localStorage.setItem('ff_token', data.token);
        setToken(data.token);
        setUser(data.data);
      }
      return data;
    } catch (error) {
      console.error("Registration failed:", error);
      return { success: false, msg: "Network error. Please try again." };
    }
  };
  const logout = () => {
    localStorage.removeItem('ff_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
