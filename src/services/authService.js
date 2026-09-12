import api from './api';

export const authService = {
  /**
   * Login untuk Admin & Superadmin
   * @param {Object} credentials - { email, password }
   * @returns {Promise} Response dari API
   */
  login: async (credentials) => {
    const response = await api.post('/auth/admin/login', credentials);
    if (response.data && response.data.access_token) {
      localStorage.setItem('admin_access_token', response.data.access_token);
      localStorage.setItem('admin_user_data', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  /**
   * Logout Admin
   */
  logout: () => {
    localStorage.removeItem('admin_access_token');
    localStorage.removeItem('admin_user_data');
    // Optional: Call logout endpoint if needed
    // return api.post('/logout');
  },

  /**
   * Cek apakah user sedang login
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('admin_access_token');
  },
  
  /**
   * Ambil data user yang sedang login
   */
  getUser: () => {
    const user = localStorage.getItem('admin_user_data');
    return user ? JSON.parse(user) : null;
  }
};
