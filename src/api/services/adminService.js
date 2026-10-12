import api from '../libs/axiosInstance';

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
   * Mengambil daftar relawan yang tersedia untuk quick dispatch
   * @returns {Promise} Response data { data: [...] }
   */
  getQuickDispatchRelawan: async (params = {}) => {
    const response = await api.get('/admin/dashboard/quick-dispatch', { params });
    return response.data;
  },

  /**
   * Menugaskan relawan ke kasus SOS tertentu
   * @param {number|string} sosId - ID SOS
   * @param {number|string} relawanId - ID Relawan yang akan di-dispatch
   * @returns {Promise}
   */
  dispatchRelawan: async (sosId, relawanId) => {
    const response = await api.post('/admin/dashboard/dispatch', {
      sos_id: sosId,
      relawan_id: relawanId,
    });
    return response.data;
  },

  /**
   * Menyelesaikan kasus SOS
   * @param {number|string} sosId - ID SOS
   * @returns {Promise}
   */
  selesaiSOS: async (sosId) => {
    const response = await api.put(`/admin/dashboard/sos/${sosId}/selesai`);
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
      status_verifikasi: status,
    });
    return response.data;
  },

  /**
   * Mengambil log riwayat aktivitas kasus SOS
   * @param {number|string} sosId - ID SOS
   * @returns {Promise}
   */
  getSosActivities: async (sosId) => {
    const response = await api.get(`/admin/sos/${sosId}/activities`);
    return response.data;
  },

  /**
   * Membunyikan sirene posko secara massal
   * @returns {Promise}
   */
  triggerSirenePosko: async () => {
    const response = await api.post('/admin/posko/sirene');
    return response.data;
  },

  /**
   * Mendownload export laporan CSV (mengembalikan file blob)
   * @returns {Promise<Blob>}
   */
  exportLaporanCsv: async () => {
    const response = await api.get('/admin/laporan/export', { responseType: 'blob' });
    return response.data;
  },

  /**
   * Mengambil data untuk Peta Kasus Aktif
   * @returns {Promise}
   */
  getPetaKasus: async () => {
    const response = await api.get('/admin/dashboard/peta-kasus');
    return response.data;
  },

  /**
   * Mengambil ringkasan sebaran urgensi kasus
   * @returns {Promise}
   */
  getSebaranUrgensi: async () => {
    const response = await api.get('/admin/dashboard/sebaran-urgensi');
    return response.data;
  },

  /**
   * Global search lintas kasus & relawan
   * @param {string} q - Query pencarian
   * @returns {Promise}
   */
  globalSearch: async (q) => {
    const response = await api.get('/admin/dashboard/search', { params: { q } });
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
      permissions,
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
  },

  // ==========================================
  // API KHUSUS SUPERADMIN (MANAJEMEN RELAWAN)
  // ==========================================

  /**
   * Mengambil daftar seluruh Relawan (Admin & Superadmin)
   * @returns {Promise} Response data { data: [...] }
   */
  getRelawanSuperadmin: async () => {
    const response = await api.get('/admin/relawan');
    return response.data;
  },

  /**
   * Mengupdate status relawan (Admin & Superadmin)
   * @param {number|string} id - ID Relawan
   * @param {boolean} isActive - Status keaktifan baru
   * @returns {Promise}
   */
  updateStatusRelawan: async (id, isActive) => {
    const response = await api.put(`/admin/relawan/${id}/updateStatus`, { is_active: isActive });
    return response.data;
  },

  /**
   * Mendaftarkan akun relawan baru dari dashboard admin (Pre-Registration via Google SSO)
   * @param {Object} data - { name, email, no_telp, alamat, pekerjaan }
   * @returns {Promise}
   */
  registerRelawan: async (data) => {
    const response = await api.post('/admin/relawan', data);
    return response.data;
  },

  /**
   * (SOS-122) Mencatat aktivitas log aksi kritis oleh admin (misal hubungi ambulans)
   * @param {number|string} sosId - ID SOS
   * @param {Object} payload - { action, keterangan }
   */
  logAksiKritis: async (sosId, payload) => {
    // Endpoint SOS-122 belum dirilis — gunakan mock sebagai fallback
    try {
      const response = await api.post(`/admin/sos/${sosId}/log-action`, payload);
      return response.data;
    } catch {
      // Fallback mock jika endpoint belum ada di backend
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log(`[Mock API] Aksi kritis dicatat untuk SOS #${sosId}:`, payload);
          resolve({ message: 'Log aktivitas berhasil dicatat (Mock).' });
        }, 300);
      });
    }
  },
};
