import api from './api';

export const adminService = {
  /**
   * Mengambil data statistik untuk dashboard utama
   * @returns {Promise} Response data { stats: {...} }
   */
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard-stats');
    return response.data;
  },

  /**
   * Mengambil data titik koordinat peta untuk dashboard
   * @returns {Promise}
   */
  getPetaKasus: async () => {
    const response = await api.get('/admin/dashboard/peta-kasus');
    return response.data;
  },

  /**
   * Mengambil daftar relawan terdekat / quick dispatch
   * @returns {Promise}
   */
  getQuickDispatchRelawan: async () => {
    const response = await api.get('/admin/dashboard/quick-dispatch');
    return response.data;
  },

  /**
   * Mengambil daftar relawan yang menunggu verifikasi
   * @returns {Promise} Response data { data: [...] }
   */
  getPendingRelawan: async () => {
    const response = await api.get('/admin/relawan/pending');
    return response.data;
  },

  /**
   * Menyetujui atau menolak relawan
   * @param {number|string} id - ID Relawan
   * @param {string} status - 'terverifikasi' | 'ditolak'
   * @returns {Promise}
   */
  verifikasiRelawan: async (id, status) => {
    const response = await api.put(`/admin/relawan/${id}/verifikasi`, {
      status_verifikasi: status
    });
    return response.data;
  },

  // ==========================================
  // API KHUSUS SUPERADMIN (MANAJEMEN ADMIN)
  // ==========================================

  /**
   * Mengambil daftar seluruh Admin
   * @returns {Promise} Response data { data: [...], available_permissions: [...] }
   */
  getAdmins: async () => {
    const response = await api.get('/superadmin/admins');
    return response.data;
  },

  /**
   * Membuat akun Admin baru
   * @param {Object} adminData - { name, email, password, no_telp, alamat }
   * @returns {Promise}
   */
  createAdmin: async (adminData) => {
    const response = await api.post('/superadmin/admins', adminData);
    return response.data;
  },

  /**
   * Mengupdate hak akses / permissions Admin
   * @param {number|string} id - ID User (Admin)
   * @param {Array} permissions - Array string hak akses e.g. ['verifikasi_relawan']
   * @returns {Promise}
   */
  updateAdminPermissions: async (id, permissions) => {
    const response = await api.put(`/superadmin/admins/${id}/permissions`, {
      permissions
    });
    return response.data;
  },

  /**
   * Mencabut semua hak akses Admin
   * @param {number|string} id - ID User (Admin)
   * @returns {Promise}
   */
  revokeAdminPermissions: async (id) => {
    const response = await api.delete(`/superadmin/admins/${id}/permissions`);
    return response.data;
  }
};
