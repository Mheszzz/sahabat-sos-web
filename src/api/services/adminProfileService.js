import api from '../libs/axiosInstance';

export const adminProfileService = {
  /**
   * GET /api/admin/profile
   * Ambil profil admin yang sedang login
   */
  getProfile: async () => {
    const response = await api.get('/admin/profile');
    return response.data;
  },

  /**
   * POST /api/admin/profile
   * Update data diri (name, no_telp, alamat) dan/atau foto profil.
   * Wajib pakai FormData karena bisa ada file upload.
   * @param {FormData} formData
   */
  updateProfile: async (formData) => {
    const response = await api.post('/admin/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    // Sinkronisasi localStorage agar data di header/sidebar ikut update
    if (response.data?.user) {
      const stored = JSON.parse(localStorage.getItem('admin_user_data') || '{}');
      localStorage.setItem(
        'admin_user_data',
        JSON.stringify({ ...stored, ...response.data.user })
      );
    }
    return response.data;
  },

  /**
   * PUT /api/admin/profile/security
   * Ganti email dan/atau password.
   * @param {{ current_password, email?, password?, password_confirmation? }} payload
   */
  updateSecurity: async (payload) => {
    const response = await api.put('/admin/profile/security', payload);
    return response.data;
  },

  /**
   * DELETE /api/admin/profile/foto
   * Hapus foto profil admin.
   */
  deleteFoto: async () => {
    const response = await api.delete('/admin/profile/foto');
    return response.data;
  },
};
