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
  }
};
