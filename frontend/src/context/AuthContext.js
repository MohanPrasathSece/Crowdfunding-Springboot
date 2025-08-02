import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(token ? jwtDecode(token) : null);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const login = async (email, password) => {
    // ensure no stale auth header for login request
    delete axios.defaults.headers.common['Authorization'];
    try {
      console.log('Attempting to connect to backend at:', process.env.REACT_APP_API_URL);
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, { email, password }, { headers: {} });
      const t = res.data.token;
      setToken(t);
      setUser(jwtDecode(t));
      localStorage.setItem('token', t);
      
      console.log('Successfully connected to backend');
    } catch (err) {
      console.error('Login error:', err);
      if (err.response) {
        // Server responded with an error
        toast.error(err.response.data?.message || `Server error: ${err.response.statusText}`);
      } else if (err.request) {
        // Request was made but no response was received
        toast.error('No response from server. Is the backend running?');
        console.error('No response from server. Check if backend is running on port 8080');
      } else {
        // Something happened in setting up the request
        toast.error('Error setting up request:', err.message);
        console.error('Error setting up request:', err.message);
      }
    }
  };

  const signup = async (name, email, password) => {
    // remove any existing auth header so signup isn't blocked
    delete axios.defaults.headers.common['Authorization'];
    try {
      console.log('Attempting to connect to backend at:', process.env.REACT_APP_API_URL);
      await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, { name, email, password }, { headers: {} });
      toast.success('Signup successful, please login');
      console.log('Successfully connected to backend');
    } catch (err) {
      console.error('Signup error:', err);
      if (err.response) {
        // Server responded with an error
        toast.error(err.response.data?.message || `Server error: ${err.response.statusText}`);
      } else if (err.request) {
        // Request was made but no response was received
        toast.error('No response from server. Is the backend running?');
        console.error('No response from server. Check if backend is running on port 8080');
      } else {
        // Something happened in setting up the request
        toast.error('Error setting up request:', err.message);
        console.error('Error setting up request:', err.message);
      }
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    
  };

  return (
    <AuthContext.Provider value={{ token, user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
