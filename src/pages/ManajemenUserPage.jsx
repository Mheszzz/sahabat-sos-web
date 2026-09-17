import { useState, useEffect } from 'react';
import { Users, Search, Filter, ShieldCheck, HeartHandshake, UserPlus, Phone, Lock, ArrowLeft, MapPin, Check, X } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Badge from '../components/Badge';
import { volunteers } from '../data/dummyData';
import { adminService } from '../services/adminService';

const mockCitizenUsers = [
  { id: 'USR-201', nama: 'Sari Indah', email: 'sari.indah@gmail.com', disabilitas: 'Daksa (Kursi Roda)', lokasi: 'Kebayoran Baru, Jakarta Selatan', status: 'Terverifikasi', kontak: '+62 856-7890-1234', tglDaftar: '12 Jan 2026' },
  { id: 'USR-202', nama: 'Ahmad Fauzi', email: 'fauzi.ahmad@gmail.com', disabilitas: 'Tunanetra', lokasi: 'Setiabudi, Jakarta Selatan', status: 'Terverifikasi', kontak: '+62 812-3456-7890', tglDaftar: '18 Jan 2026' },
  { id: 'USR-203', nama: 'Rizky Pratama', email: 'rizky.p@gmail.com', disabilitas: 'Disabilitas Rungu', lokasi: 'Manggarai, Jakarta Selatan', status: 'Terverifikasi', kontak: '+62 877-2345-6789', tglDaftar: '04 Feb 2026' },
  { id: 'USR-204', nama: 'Siti Aminah', email: 'siti.aminah@gmail.com', disabilitas: 'Psikososial', lokasi: 'Melawai, Jakarta Selatan', status: 'Pending Verifikasi', kontak: '+62 813-9876-5432', tglDaftar: '15 Feb 2026' },
  { id: 'USR-205', nama: 'Dewi Putri', email: 'dewi.putri@gmail.com', disabilitas: 'Epilepsi', lokasi: 'Menteng, Jakarta Pusat', status: 'Terverifikasi', kontak: '+62 838-1234-5678', tglDaftar: '22 Feb 2026' },
];

export default function ManajemenUserPage({ currentUser, onBackToDashboard }) {
  const isSuperAdmin = currentUser?.role === 'Super Admin' || currentUser?.role === 'superadmin';
  if (!isSuperAdmin) {
    return (
      <div className="p-6 lg:p-12 max-w-[800px] mx-auto text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
          <Lock size={30} />
        </div>
        <h1 className="text-[24px] font-black text-slate-900">403 — Akses Ditolak</h1>
        <button onClick={onBackToDashboard} className="btn-base btn-primary text-[13px] h-10 px-5">
          <ArrowLeft size={14} />
          <span>Kembali ke Dashboard</span>
        </button>
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState('pengguna');
  const [search, setSearch] = useState('');

  const [pendingRelawans, setPendingRelawans] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPendingRelawan = async () => {
    try {
      setIsLoading(true);
      const res = await adminService.getPendingRelawan();
      if (res && res.data) {
        setPendingRelawans(res.data);
      }
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

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1680px] w-full mx-auto">
      {/* Header */}
      <PageHeader 
        title="Manajemen User"
        description="Kelola data akun pengguna difabel dan pendaftaran relawan di platform Sahabat SOS."
        actions={
          <button onClick={() => alert('Fitur tambah relawan / pengguna baru')} className="btn-base btn-primary text-[13px] h-10 px-4">
            <UserPlus size={15} />
            <span>+ Tambah Akun</span>
          </button>
        }
      />

      {/* Toggle Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-white border border-[#eaedf1] p-1.5 rounded-2xl w-fit shadow-xs">
        <button
          onClick={() => setActiveTab('pengguna')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold transition-all cursor-pointer ${
            activeTab === 'pengguna' ? 'bg-[#0a271f] text-white' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Users size={15} />
          <span>Pengguna Difabel (683)</span>
        </button>
        <button
          onClick={() => setActiveTab('relawan')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold transition-all cursor-pointer ${
            activeTab === 'relawan' ? 'bg-[#0a271f] text-white' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <HeartHandshake size={15} />
          <span>Relawan Terdaftar (142)</span>
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold transition-all cursor-pointer ${
            activeTab === 'pending' ? 'bg-[#b45309] text-white' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <ShieldCheck size={15} />
          <span>Pending Verifikasi {pendingRelawans.length > 0 && `(${pendingRelawans.length})`}</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#eaedf1] rounded-2xl overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="relative w-72">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari nama, kontak, lokasi..."
              className="w-full h-8 pr-3 text-[12px] bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-emerald-600"
              style={{ paddingLeft: '48px' }}
            />
          </div>
        </div>

        <div className="hidden md:block table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nama Lengkap</th>
                <th>Kebutuhan / Peran</th>
                <th>Kontak</th>
                <th>Wilayah</th>
                <th>Status</th>
                <th className="text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {activeTab === 'pengguna' ? (
                mockCitizenUsers.map(u => (
                  <tr key={u.id}>
                    <td className="font-bold text-emerald-600 text-[12px] whitespace-nowrap">{u.id}</td>
                    <td className="whitespace-nowrap">
                      <p className="font-bold text-slate-900 text-[13px]">{u.nama}</p>
                      <p className="text-[11px] text-slate-400">{u.email}</p>
                    </td>
                    <td className="whitespace-nowrap">
                      <Badge variant={u.disabilitas} />
                    </td>
                    <td className="whitespace-nowrap">
                      <span className="text-slate-600 text-[12px]">{u.kontak}</span>
                    </td>
                    <td className="whitespace-nowrap">
                      <span className="text-slate-500 text-[12px]">{u.lokasi}</span>
                    </td>
                    <td className="whitespace-nowrap">
                      <Badge variant={u.status} />
                    </td>
                    <td className="text-right whitespace-nowrap">
                      <button onClick={() => alert(`Detail ${u.nama}`)} className="btn-base btn-secondary text-[11px] h-9 px-3 rounded-lg">
                        Detail
                      </button>
                    </td>
                  </tr>
                ))
              ) : activeTab === 'relawan' ? (
                volunteers.map(v => (
                  <tr key={v.id}>
                    <td className="font-bold text-blue-600 text-[12px] whitespace-nowrap">{v.id}</td>
                    <td className="whitespace-nowrap">
                      <p className="font-bold text-slate-900 text-[13px]">{v.nama}</p>
                      <p className="text-[11px] text-slate-400">{v.peran}</p>
                    </td>
                    <td className="whitespace-nowrap">
                      <span className="text-[11px] text-slate-600 max-w-[150px] truncate block">{v.keahlian?.join(', ')}</span>
                    </td>
                    <td className="whitespace-nowrap">
                      <span className="text-slate-600 text-[12px]">{v.kontak}</span>
                    </td>
                    <td className="whitespace-nowrap">
                      <span className="text-slate-500 text-[12px]">{v.jarak || 'N/A'}</span>
                    </td>
                    <td className="whitespace-nowrap">
                      <Badge variant={v.status === 'Bertugas' ? 'Sedang Bertugas' : 'Online'} />
                    </td>
                    <td className="text-right whitespace-nowrap">
                      <button onClick={() => alert(`Hubungi ${v.nama}`)} className="btn-base btn-primary text-[11px] h-9 px-3 rounded-lg">
                        <Phone size={12} />
                        <span>Kontak</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                pendingRelawans.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-10 text-slate-500 font-medium text-[13px]">
                      Tidak ada relawan yang menunggu verifikasi.
                    </td>
                  </tr>
                ) : (
                  pendingRelawans.map(v => (
                    <tr key={v.id}>
                      <td className="font-bold text-amber-600 text-[12px] whitespace-nowrap">USER-{v.id}</td>
                      <td className="whitespace-nowrap">
                        <p className="font-bold text-slate-900 text-[13px]">{v.name}</p>
                        <p className="text-[11px] text-slate-400">{v.email}</p>
                      </td>
                      <td className="whitespace-nowrap">
                        <span className="text-[11px] text-slate-600 block">Menunggu Review</span>
                      </td>
                      <td className="whitespace-nowrap">
                        <span className="text-slate-600 text-[12px]">{v.no_telp || '-'}</span>
                      </td>
                      <td className="whitespace-nowrap">
                        <span className="text-slate-500 text-[12px]">{v.alamat || '-'}</span>
                      </td>
                      <td className="whitespace-nowrap">
                        <Badge variant="Menunggu" />
                      </td>
                      <td className="text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleVerify(v.id, 'ditolak')} className="btn-base text-[11px] h-8 px-2.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50">
                            <X size={13} /> Tolak
                          </button>
                          <button onClick={() => handleVerify(v.id, 'terverifikasi')} className="btn-base text-[11px] h-8 px-2.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100">
                            <Check size={13} /> Setujui
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )
              )}
            </tbody>
          </table>
        </div>

        <div className="md:hidden divide-y divide-slate-100 p-4 space-y-3">
          {activeTab === 'pengguna' ? (
            mockCitizenUsers.map(u => (
              <div key={u.id} className="pt-3 first:pt-0 bg-[#f8fafc] p-4 rounded-xl border border-slate-200">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="block text-[12px] font-extrabold text-emerald-600">{u.id}</span>
                    <p className="font-bold text-slate-900 text-[14px] mt-0.5 leading-tight">{u.nama}</p>
                  </div>
                  <Badge variant={u.status} isPill />
                </div>
                
                <div className="mt-2">
                  <Badge variant={u.disabilitas} />
                </div>

                <div className="grid grid-cols-1 gap-2 mt-3 pt-2 border-t border-slate-200 text-[12px] text-slate-600">
                  <div className="flex items-start gap-2">
                    <MapPin size={13} className="text-slate-400 mt-0.5 flex-shrink-0" />
                    <span className="text-[11px] leading-tight text-slate-600">{u.lokasi}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px]">
                    <Phone size={12} className="text-slate-400" />
                    <span>{u.kontak}</span>
                  </div>
                </div>

                <div className="mt-3">
                  <button onClick={() => alert(`Detail ${u.nama}`)} className="btn-base btn-secondary text-[12px] py-1.5 w-full">
                    Detail Pengguna
                  </button>
                </div>
              </div>
            ))
          ) : activeTab === 'relawan' ? (
            volunteers.map(v => (
              <div key={v.id} className="pt-3 first:pt-0 bg-[#f8fafc] p-4 rounded-xl border border-slate-200">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${v.avatarBg} text-white flex-shrink-0`}>
                      {v.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-[13px] leading-tight">{v.nama}</p>
                      <p className="text-[11px] text-slate-400">{v.peran}</p>
                    </div>
                  </div>
                  <Badge variant={v.status === 'Bertugas' ? 'Sedang Bertugas' : 'Online'} isPill />
                </div>

                <div className="grid grid-cols-1 gap-2 mt-3 pt-2 border-t border-slate-200 text-[12px] text-slate-600">
                  <div className="flex items-start gap-2">
                    <MapPin size={13} className="text-slate-400 mt-0.5 flex-shrink-0" />
                    <span className="text-[11px] leading-tight text-slate-600">{v.jarak || 'N/A'} dari posko</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px]">
                    <Phone size={12} className="text-slate-400" />
                    <span>{v.kontak}</span>
                  </div>
                </div>

                <div className="mt-3">
                  <button onClick={() => alert(`Hubungi ${v.nama}`)} className="btn-base btn-primary text-[12px] py-1.5 w-full flex items-center justify-center gap-2">
                    <Phone size={13} />
                    <span>Hubungi Relawan</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            pendingRelawans.length === 0 ? (
              <div className="p-8 text-center text-slate-500 font-medium text-[13px]">
                Tidak ada relawan yang menunggu verifikasi.
              </div>
            ) : (
              pendingRelawans.map(v => (
                <div key={v.id} className="pt-3 first:pt-0 bg-[#f8fafc] p-4 rounded-xl border border-slate-200">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="block text-[12px] font-extrabold text-amber-600">USER-{v.id}</span>
                      <p className="font-bold text-slate-900 text-[14px] mt-0.5 leading-tight">{v.name}</p>
                      <p className="text-[11px] text-slate-400">{v.email}</p>
                    </div>
                    <Badge variant="Menunggu" isPill />
                  </div>
  
                  <div className="grid grid-cols-1 gap-2 mt-3 pt-2 border-t border-slate-200 text-[12px] text-slate-600">
                    <div className="flex items-start gap-2">
                      <MapPin size={13} className="text-slate-400 mt-0.5 flex-shrink-0" />
                      <span className="text-[11px] leading-tight text-slate-600">{v.alamat || '-'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px]">
                      <Phone size={12} className="text-slate-400" />
                      <span>{v.no_telp || '-'}</span>
                    </div>
                  </div>
  
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button onClick={() => handleVerify(v.id, 'ditolak')} className="btn-base border border-red-200 text-red-600 hover:bg-red-50 text-[12px] py-1.5 w-full">
                      Tolak
                    </button>
                    <button onClick={() => handleVerify(v.id, 'terverifikasi')} className="btn-base border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[12px] py-1.5 w-full">
                      Setujui
                    </button>
                  </div>
                </div>
              ))
            )
          )}
        </div>
      </div>
    </div>
  );
}
