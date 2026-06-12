import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// 1. One Base URL to rule them all (points to /api)
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// 2. Derived endpoints to avoid variable clashing
const AUTH_URL = `${BASE_URL}/auth`;
const TASK_URL = `${BASE_URL}/task`;

const getToken = () => localStorage.getItem('ff_token');

const authHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`,
});

// ==========================================
// AUTHENTICATION PROVIDER
// ==========================================
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

    fetch(`${AUTH_URL}/me`, {
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
      const res = await fetch(`${AUTH_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

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
      const res = await fetch(`${AUTH_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

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

// ==========================================
// TASK API FUNCTIONS
// ==========================================
export const gettask = async () => {
    const res = await fetch(`${TASK_URL}`, { headers: authHeaders() });
    return res.json();
};

export const gettaskbyid = async (id) => {
    const res = await fetch(`${TASK_URL}/${id}`, { headers: authHeaders() });
    return res.json();
};

export const searchtask = async ({ priority, keyword }) => {
    const params = new URLSearchParams();
    if (priority) params.append("priority", priority);
    if (keyword) params.append("keyword", keyword);
    const res = await fetch(`${TASK_URL}/search?${params}`, { headers: authHeaders() });
    return res.json();
};

export const posttask = async (taskdata) => {
    const res = await fetch(`${TASK_URL}`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(taskdata),
    });
    return res.json();
};

export const updatetask = async (id, taskdata) => {
    const res = await fetch(`${TASK_URL}/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(taskdata),
    });
    return res.json();
};

export const deletetask = async (id) => {
    const res = await fetch(`${TASK_URL}/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
    });
    return res.json();
};
