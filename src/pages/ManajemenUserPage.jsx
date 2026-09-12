import { useState } from 'react';
import { Users, Search, Filter, ShieldCheck, HeartHandshake, UserPlus, Phone, Lock, ArrowLeft } from 'lucide-react';
import { volunteers } from '../data/dummyData';

const mockCitizenUsers = [
  { id: 'USR-201', nama: 'Sari Indah', email: 'sari.indah@gmail.com', disabilitas: 'Daksa (Kursi Roda)', lokasi: 'Kebayoran Baru, Jakarta Selatan', status: 'Terverifikasi', kontak: '+62 856-7890-1234', tglDaftar: '12 Jan 2026' },
  { id: 'USR-202', nama: 'Ahmad Fauzi', email: 'fauzi.ahmad@gmail.com', disabilitas: 'Tunanetra', lokasi: 'Setiabudi, Jakarta Selatan', status: 'Terverifikasi', kontak: '+62 812-3456-7890', tglDaftar: '18 Jan 2026' },
  { id: 'USR-203', nama: 'Rizky Pratama', email: 'rizky.p@gmail.com', disabilitas: 'Disabilitas Rungu', lokasi: 'Manggarai, Jakarta Selatan', status: 'Terverifikasi', kontak: '+62 877-2345-6789', tglDaftar: '04 Feb 2026' },
  { id: 'USR-204', nama: 'Siti Aminah', email: 'siti.aminah@gmail.com', disabilitas: 'Psikososial', lokasi: 'Melawai, Jakarta Selatan', status: 'Pending Verifikasi', kontak: '+62 813-9876-5432', tglDaftar: '15 Feb 2026' },
  { id: 'USR-205', nama: 'Dewi Putri', email: 'dewi.putri@gmail.com', disabilitas: 'Epilepsi', lokasi: 'Menteng, Jakarta Pusat', status: 'Terverifikasi', kontak: '+62 838-1234-5678', tglDaftar: '22 Feb 2026' },
];

export default function ManajemenUserPage({ currentUser, onBackToDashboard }) {
  const isSuperAdmin = currentUser?.role === 'Super Admin';
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

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1680px] w-full mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-black uppercase tracking-wider border border-emerald-200">
            Khusus Super Admin
          </span>
          <h1 className="text-[26px] font-black text-slate-900 tracking-tight leading-tight mt-1">
            Manajemen User
          </h1>
          <p className="text-[14px] text-slate-500 mt-1 font-medium">
            Kelola data akun pengguna difabel dan pendaftaran relawan di platform Sahabat SOS.
          </p>
        </div>

        <button onClick={() => alert('Fitur tambah relawan / pengguna baru')} className="btn-base btn-primary text-[13px] h-10 px-4">
          <UserPlus size={15} />
          <span>+ Tambah Akun</span>
        </button>
      </div>

      {/* Toggle Tabs */}
      <div className="flex items-center gap-2 bg-white border border-[#eaedf1] p-1.5 rounded-2xl w-fit shadow-xs">
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
      </div>

      {/* Table */}
      <div className="bg-white border border-[#eaedf1] rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="relative w-72">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari nama, kontak, lokasi..."
              className="w-full h-8 pl-8 pr-3 text-[12px] bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-emerald-600"
            />
          </div>
        </div>

        <div className="table-responsive">
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
                    <td className="font-bold text-emerald-600 text-[12px]">{u.id}</td>
                    <td>
                      <p className="font-bold text-slate-900 text-[13px]">{u.nama}</p>
                      <p className="text-[11px] text-slate-400">{u.email}</p>
                    </td>
                    <td>
                      <span className="font-semibold text-slate-700 text-[12px]">{u.disabilitas}</span>
                    </td>
                    <td>
                      <span className="text-slate-600 text-[12px]">{u.kontak}</span>
                    </td>
                    <td>
                      <span className="text-slate-500 text-[12px]">{u.lokasi}</span>
                    </td>
                    <td>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.status === 'Terverifikasi' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="text-right">
                      <button onClick={() => alert(`Detail ${u.nama}`)} className="btn-base btn-secondary py-1 px-2.5 text-[11px] h-7 rounded-lg">
                        Detail
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                volunteers.map(v => (
                  <tr key={v.id}>
                    <td className="font-bold text-blue-600 text-[12px]">{v.id}</td>
                    <td>
                      <p className="font-bold text-slate-900 text-[13px]">{v.nama}</p>
                      <p className="text-[11px] text-slate-400">{v.peran}</p>
                    </td>
                    <td>
                      <span className="text-[11px] text-slate-600">{v.keahlian?.join(', ')}</span>
                    </td>
                    <td>
                      <span className="text-slate-600 text-[12px]">{v.kontak}</span>
                    </td>
                    <td>
                      <span className="text-slate-500 text-[12px]">{v.jarak} dari posko</span>
                    </td>
                    <td>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        v.status === 'Bertugas' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="text-right">
                      <button onClick={() => alert(`Hubungi ${v.nama}`)} className="btn-base btn-primary py-1 px-2.5 text-[11px] h-7 rounded-lg">
                        <Phone size={11} />
                        <span>Kontak</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
