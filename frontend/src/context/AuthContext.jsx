import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
    setLoading(false);

    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        const isAuthRoute = error.config?.url?.includes('/api/auth/login') || error.config?.url?.includes('/api/auth/register');
        if (error.response?.status === 401 && !isAuthRoute) {
          setUser(null);
          localStorage.removeItem('userInfo');
          localStorage.removeItem('cart');
          localStorage.removeItem('wishlist');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL || (window.location.hostname === 'localhost' || window.location.hostname.match(/^192\.168\./) ? `http://${window.location.hostname}:5000` : 'https://saasecommerce-production.up.railway.app')}/api/auth/login`, { email, password });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL || (window.location.hostname === 'localhost' || window.location.hostname.match(/^192\.168\./) ? `http://${window.location.hostname}:5000` : 'https://saasecommerce-production.up.railway.app')}/api/auth/register`, { name, email, password });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
    localStorage.removeItem('cart');
    localStorage.removeItem('wishlist');
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
