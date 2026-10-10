import { useState, useEffect } from 'react';
import { adminService } from '../../api/services/adminService';

export function useUsers() {
  const [activeTab, setActiveTab] = useState('relawan');
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
      const list = res?.data?.data || res?.data || [];
      // Normalize field names: API may return name or nama
      const normalized = (Array.isArray(list) ? list : []).map(r => ({
        ...r,
        nama: r.nama ?? r.name ?? '',
        kontak: r.kontak ?? r.no_telp ?? r.phone ?? '',
        lokasi: r.lokasi ?? r.alamat ?? r.kota ?? '',
        peran: r.peran ?? r.role_title ?? r.kompetensi ?? '',
        status: r.status_verifikasi ?? r.status ?? '',
      }));
      if (normalized.length > 0) {
        setRelawan(normalized);
      } else {
        setRelawan([
          { id: 'R-001', nama: 'Budi Santoso', kontak: '+6281234567890', lokasi: 'Jakarta Selatan', peran: 'Medis', status: 'Terverifikasi' },
          { id: 'R-002', nama: 'Siti Aminah', kontak: '+6281298765432', lokasi: 'Jakarta Timur', peran: 'Logistik', status: 'Terverifikasi' },
          { id: 'R-003', nama: 'Andi Wijaya', kontak: '+6281311223344', lokasi: 'Jakarta Pusat', peran: 'Evakuasi', status: 'Nonaktif' },
        ]);
      }
    } catch (error) {
      console.error('Gagal mengambil data relawan:', error);
      // Fallback dummy data if backend is unreachable or empty
      setRelawan([
        { id: 'R-001', nama: 'Budi Santoso', kontak: '+6281234567890', lokasi: 'Jakarta Selatan', peran: 'Medis', status: 'Terverifikasi' },
        { id: 'R-002', nama: 'Siti Aminah', kontak: '+6281298765432', lokasi: 'Jakarta Timur', peran: 'Logistik', status: 'Terverifikasi' },
        { id: 'R-003', nama: 'Andi Wijaya', kontak: '+6281311223344', lokasi: 'Jakarta Pusat', peran: 'Evakuasi', status: 'Nonaktif' },
      ]);
    } finally {
      setIsLoadingRelawan(false);
    }
  };

  // ─── Fetch Pending Relawan ────────────────────────────────────────────
  const fetchPendingRelawan = async () => {
    setIsLoadingPending(true);
    try {
      const res = await adminService.getPendingRelawan();
      const list = res?.data?.data || res?.data || [];
      if (Array.isArray(list) && list.length > 0) {
        setPendingRelawans(list);
      } else {
        setPendingRelawans([
          { id: 'R-004', nama: 'Dewi Lestari', email: 'dewi@example.com', kontak: '+6281998877665', lokasi: 'Jakarta Barat', peran: 'Dapur Umum', status: 'Pending Verifikasi' },
          { id: 'R-005', nama: 'Fajar Hidayat', email: 'fajar@example.com', kontak: '+6285544332211', lokasi: 'Jakarta Utara', peran: 'Penyelamat', status: 'Pending Verifikasi' },
        ]);
      }
    } catch (error) {
      console.error('Gagal mengambil relawan pending:', error);
      setPendingRelawans([
        { id: 'R-004', nama: 'Dewi Lestari', email: 'dewi@example.com', kontak: '+6281998877665', lokasi: 'Jakarta Barat', peran: 'Dapur Umum', status: 'Pending Verifikasi' },
        { id: 'R-005', nama: 'Fajar Hidayat', email: 'fajar@example.com', kontak: '+6285544332211', lokasi: 'Jakarta Utara', peran: 'Penyelamat', status: 'Pending Verifikasi' },
      ]);
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
    activeTab === 'relawan' ? relawan
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
