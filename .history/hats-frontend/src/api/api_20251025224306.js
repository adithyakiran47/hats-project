import axios from 'axios';
import config from '../config';

// Create an axios instance using the dynamic API URL from your config
const api = axios.create({
  baseURL: `${config.apiUrl}/api`
});

// Add a request interceptor to include JWT token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
