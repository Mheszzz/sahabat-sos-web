import { useState, useEffect } from 'react';
import { adminService } from '../../api/services/adminService';

export function useUsers() {
  const [activeTab, setActiveTab] = useState('pengguna');
  const [search, setSearch] = useState('');

  // Data state
  const [pengguna, setPengguna] = useState([]);
  const [relawan, setRelawan] = useState([]);
  const [pendingRelawans, setPendingRelawans] = useState([]);

  // Loading state
  const [isLoadingPengguna, setIsLoadingPengguna] = useState(false);
  const [isLoadingRelawan, setIsLoadingRelawan] = useState(false);
  const [isLoadingPending, setIsLoadingPending] = useState(false);

  // ─── Fetch Relawan Superadmin ─────────────────────────────────────────
  const fetchRelawan = async () => {
    setIsLoadingRelawan(true);
    try {
      const res = await adminService.getRelawanSuperadmin();
      const list = res?.data ?? [];
      setRelawan(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error('Gagal mengambil data relawan:', error);
      setRelawan([]);
    } finally {
      setIsLoadingRelawan(false);
    }
  };

  // ─── Fetch Pending Relawan ────────────────────────────────────────────
  const fetchPendingRelawan = async () => {
    setIsLoadingPending(true);
    try {
      const res = await adminService.getPendingRelawan();
      if (res && res.data) setPendingRelawans(res.data);
    } catch (error) {
      console.error('Gagal mengambil relawan pending:', error);
    } finally {
      setIsLoadingPending(false);
    }
  };

  // Fetch on mount (semua tab)
  useEffect(() => {
    fetchPendingRelawan();
    fetchRelawan();
  }, []);

  // ─── Verifikasi relawan ───────────────────────────────────────────────
  const handleVerify = async (id, status) => {
    try {
      await adminService.verifikasiRelawan(id, status);
      setPendingRelawans(prev => prev.filter(r => r.id !== id));
      alert(`Relawan berhasil ${status === 'terverifikasi' ? 'disetujui' : 'ditolak'}.`);
    } catch (error) {
      console.error('Gagal verifikasi relawan:', error);
      alert('Terjadi kesalahan saat verifikasi.');
    }
  };

  // ─── Update status relawan ────────────────────────────────────────────
  const handleUpdateStatusRelawan = async (id, status) => {
    try {
      await adminService.updateStatusRelawan(id, status);
      setRelawan(prev =>
        prev.map(r => r.id === id ? { ...r, status_verifikasi: status } : r)
      );
      alert('Status relawan berhasil diperbarui.');
    } catch (error) {
      console.error('Gagal update status relawan:', error);
      alert('Terjadi kesalahan saat mengupdate status.');
    }
  };

  const isLoading = isLoadingRelawan || isLoadingPending || isLoadingPengguna;

  // ─── Filter data sesuai tab aktif ─────────────────────────────────────
  const currentData =
    activeTab === 'pengguna' ? pengguna
    : activeTab === 'relawan' ? relawan
    : pendingRelawans;

  const filteredData = currentData.filter(item => {
    const q = search.toLowerCase();
    return !q
      || (item.name || item.nama || '').toLowerCase().includes(q)
      || (item.email || '').toLowerCase().includes(q)
      || (item.lokasi || item.alamat || '').toLowerCase().includes(q)
      || String(item.id || '').toLowerCase().includes(q);
  });

  return {
    activeTab, setActiveTab,
    search, setSearch,
    pengguna,
    relawan,
    pendingRelawans,
    isLoading,
    filteredData,
    handleVerify,
    handleUpdateStatusRelawan,
    fetchRelawan,
    fetchPendingRelawan,
  };
}
