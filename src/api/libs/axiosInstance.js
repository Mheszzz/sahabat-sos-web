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
    const status = error.response?.status;
    const url = error.config?.url || '';

    // Jangan auto-logout untuk endpoint login — 401 di login = kredensial salah, bukan sesi expired
    const isLoginRequest = url.includes('/auth/admin/login') || url.includes('/auth/login');

    if (status === 401 && !isLoginRequest) {
      // Sesi expired / token invalid untuk request terautentikasi
      // localStorage.removeItem('admin_access_token');
      // window.location.href = '/login';
    }

    // Log untuk debugging (hanya di dev)
    if (import.meta.env.DEV) {
      if (!error.response) {
        console.error('[api] Network error — backend tidak terjangkau:', error.message, { url });
      }
    }

    return Promise.reject(error);
  }
);

export default api;
