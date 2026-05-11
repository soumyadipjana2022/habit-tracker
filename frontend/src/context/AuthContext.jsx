import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/client.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('habit_user');
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('habit_token');
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get('/auth/me')
      .then(({ data }) => {
        setUser(data.user);
        localStorage.setItem('habit_user', JSON.stringify(data.user));
      })
      .catch(() => {
        localStorage.removeItem('habit_token');
        localStorage.removeItem('habit_user');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const authenticate = async (path, payload) => {
    const { data } = await api.post(path, payload);
    localStorage.setItem('habit_token', data.token);
    localStorage.setItem('habit_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('habit_token');
    localStorage.removeItem('habit_user');
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      signup: (payload) => authenticate('/auth/signup', payload),
      login: (payload) => authenticate('/auth/login', payload),
      logout
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

