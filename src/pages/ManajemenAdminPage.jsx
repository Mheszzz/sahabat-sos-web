import { useState } from 'react';
import {
  Users, UserPlus, Search, Filter, ArrowUpDown, Eye, Edit2, UserX,
  UserCheck, Shield, CheckCircle, Clock, Activity, AlertTriangle,
  X, Phone, MessageSquare, ChevronRight, CheckCircle2, Lock, ArrowLeft
} from 'lucide-react';
import { initialAdmins, adminActivityLogs, sosCases } from '../data/dummyData';

export default function ManajemenAdminPage({ currentUser, onOpenDetail, onBackToDashboard }) {
  // ── Role Authorization Check ──
  const isSuperAdmin = currentUser?.role === 'Super Admin';
  if (!isSuperAdmin) {
    return (
      <div className="p-6 lg:p-12 max-w-[800px] mx-auto text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mx-auto shadow-xs">
          <Lock size={30} />
        </div>
        <div>
          <h1 className="text-[24px] font-black text-slate-900">403 — Akses Ditolak</h1>
          <p className="text-[14px] text-slate-500 mt-2 max-w-md mx-auto">
            Halaman Manajemen Admin dikhususkan bagi <strong>Super Admin</strong>. Akun Anda ({currentUser?.role || 'Pengguna'}) tidak memiliki izin untuk mengelola administrator.
          </p>
        </div>
        <button
          onClick={onBackToDashboard}
          className="btn-base btn-primary text-[13px] h-10 px-5"
        >
          <ArrowLeft size={14} />
          <span>Kembali ke Dashboard Utama</span>
        </button>
      </div>
    );
  }

  // ── State Management ──
  const [admins, setAdmins] = useState(initialAdmins);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [sortBy, setSortBy] = useState('terbaru');

  // Modals & Panels
  const [selectedAdmin, setSelectedAdmin] = useState(null); // For detail side panel
  const [activityTab, setActivityTab] = useState('semua');
  const [activitySearch, setActivitySearch] = useState('');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddConfirming, setIsAddConfirming] = useState(false);
  const [newAdminForm, setNewAdminForm] = useState({
    nama: '',
    email: '',
    password: '',
    status: 'Aktif',
    role: 'Admin',
  });

  const [editingAdmin, setEditingAdmin] = useState(null);
  const [deactivatingAdmin, setDeactivatingAdmin] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // ── Stats Calculation ──
  const totalAdmin = admins.length;
  const adminAktif = admins.filter(a => a.status === 'Aktif').length;
  const sedangBertugas = admins.filter(a => a.operasional === 'Sedang Bertugas').length;
  const offlineCount = admins.filter(a => a.operasional === 'Offline').length;

  // ── Filtered & Sorted Admins ──
  const filteredAdmins = admins.filter(a => {
    const matchStatus =
      statusFilter === 'Semua' ? true :
      statusFilter === 'Aktif' ? a.status === 'Aktif' :
      statusFilter === 'Sedang Bertugas' ? a.operasional === 'Sedang Bertugas' :
      statusFilter === 'Offline' ? a.operasional === 'Offline' :
      statusFilter === 'Nonaktif' ? a.status === 'Nonaktif' : true;

    const q = searchQuery.toLowerCase();
    const matchSearch = !q ||
      a.nama.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q) ||
      a.id.toLowerCase().includes(q);

    return matchStatus && matchSearch;
  }).sort((a, b) => {
    if (sortBy === 'nama') return a.nama.localeCompare(b.nama);
    if (sortBy === 'kasus') return b.kasusDitangani - a.kasusDitangani;
    return a.id.localeCompare(b.id);
  });

  // ── Handler: Create Admin ──
  const handleCreateAdmin = (e) => {
    e.preventDefault();
    if (!newAdminForm.nama || !newAdminForm.email) return;

    if (!isAddConfirming) {
      setIsAddConfirming(true);
      return;
    }

    const newId = `ADM-0${admins.length + 1}`;
    const initials = newAdminForm.nama.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    const newEntry = {
      id: newId,
      nama: newAdminForm.nama,
      email: newAdminForm.email,
      role: 'Admin', // Locked to Admin
      status: newAdminForm.status,
      operasional: 'Offline',
      kasusDitangani: 0,
      kasusSelesai: 0,
      kasusAktif: 0,
      avgResponse: '—',
      kasusMingguIni: 0,
      terakhirAktif: 'Baru dibuat',
      lastLogin: 'Belum pernah login',
      tanggalDibuat: '10 Sep 2026',
      dibuatOleh: currentUser.nama,
      avatar: initials,
      avatarBg: 'bg-[#2563eb]',
      activeCases: [],
    };

    setAdmins([newEntry, ...admins]);
    setIsAddModalOpen(false);
    setIsAddConfirming(false);
    setNewAdminForm({ nama: '', email: '', password: '', status: 'Aktif', role: 'Admin' });
    showToast(`Akun Admin "${newEntry.nama}" berhasil dibuat.`);
  };

  // ── Handler: Edit Admin ──
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingAdmin) return;

    setAdmins(admins.map(a => a.id === editingAdmin.id ? { ...a, nama: editingAdmin.nama, email: editingAdmin.email, status: editingAdmin.status } : a));
    if (selectedAdmin?.id === editingAdmin.id) {
      setSelectedAdmin({ ...selectedAdmin, ...editingAdmin });
    }
    setEditingAdmin(null);
    showToast(`Data Admin "${editingAdmin.nama}" berhasil diperbarui.`);
  };

  // ── Handler: Toggle Nonaktifkan ──
  const handleConfirmDeactivate = () => {
    if (!deactivatingAdmin) return;
    const isNowNonaktif = deactivatingAdmin.status === 'Aktif';
    const updatedStatus = isNowNonaktif ? 'Nonaktif' : 'Aktif';
    const updatedOperasional = isNowNonaktif ? 'Tidak Aktif' : 'Offline';

    setAdmins(admins.map(a => a.id === deactivatingAdmin.id ? {
      ...a,
      status: updatedStatus,
      operasional: updatedOperasional
    } : a));

    if (selectedAdmin?.id === deactivatingAdmin.id) {
      setSelectedAdmin({ ...selectedAdmin, status: updatedStatus, operasional: updatedOperasional });
    }

    showToast(`Akun "${deactivatingAdmin.nama}" telah di-${updatedStatus.toLowerCase()}kan.`);
    setDeactivatingAdmin(null);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1680px] w-full mx-auto relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-[#0a271f] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 z-50 animate-fade-in border border-[#143d32]">
          <CheckCircle2 size={16} className="text-[#34d399]" />
          <span className="text-[13px] font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-black uppercase tracking-wider border border-emerald-200">
              Khusus Super Admin
            </span>
          </div>
          <h1 className="text-[26px] font-black text-slate-900 tracking-tight leading-tight mt-1">
            Manajemen Admin
          </h1>
          <p className="text-[14px] text-slate-500 mt-1 font-medium">
            Kelola akun administrator dan pantau aktivitas operasional mereka secara terpusat.
          </p>
        </div>

        {/* Action Button: + Tambah Admin */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setIsAddModalOpen(true);
              setIsAddConfirming(false);
            }}
            className="btn-base btn-primary text-[13px] h-10 px-4"
          >
            <UserPlus size={15} />
            <span>+ Tambah Admin</span>
          </button>
        </div>
      </div>

      {/* ── Summary Cards (4 Cards) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <div className="bg-white border border-[#eaedf1] rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[13px] font-semibold text-slate-500">Total Admin</p>
            <p className="text-[30px] font-black text-slate-900 leading-none mt-2">{totalAdmin}</p>
            <p className="text-[12px] text-slate-400 mt-2 font-medium">12 Admin terdaftar</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600">
            <Users size={22} />
          </div>
        </div>

        <div className="bg-white border border-[#eaedf1] rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[13px] font-semibold text-slate-500">Admin Aktif</p>
            <p className="text-[30px] font-black text-slate-900 leading-none mt-2">{adminAktif}</p>
            <p className="text-[12px] text-emerald-600 mt-2 font-semibold">● 10 Akun siap bertugas</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#ecfdf5] flex items-center justify-center text-[#10b981]">
            <UserCheck size={22} />
          </div>
        </div>

        <div className="bg-white border border-[#eaedf1] rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[13px] font-semibold text-slate-500">Sedang Bertugas</p>
            <p className="text-[30px] font-black text-slate-900 leading-none mt-2">{sedangBertugas}</p>
            <p className="text-[12px] text-blue-600 mt-2 font-semibold">24 kasus sedang ditangani</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#eff6ff] flex items-center justify-center text-[#3b82f6]">
            <Activity size={22} />
          </div>
        </div>

        <div className="bg-white border border-[#eaedf1] rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[13px] font-semibold text-slate-500">Offline</p>
            <p className="text-[30px] font-black text-slate-900 leading-none mt-2">{offlineCount}</p>
            <p className="text-[12px] text-slate-400 mt-2 font-medium">2 Admin tidak terhubung</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
            <Clock size={22} />
          </div>
        </div>
      </div>

      {/* ── Operational Overview Bar ── */}
      <div className="bg-white border border-[#eaedf1] rounded-2xl p-4 shadow-xs flex items-center justify-between gap-4 text-[12px] text-slate-600 flex-wrap">
        <div className="flex items-center gap-2">
          <Activity size={15} className="text-emerald-600" />
          <span className="font-bold text-slate-800">Aktivitas Hari Ini:</span>
          <span>{totalAdmin} Admin terdaftar · {adminAktif} Aktif · {sedangBertugas} Sedang menangani kasus · 24 kasus diproses · 21 selesai hari ini</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-emerald-700">Audit Logging Terenkripsi Aktif</span>
        </div>
      </div>

      {/* ── Action & Filter Bar ── */}
      <div className="bg-white border border-[#eaedf1] rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari nama, email, ID admin..."
            className="w-full h-9 pl-9 pr-4 bg-[#f8fafc] border border-slate-200 rounded-xl text-[13px] font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-emerald-600 transition-all"
          />
        </div>

        {/* Filter and Sort Dropdowns */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 bg-[#f8fafc] border border-slate-200 rounded-xl px-3 h-9 text-[12px] font-semibold text-slate-600">
            <Filter size={13} className="text-slate-400" />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-transparent border-none outline-none cursor-pointer"
            >
              <option value="Semua">Semua Status</option>
              <option value="Aktif">Aktif</option>
              <option value="Sedang Bertugas">Sedang Bertugas</option>
              <option value="Offline">Offline</option>
              <option value="Nonaktif">Nonaktif</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-[#f8fafc] border border-slate-200 rounded-xl px-3 h-9 text-[12px] font-semibold text-slate-600">
            <ArrowUpDown size={13} className="text-slate-400" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="bg-transparent border-none outline-none cursor-pointer"
            >
              <option value="terbaru">Terbaru</option>
              <option value="nama">Nama (A-Z)</option>
              <option value="kasus">Kasus Terbanyak</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Admin Table (Desktop) & Cards (Mobile) ── */}
      <div className="bg-white border border-[#eaedf1] rounded-2xl overflow-hidden shadow-xs">
        {/* Desktop Table */}
        <div className="hidden md:block table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Admin</th>
                <th>Status Operasional</th>
                <th>Kasus Ditangani</th>
                <th>Kasus Aktif</th>
                <th>Terakhir Aktif</th>
                <th>Last Login</th>
                <th>Status Akun</th>
                <th className="text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdmins.map(adm => {
                const isOnline = adm.operasional === 'Online';
                const isBusy = adm.operasional === 'Sedang Bertugas';
                const isOffline = adm.operasional === 'Offline';
                const isNonaktif = adm.status === 'Nonaktif';

                return (
                  <tr key={adm.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Admin Profile */}
                    <td>
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs text-white flex-shrink-0 shadow-xs ${adm.avatarBg}`}>
                          {adm.avatar}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="font-bold text-slate-900 text-[13px] leading-tight">{adm.nama}</p>
                            {adm.role === 'Super Admin' && (
                              <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-violet-100 text-violet-700">
                                Super
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">{adm.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Status Operasional */}
                    <td>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        isBusy ? 'bg-[#eff6ff] text-[#2563eb] border border-blue-200' :
                        isOnline ? 'bg-[#ecfdf5] text-[#059669] border border-emerald-200' :
                        isOffline ? 'bg-[#f8fafc] text-slate-500 border border-slate-200' :
                        'bg-red-50 text-red-600 border border-red-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          isBusy ? 'bg-[#2563eb] animate-pulse' :
                          isOnline ? 'bg-[#059669]' :
                          isOffline ? 'bg-slate-400' : 'bg-red-500'
                        }`} />
                        <span>{adm.operasional}</span>
                      </span>
                    </td>

                    {/* Kasus Ditangani */}
                    <td>
                      <span className="font-bold text-slate-800 text-[13px]">{adm.kasusDitangani}</span>
                    </td>

                    {/* Kasus Aktif */}
                    <td>
                      <span className={`font-black text-[13px] ${adm.kasusAktif > 0 ? 'text-[#ef4444]' : 'text-slate-400'}`}>
                        {adm.kasusAktif}
                      </span>
                    </td>

                    {/* Terakhir Aktif */}
                    <td>
                      <span className="text-slate-500 text-[12px]">{adm.terakhirAktif}</span>
                    </td>

                    {/* Last Login */}
                    <td>
                      <span className="text-slate-400 text-[11px] font-medium">{adm.lastLogin}</span>
                    </td>

                    {/* Status Akun */}
                    <td>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        adm.status === 'Aktif' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                      }`}>
                        {adm.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedAdmin(adm)}
                          className="btn-base btn-primary text-[11px] py-1 px-2.5 h-7 rounded-lg"
                          title="Lihat Detail & Aktivitas"
                        >
                          <Eye size={12} />
                          <span>Detail</span>
                        </button>

                        <button
                          onClick={() => setEditingAdmin({ ...adm })}
                          className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                          title="Edit Data Admin"
                        >
                          <Edit2 size={12} />
                        </button>

                        {adm.role !== 'Super Admin' && (
                          <button
                            onClick={() => setDeactivatingAdmin(adm)}
                            className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-colors cursor-pointer ${
                              adm.status === 'Aktif'
                                ? 'border-red-200 text-red-600 hover:bg-red-50'
                                : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                            }`}
                            title={adm.status === 'Aktif' ? 'Nonaktifkan Akun' : 'Aktifkan Akun'}
                          >
                            {adm.status === 'Aktif' ? <UserX size={12} /> : <UserCheck size={12} />}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Card List (Section 15: Responsive without horizontal overflow) */}
        <div className="md:hidden divide-y divide-slate-100 p-4 space-y-3">
          {filteredAdmins.map(adm => (
            <div key={adm.id} className="pt-3 first:pt-0 bg-[#f8fafc] p-4 rounded-xl border border-slate-200">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs text-white ${adm.avatarBg}`}>
                    {adm.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-[14px]">{adm.nama}</p>
                    <p className="text-[11px] text-slate-400">{adm.email} · {adm.role}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  adm.operasional === 'Sedang Bertugas' ? 'bg-blue-100 text-blue-700' :
                  adm.operasional === 'Online' ? 'bg-emerald-100 text-emerald-700' :
                  'bg-slate-200 text-slate-600'
                }`}>
                  {adm.operasional}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-slate-200 text-[12px] text-slate-600">
                <div>
                  <span className="text-slate-400 text-[11px]">Kasus Aktif: </span>
                  <strong className={adm.kasusAktif > 0 ? 'text-red-600' : 'text-slate-700'}>{adm.kasusAktif}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px]">Ditangani: </span>
                  <strong>{adm.kasusDitangani}</strong>
                </div>
                <div className="col-span-2 text-[11px] text-slate-400">
                  Aktif: {adm.terakhirAktif}
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={() => setSelectedAdmin(adm)}
                  className="btn-base btn-primary text-[12px] py-1.5 flex-1"
                >
                  <Eye size={13} />
                  <span>Lihat Detail</span>
                </button>
                <button
                  onClick={() => setEditingAdmin({ ...adm })}
                  className="btn-base btn-secondary text-[12px] py-1.5 px-3"
                >
                  <Edit2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredAdmins.length === 0 && (
          <div className="p-12 text-center text-slate-400">
            <p className="font-semibold text-[14px]">Tidak ditemukan administrator sesuai filter pencarian.</p>
          </div>
        )}
      </div>

      {/* ── 5. ADMIN DETAIL DRAWER / MODAL ── */}
      {selectedAdmin && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-xs transition-opacity"
            onClick={() => setSelectedAdmin(null)}
          />
          <div className="fixed inset-y-0 right-0 w-full max-w-[560px] bg-white z-50 shadow-2xl flex flex-col overflow-y-auto animate-fade-in border-l border-[#eaedf1]">
            {/* Drawer Header */}
            <div className="p-5 border-b border-[#f1f5f9] flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-xs z-10">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white ${selectedAdmin.avatarBg}`}>
                  {selectedAdmin.avatar}
                </div>
                <div>
                  <h2 className="text-[16px] font-bold text-slate-900 leading-tight">{selectedAdmin.nama}</h2>
                  <p className="text-[12px] text-slate-400 mt-0.5">{selectedAdmin.email} · {selectedAdmin.role}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAdmin(null)}
                className="w-8 h-8 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Drawer Body Content */}
            <div className="p-6 space-y-6 flex-1">
              {/* Profile Card */}
              <div className="bg-[#f8fafc] border border-slate-200 rounded-2xl p-4 space-y-3">
                <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-wider">Data Akun & Kredensial</h3>
                <div className="grid grid-cols-2 gap-3 text-[12px]">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Status Akun</span>
                    <span className="font-bold text-emerald-600">{selectedAdmin.status}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Kondisi Operasional</span>
                    <span className="font-bold text-blue-600">{selectedAdmin.operasional}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Tanggal Dibuat</span>
                    <span className="font-semibold text-slate-700">{selectedAdmin.tanggalDibuat}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Dibuat Oleh</span>
                    <span className="font-semibold text-slate-700">{selectedAdmin.dibuatOleh}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 block text-[11px]">Terakhir Login</span>
                    <span className="font-semibold text-slate-700">{selectedAdmin.lastLogin}</span>
                  </div>
                </div>
              </div>

              {/* ── 9. Case Assignment Monitoring ── */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-[14px] font-bold text-slate-900">Kasus Aktif yang Sedang Ditangani</h3>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                    {selectedAdmin.kasusAktif} Kasus
                  </span>
                </div>

                {selectedAdmin.activeCases && selectedAdmin.activeCases.length > 0 ? (
                  <div className="space-y-3">
                    {selectedAdmin.activeCases.map(caseId => {
                      const caseItem = sosCases.find(c => c.id === caseId) || sosCases[0];
                      return (
                        <div key={caseId} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-2.5">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-emerald-600 text-[12px]">{caseItem.id}</span>
                                <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-red-500 text-white">
                                  {caseItem.tagType}
                                </span>
                              </div>
                              <p className="text-[13px] font-bold text-slate-900 mt-1">{caseItem.kategori}</p>
                            </div>
                            <span className="text-[11px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                              {caseItem.prioritas}
                            </span>
                          </div>

                          <div className="text-[12px] text-slate-500 space-y-1">
                            <p>Relawan: <strong className="text-slate-700">{caseItem.relawan?.nama || 'Dwi Riskianto'}</strong></p>
                            <p>Estimasi Waktu: <strong className="text-emerald-600">{caseItem.eta || 'ETA 8 menit'}</strong></p>
                          </div>

                          <div className="pt-2 border-t border-slate-100 flex justify-end">
                            <button
                              onClick={() => {
                                setSelectedAdmin(null);
                                onOpenDetail?.(caseItem.id);
                              }}
                              className="text-[12px] font-bold text-emerald-600 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                            >
                              <span>Lihat Kasus Lengkap</span>
                              <span>→</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-[12px] text-slate-500 text-center">
                    Tidak ada kasus aktif yang sedang ditangani saat ini.
                  </div>
                )}
              </div>

              {/* ── 7. Performance Admin (Compact Statistics) ── */}
              <div className="space-y-3">
                <h3 className="text-[14px] font-bold text-slate-900">Performa Penanganan</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="bg-[#f8fafc] p-3 rounded-xl border border-slate-200 text-center">
                    <p className="text-[11px] text-slate-400 font-semibold">Kasus Ditangani</p>
                    <p className="text-[18px] font-black text-slate-900 mt-1">{selectedAdmin.kasusDitangani}</p>
                  </div>
                  <div className="bg-[#f8fafc] p-3 rounded-xl border border-slate-200 text-center">
                    <p className="text-[11px] text-slate-400 font-semibold">Kasus Selesai</p>
                    <p className="text-[18px] font-black text-emerald-600 mt-1">{selectedAdmin.kasusSelesai}</p>
                  </div>
                  <div className="bg-[#f8fafc] p-3 rounded-xl border border-slate-200 text-center">
                    <p className="text-[11px] text-slate-400 font-semibold">Rata-rata Respons</p>
                    <p className="text-[18px] font-black text-blue-600 mt-1">{selectedAdmin.avgResponse}</p>
                  </div>
                  <div className="bg-[#f8fafc] p-3 rounded-xl border border-slate-200 text-center col-span-2 sm:col-span-3">
                    <p className="text-[11px] text-slate-400 font-semibold">Kasus Ditangani Minggu Ini</p>
                    <p className="text-[20px] font-black text-slate-900 mt-0.5">{selectedAdmin.kasusMingguIni}</p>
                  </div>
                </div>
              </div>

              {/* ── 6 & 13. Aktivitas Admin (Activity Timeline & Filter) ── */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-[14px] font-bold text-slate-900">Aktivitas Admin</h3>
                  <span className="text-[11px] text-slate-400">Linimasa Log</span>
                </div>

                {/* Filter Tabs for Activity */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px]">
                  {['semua', 'login', 'kasus', 'penugasan', 'status', 'logout'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActivityTab(tab)}
                      className={`px-2.5 py-1 rounded-lg font-bold capitalize transition-colors whitespace-nowrap cursor-pointer ${
                        activityTab === tab
                          ? 'bg-[#0a271f] text-white'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Timeline list */}
                <div className="space-y-2.5 pt-2">
                  {adminActivityLogs
                    .filter(log => activityTab === 'semua' || log.type === activityTab)
                    .map(log => (
                      <div key={log.id} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0 text-[12px]">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-800">{log.time}</span>
                            <span className="text-[10px] font-bold uppercase px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                              {log.type}
                            </span>
                          </div>
                          <p className="text-slate-600 mt-0.5">{log.text}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-[#eaedf1] bg-slate-50 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  setEditingAdmin({ ...selectedAdmin });
                }}
                className="btn-base btn-secondary text-[12px] flex-1"
              >
                <Edit2 size={13} />
                <span>Edit Admin</span>
              </button>

              {selectedAdmin.role !== 'Super Admin' && (
                <button
                  onClick={() => {
                    setDeactivatingAdmin(selectedAdmin);
                  }}
                  className={`btn-base text-[12px] flex-1 ${
                    selectedAdmin.status === 'Aktif'
                      ? 'btn-danger'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                >
                  {selectedAdmin.status === 'Aktif' ? 'Nonaktifkan' : 'Aktifkan Kembali'}
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {/* ── 10. TAMBAH ADMIN MODAL ── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#eaedf1] space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-[17px] font-bold text-slate-900">
                {isAddConfirming ? 'Konfirmasi Pembuatan Akun' : 'Tambah Admin Baru'}
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-800"
              >
                <X size={16} />
              </button>
            </div>

            {isAddConfirming ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[13px] space-y-2">
                  <p className="font-bold flex items-center gap-1.5">
                    <AlertTriangle size={15} className="text-amber-600" />
                    <span>Apakah Anda yakin ingin membuat akun Admin ini?</span>
                  </p>
                  <p className="text-slate-600 text-[12px]">
                    Akun baru akan diberikan kredensial peran <strong>Admin</strong> dan dapat login langsung ke dashboard untuk menangani kasus darurat.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl text-[12px] space-y-1">
                  <p><strong>Nama:</strong> {newAdminForm.nama}</p>
                  <p><strong>Email:</strong> {newAdminForm.email}</p>
                  <p><strong>Role:</strong> ADMIN (Tetap & Terkunci)</p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddConfirming(false)}
                    className="btn-base btn-secondary"
                  >
                    Kembali
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateAdmin}
                    className="btn-base btn-primary"
                  >
                    Ya, Buat Akun Admin
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreateAdmin} className="space-y-4">
                <div>
                  <label className="form-label">Nama Lengkap Administrator</label>
                  <input
                    type="text"
                    required
                    value={newAdminForm.nama}
                    onChange={e => setNewAdminForm({ ...newAdminForm, nama: e.target.value })}
                    placeholder="Contoh: Rian Pratama"
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label">Email Administrator</label>
                  <input
                    type="email"
                    required
                    value={newAdminForm.email}
                    onChange={e => setNewAdminForm({ ...newAdminForm, email: e.target.value })}
                    placeholder="admin@sahabatsos.id"
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label">Kata Sandi / Kredensial Sementara</label>
                  <input
                    type="password"
                    required
                    value={newAdminForm.password}
                    onChange={e => setNewAdminForm({ ...newAdminForm, password: e.target.value })}
                    placeholder="Minimal 8 karakter..."
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label">Role Akses (Terkunci)</label>
                  <input
                    type="text"
                    value="ADMIN (Otoritas Terbatas)"
                    disabled
                    className="form-input bg-slate-100 text-slate-500 cursor-not-allowed font-semibold"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Akun baru otomatis berstatus <strong>ADMIN</strong> dan tidak dapat ditingkatkan ke Super Admin melalui formulir ini.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="btn-base btn-secondary"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="btn-base btn-primary"
                  >
                    Lanjutkan Konfirmasi
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── 11. EDIT ADMIN MODAL ── */}
      {editingAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#eaedf1] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-[17px] font-bold text-slate-900">Edit Data Administrator</h2>
              <button
                onClick={() => setEditingAdmin(null)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-800"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="form-label">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={editingAdmin.nama}
                  onChange={e => setEditingAdmin({ ...editingAdmin, nama: e.target.value })}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">Email Administrator</label>
                <input
                  type="email"
                  required
                  value={editingAdmin.email}
                  onChange={e => setEditingAdmin({ ...editingAdmin, email: e.target.value })}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">Status Akun</label>
                <select
                  value={editingAdmin.status}
                  onChange={e => setEditingAdmin({ ...editingAdmin, status: e.target.value })}
                  className="form-input cursor-pointer"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Nonaktif">Nonaktif</option>
                </select>
              </div>

              <div>
                <label className="form-label">Role Akses</label>
                <input
                  type="text"
                  value={editingAdmin.role}
                  disabled
                  className="form-input bg-slate-100 text-slate-500 cursor-not-allowed"
                />
                <p className="text-[11px] text-slate-400 mt-1">Peran Super Admin tidak dapat diubah dari form biasa.</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingAdmin(null)}
                  className="btn-base btn-secondary"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn-base btn-primary"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── 12. NONAKTIFKAN ADMIN CONFIRMATION MODAL ── */}
      {deactivatingAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#eaedf1] space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
              <AlertTriangle size={24} />
            </div>

            <div>
              <h2 className="text-[17px] font-black text-slate-900">
                {deactivatingAdmin.status === 'Aktif'
                  ? 'Nonaktifkan Akun Admin ini?'
                  : 'Aktifkan Kembali Akun Admin ini?'}
              </h2>
              <p className="text-[13px] text-slate-600 mt-2">
                {deactivatingAdmin.status === 'Aktif'
                  ? 'Admin tidak akan dapat login atau menangani kasus darurat setelah dinonaktifkan.'
                  : 'Admin akan kembali dapat login dan menerima penugasan kasus darurat.'}
              </p>
              <div className="p-3 bg-slate-50 rounded-xl mt-3 text-[12px] text-slate-700">
                <p><strong>Admin:</strong> {deactivatingAdmin.nama}</p>
                <p><strong>Email:</strong> {deactivatingAdmin.email}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeactivatingAdmin(null)}
                className="btn-base btn-secondary"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDeactivate}
                className={`btn-base ${deactivatingAdmin.status === 'Aktif' ? 'btn-danger' : 'btn-primary'}`}
              >
                {deactivatingAdmin.status === 'Aktif' ? 'Nonaktifkan Akun' : 'Aktifkan Akun'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
