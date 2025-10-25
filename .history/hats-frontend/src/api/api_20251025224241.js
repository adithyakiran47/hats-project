import axios from 'axios';
import config from '../config';

// Create an axios instance with your dynamic API URL
const api = axios.create({
  baseURL: `${config.apiUrl}/api`
});

// Intercept requests to add auth token if present
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
