import api from './api';

/**
 * relawanService — API untuk data relawan terverifikasi
 * Digunakan di: ManajemenRelawanPage, PetaPemantauanPage, DashboardPage
 */
export const relawanService = {
  /**
   * Mengambil semua relawan yang sudah terverifikasi
   * @returns {Promise} Response data { data: [...] }
   */
  getRelawan: async () => {
    const response = await api.get('/admin/relawan');
    return response.data;
  },

  /**
   * Mengambil relawan yang menunggu verifikasi (pending)
   * (sudah ada di adminService, di-alias juga di sini)
   * @returns {Promise} Response data { data: [...] }
   */
  getPendingRelawan: async () => {
    const response = await api.get('/admin/relawan/pending');
    return response.data;
  },

  /**
   * Verifikasi / tolak relawan
   * @param {number|string} id
   * @param {'terverifikasi'|'ditolak'} status
   */
  verifikasiRelawan: async (id, status) => {
    const response = await api.put(`/admin/relawan/${id}/verifikasi`, {
      status_verifikasi: status,
    });
    return response.data;
  },
};
