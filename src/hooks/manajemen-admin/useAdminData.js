import { useState, useEffect } from 'react';
import { adminService } from '../../api/services/adminService';

export function useAdminData() {
  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [sortBy, setSortBy] = useState('terbaru');

  const fetchAdmins = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getAdmins();
      setAdmins(Array.isArray(data) ? data : (data?.data || []));
    } catch (error) {
      console.error('Gagal memuat data admin:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const totalAdmin = admins.length;
  const adminAktif = admins.filter(a => a.status === 'Aktif').length;
  const sedangBertugas = admins.filter(a => a.operasional === 'Sedang Bertugas').length;
  const offlineCount = admins.filter(a => a.operasional === 'Offline').length;

  const filteredAdmins = admins.filter(a => {
    const matchStatus =
      statusFilter === 'Semua' ? true :
      statusFilter === 'Aktif' ? a.status === 'Aktif' :
      statusFilter === 'Sedang Bertugas' ? a.operasional === 'Sedang Bertugas' :
      statusFilter === 'Offline' ? a.operasional === 'Offline' :
      statusFilter === 'Nonaktif' ? a.status === 'Nonaktif' : true;

    const q = searchQuery.toLowerCase();
    const matchSearch = !q ||
      a.nama?.toLowerCase().includes(q) ||
      a.email?.toLowerCase().includes(q) ||
      a.id?.toLowerCase().includes(q);

    return matchStatus && matchSearch;
  }).sort((a, b) => {
    if (sortBy === 'nama') return a.nama?.localeCompare(b.nama);
    if (sortBy === 'kasus') return (b.kasusDitangani || 0) - (a.kasusDitangani || 0);
    return a.id?.localeCompare(b.id);
  });

  return {
    admins: filteredAdmins,
    isLoading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    totalAdmin,
    adminAktif,
    sedangBertugas,
    offlineCount,
    fetchAdmins
  };
}

