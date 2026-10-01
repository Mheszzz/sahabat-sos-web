import { useState, useEffect } from 'react';
import { adminService } from '../../api/services/adminService';
import { volunteers } from '../../utils/dummyData';

const mockCitizenUsers = [
  { id: 'USR-201', nama: 'Sari Indah', email: 'sari.indah@gmail.com', disabilitas: 'Daksa (Kursi Roda)', lokasi: 'Kebayoran Baru, Jakarta Selatan', status: 'Terverifikasi', kontak: '+62 856-7890-1234', tglDaftar: '12 Jan 2026' },
  { id: 'USR-202', nama: 'Ahmad Fauzi', email: 'fauzi.ahmad@gmail.com', disabilitas: 'Tunanetra', lokasi: 'Setiabudi, Jakarta Selatan', status: 'Terverifikasi', kontak: '+62 812-3456-7890', tglDaftar: '18 Jan 2026' },
  { id: 'USR-203', nama: 'Rizky Pratama', email: 'rizky.p@gmail.com', disabilitas: 'Disabilitas Rungu', lokasi: 'Manggarai, Jakarta Selatan', status: 'Terverifikasi', kontak: '+62 877-2345-6789', tglDaftar: '04 Feb 2026' },
  { id: 'USR-204', nama: 'Siti Aminah', email: 'siti.aminah@gmail.com', disabilitas: 'Psikososial', lokasi: 'Melawai, Jakarta Selatan', status: 'Pending Verifikasi', kontak: '+62 813-9876-5432', tglDaftar: '15 Feb 2026' },
  { id: 'USR-205', nama: 'Dewi Putri', email: 'dewi.putri@gmail.com', disabilitas: 'Epilepsi', lokasi: 'Menteng, Jakarta Pusat', status: 'Terverifikasi', kontak: '+62 838-1234-5678', tglDaftar: '22 Feb 2026' },
];

export function useUsers() {
  const [activeTab, setActiveTab] = useState('pengguna');
  const [search, setSearch] = useState('');
  const [pendingRelawans, setPendingRelawans] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPendingRelawan = async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getPendingRelawan();
      if (res && res.data) setPendingRelawans(res.data);
    } catch (error) {
      console.error('Gagal mengambil relawan pending:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingRelawan();
  }, []);

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

  const currentData = activeTab === 'pengguna' ? mockCitizenUsers : activeTab === 'relawan' ? volunteers : pendingRelawans;
  
  const filteredData = currentData.filter(item => {
    const q = search.toLowerCase();
    return !q || item.nama?.toLowerCase().includes(q) || item.lokasi?.toLowerCase().includes(q) || item.id?.toLowerCase().includes(q);
  });

  return {
    activeTab, setActiveTab,
    search, setSearch,
    pendingRelawans,
    isLoading,
    filteredData,
    handleVerify
  };
}
