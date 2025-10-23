// hats-frontend/src/api/api.js

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Intercept all requests to add Authorization header with JWT token if available
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token'); // JWT token stored after login
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

export default api;
