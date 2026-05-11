import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('habit_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If token is invalid, clear auth
    if (error.response?.status === 401) {
      localStorage.removeItem('habit_token');
      localStorage.removeItem('habit_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

