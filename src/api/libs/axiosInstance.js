import axios from 'axios';

// Base URL dibaca dari file .env (VITE_API_URL)
// Ubah nilai di file .env jika URL backend berbeda
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor for adding the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors (like 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized, you might want to log the user out or redirect to login
      // localStorage.removeItem('admin_access_token');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
