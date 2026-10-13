import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { adminService } from '../../api/services/adminService';

export function useUsers() {
  const [searchParams] = useSearchParams();
  const querySearch = searchParams.get('search') || searchParams.get('q') || '';
  const [activeTab, setActiveTab] = useState('relawan');
  const [search, setSearch] = useState(querySearch);

  useEffect(() => {
    const q = searchParams.get('search') || searchParams.get('q');
    if (q !== null && q !== undefined) {
      setSearch(q);
    }
  }, [searchParams]);

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
      // Backend: { status, data: { data: [...], current_page, ... } } (paginated)
      const list = res?.data?.data ?? res?.data ?? res ?? [];
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
      const list = res?.data?.data || res?.data || [];
      if (Array.isArray(list) && list.length > 0) {
        setPendingRelawans(list);
      }
    } catch (error) {
      console.error('Gagal mengambil relawan pending:', error);
      setPendingRelawans([]);
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
      await fetchRelawan();
      return { success: true, status };
    } catch (error) {
      console.error('Gagal verifikasi relawan:', error);
      throw error;
    }
  };

  // ─── Update status aktif relawan (is_active boolean) ────────────────────
  const handleUpdateStatusRelawan = async (id, isActive) => {
    try {
      await adminService.updateStatusRelawan(id, isActive);
      setRelawan(prev =>
        prev.map(r => r.id === id ? { ...r, is_active: isActive } : r)
      );
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
      || (item.alamat || item.lokasi || '').toLowerCase().includes(q)
      || (item.no_telp || item.kontak || '').toLowerCase().includes(q)
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
