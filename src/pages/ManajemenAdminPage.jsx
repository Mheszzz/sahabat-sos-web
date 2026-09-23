import { useState, useEffect } from 'react';
import {
  Users, UserPlus, Search, Filter, ArrowUpDown, Eye, Edit2, UserX,
  UserCheck, Shield, CheckCircle, Clock, Activity, AlertTriangle,
  X, CheckCircle2, Lock, ArrowLeft
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Badge from '../components/Badge';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { adminService } from '../services/adminService';

const avatarColors = ['bg-blue-600', 'bg-emerald-600', 'bg-amber-500', 'bg-purple-600', 'bg-pink-600'];

function StatSummary({ label, value, color = 'var(--color-text)', icon: Icon }) {
  return (
    <div className="card-base p-4 flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-muted)' }}>
        <Icon size={17} />
      </div>
      <div>
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 500 }}>{label}</p>
        <p style={{ fontSize: 22, fontWeight: 700, color, lineHeight: 1.2, marginTop: 2 }}>{value}</p>
      </div>
    </div>
  );
}

const availablePermissions = [
  { key: 'verifikasi_relawan', label: 'Verifikasi Relawan' },
  { key: 'kelola_laporan',     label: 'Kelola Laporan Darurat' },
];

export default function ManajemenAdminPage({ currentUser, onOpenDetail, onBackToDashboard }) {
  const isSuperAdmin = currentUser?.role === 'Super Admin' || currentUser?.role === 'superadmin';

  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [sortBy, setSortBy] = useState('terbaru');

  // Modals
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddConfirming, setIsAddConfirming] = useState(false);
  const [newAdminForm, setNewAdminForm] = useState({ nama: '', email: '', password: '' });
  const [managingAdmin, setManagingAdmin] = useState(null);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [revokingAdmin, setRevokingAdmin] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const fetchAdmins = async () => {
    try {
      setIsLoading(true);
      const res = await adminService.getAdmins();
      if (res && res.data) {
        setAdmins(res.data.map((a, idx) => ({
          id: String(a.id),
          nama: a.name,
          email: a.email,
          role: a.role === 'superadmin' ? 'Super Admin' : 'Admin',
          status: a.status_verifikasi === 'terverifikasi' ? 'Aktif' : 'Nonaktif',
          tanggalDibuat: a.created_at ? new Date(a.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Baru saja',
          dibuatOleh: a.granted_by?.name || 'Superadmin',
          avatar: a.name ? a.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : 'AD',
          avatarBg: avatarColors[idx % avatarColors.length],
          permissions: a.permissions || [],
        })));
      }
    } catch (err) {
      console.error('Gagal mengambil data admin:', err);
      showToast('Gagal memuat data admin.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchAdmins(); }, []);

  if (!isSuperAdmin) {
    return (
      <div className="page-shell flex flex-col items-center justify-center text-center gap-5" style={{ minHeight: 400 }}>
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'var(--color-danger-light)', color: 'var(--color-danger)' }}>
          <Lock size={28} />
        </div>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-text)' }}>403 — Akses Ditolak</h1>
          <p style={{ fontSize: 13.5, color: 'var(--color-text-muted)', marginTop: 6 }}>
            Halaman ini hanya untuk <strong>Super Admin</strong>.
          </p>
        </div>
        <button onClick={onBackToDashboard} className="btn-base btn-primary">
          <ArrowLeft size={14} /> Kembali ke Dashboard
        </button>
      </div>
    );
  }

  const totalAdmin  = admins.length;
  const adminAktif  = admins.filter(a => a.status === 'Aktif').length;
  const superAdmins = admins.filter(a => a.role === 'Super Admin').length;

  const filtered = admins.filter(a => {
    const matchStatus = statusFilter === 'Semua' ? true : a.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || a.nama.toLowerCase().includes(q) || a.email.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  }).sort((a, b) => {
    if (sortBy === 'nama') return a.nama.localeCompare(b.nama);
    return a.id.localeCompare(b.id);
  });

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    if (!newAdminForm.nama || !newAdminForm.email || !newAdminForm.password) return;
    if (!isAddConfirming) { setIsAddConfirming(true); return; }
    try {
      await adminService.createAdmin({ name: newAdminForm.nama, email: newAdminForm.email, password: newAdminForm.password });
      setIsAddModalOpen(false);
      setIsAddConfirming(false);
      setNewAdminForm({ nama: '', email: '', password: '' });
      showToast(`Akun Admin "${newAdminForm.nama}" berhasil dibuat.`);
      fetchAdmins();
    } catch (err) {
      showToast(err.response?.data?.message || 'Gagal membuat admin.');
    }
  };

  const handleSavePermissions = async (e) => {
    e.preventDefault();
    if (!managingAdmin) return;
    try {
      await adminService.updateAdminPermissions(managingAdmin.id, selectedPermissions);
      setManagingAdmin(null);
      showToast(`Hak akses "${managingAdmin.nama}" berhasil diperbarui.`);
      fetchAdmins();
    } catch (err) {
      showToast(err.response?.data?.message || 'Gagal menyimpan hak akses.');
    }
  };

  const handleRevokePermissions = async () => {
    if (!revokingAdmin) return;
    try {
      await adminService.revokeAdminPermissions(revokingAdmin.id);
      setRevokingAdmin(null);
      showToast(`Hak akses "${revokingAdmin.nama}" berhasil dicabut.`);
      fetchAdmins();
    } catch (err) {
      showToast(err.response?.data?.message || 'Gagal mencabut hak akses.');
    }
  };

  return (
    <div className="page-shell space-y-5">

      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 flex items-center gap-2.5 rounded-xl px-4 py-3 shadow-xl z-50 animate-fade-in"
          style={{ background: 'var(--nav-bg)', color: 'white', border: '1px solid rgba(255,255,255,0.08)' }}>
          <CheckCircle2 size={15} style={{ color: '#34D399', flexShrink: 0 }} />
          <span style={{ fontSize: 13, fontWeight: 600 }}>{toastMsg}</span>
        </div>
      )}

      <PageHeader
        title="Manajemen Admin"
        description="Kelola akun administrator dan pantau aktivitas operasional mereka."
        actions={
          <button onClick={() => { setIsAddModalOpen(true); setIsAddConfirming(false); }} className="btn-base btn-primary">
            <UserPlus size={14} /> Tambah Admin
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <StatSummary label="Total Admin" value={totalAdmin} icon={Users} />
        <StatSummary label="Akun Aktif" value={adminAktif} color="var(--color-success)" icon={UserCheck} />
        <StatSummary label="Super Admin" value={superAdmins} color="var(--color-info)" icon={Shield} />
      </div>

      {/* Toolbar */}
      <div className="card-base p-4 flex flex-col md:flex-row md:items-center gap-3 md:justify-between">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari nama atau email admin..."
            className="form-input"
            style={{ paddingLeft: 36, width: 280 }}
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-xl px-3"
            style={{ height: 40, border: '1px solid var(--color-border)', background: 'var(--color-surface-2)', fontSize: 12.5, fontWeight: 600, color: 'var(--color-text-secondary)' }}>
            <Filter size={13} className="text-slate-400" />
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 'inherit', color: 'inherit', cursor: 'pointer' }}>
              <option value="Semua">Semua Status</option>
              <option value="Aktif">Aktif</option>
              <option value="Nonaktif">Nonaktif</option>
            </select>
          </div>
          <div className="flex items-center gap-2 rounded-xl px-3"
            style={{ height: 40, border: '1px solid var(--color-border)', background: 'var(--color-surface-2)', fontSize: 12.5, fontWeight: 600, color: 'var(--color-text-secondary)' }}>
            <ArrowUpDown size={13} className="text-slate-400" />
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 'inherit', color: 'inherit', cursor: 'pointer' }}>
              <option value="terbaru">Terbaru</option>
              <option value="nama">Nama (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card-base overflow-hidden">
        {isLoading ? (
          <LoadingSpinner text="Memuat data admin..." />
        ) : filtered.length === 0 ? (
          <EmptyState icon={Users} title="Tidak ada admin ditemukan" description="Coba ubah filter atau kata kunci pencarian." />
        ) : (
          <>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Administrator</th>
                    <th>Role</th>
                    <th>Status Akun</th>
                    <th>Dibuat</th>
                    <th>Dibuat Oleh</th>
                    <th style={{ textAlign: 'right' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(adm => (
                    <tr key={adm.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white flex-shrink-0 ${adm.avatarBg}`}>
                            {adm.avatar}
                          </div>
                          <div>
                            <p style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--color-text)' }}>{adm.nama}</p>
                            <p style={{ fontSize: 11.5, color: 'var(--color-text-muted)', marginTop: 1 }}>{adm.email}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        {adm.role === 'Super Admin' ? (
                          <span className="badge" style={{ background: '#EDE9FE', color: '#7C3AED' }}>Super Admin</span>
                        ) : (
                          <span className="badge badge-slate">Admin</span>
                        )}
                      </td>
                      <td><Badge variant={adm.status} /></td>
                      <td><span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{adm.tanggalDibuat}</span></td>
                      <td><span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{adm.dibuatOleh}</span></td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button onClick={() => setSelectedAdmin(adm)} className="btn-base btn-primary" style={{ height: 32, padding: '0 10px', fontSize: 12 }}>
                            <Eye size={12} /> Detail
                          </button>
                          <button onClick={() => { setManagingAdmin(adm); setSelectedPermissions(adm.permissions || []); }} className="btn-icon" style={{ width: 32, height: 32 }} title="Kelola Hak Akses">
                            <Edit2 size={12} />
                          </button>
                          {adm.role !== 'Super Admin' && (
                            <button onClick={() => setRevokingAdmin(adm)} className="btn-icon" style={{ width: 32, height: 32, border: '1px solid var(--color-danger-border)', color: 'var(--color-danger)' }} title="Cabut Hak Akses">
                              <UserX size={12} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3" style={{ borderTop: '1px solid var(--color-border-soft)' }}>
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                Menampilkan {filtered.length} dari {totalAdmin} administrator
              </span>
            </div>
          </>
        )}
      </div>

      {/* ── DRAWER: Detail Admin ── */}
      {selectedAdmin && (
        <>
          <div className="drawer-backdrop" onClick={() => setSelectedAdmin(null)} />
          <div className="drawer-panel">
            <div className="flex items-center justify-between px-5 py-4 flex-shrink-0" style={{ borderBottom: '1px solid var(--color-border)' }}>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-white ${selectedAdmin.avatarBg}`}>
                  {selectedAdmin.avatar}
                </div>
                <div>
                  <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text)' }}>{selectedAdmin.nama}</h2>
                  <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>{selectedAdmin.email} · {selectedAdmin.role}</p>
                </div>
              </div>
              <button onClick={() => setSelectedAdmin(null)} className="btn-icon">
                <X size={15} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              <div className="rounded-xl p-4 space-y-4" style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
                <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--color-text-muted)' }}>Data Akun</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Status Akun</p>
                    <Badge variant={selectedAdmin.status} />
                  </div>
                  <div>
                    <p style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Role</p>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)', marginTop: 3 }}>{selectedAdmin.role}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Tanggal Dibuat</p>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)', marginTop: 3 }}>{selectedAdmin.tanggalDibuat}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Dibuat Oleh</p>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)', marginTop: 3 }}>{selectedAdmin.dibuatOleh}</p>
                  </div>
                </div>
              </div>

              {selectedAdmin.permissions?.length > 0 && (
                <div>
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text)', marginBottom: 10 }}>Hak Akses</h3>
                  <div className="space-y-2">
                    {selectedAdmin.permissions.map(p => (
                      <div key={p} className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: 'var(--color-success-light)', border: '1px solid var(--color-success-border)' }}>
                        <CheckCircle size={13} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
                        <span style={{ fontSize: 13, color: 'var(--color-success)', fontWeight: 600 }}>
                          {availablePermissions.find(ap => ap.key === p)?.label || p}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* ── MODAL: Tambah Admin ── */}
      {isAddModalOpen && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setIsAddModalOpen(false)}>
          <div className="modal-box p-6">
            <div className="flex items-center justify-between pb-4 mb-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text)' }}>
                {isAddConfirming ? 'Konfirmasi Pembuatan' : 'Tambah Admin Baru'}
              </h2>
              <button onClick={() => setIsAddModalOpen(false)} className="btn-icon"><X size={15} /></button>
            </div>

            {isAddConfirming ? (
              <div className="space-y-4">
                <div className="rounded-xl p-4" style={{ background: 'var(--color-warning-light)', border: '1px solid var(--color-warning-border)' }}>
                  <p className="flex items-center gap-2" style={{ fontSize: 13, fontWeight: 700, color: '#92400E' }}>
                    <AlertTriangle size={14} style={{ color: 'var(--color-warning)' }} />
                    Konfirmasi pembuatan akun Admin
                  </p>
                  <p style={{ fontSize: 12.5, color: '#78350F', marginTop: 6 }}>
                    Akun akan diberikan peran <strong>Admin</strong> dan dapat login langsung.
                  </p>
                </div>
                <div className="rounded-xl p-3 space-y-1" style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
                  <p style={{ fontSize: 12.5 }}><strong>Nama:</strong> {newAdminForm.nama}</p>
                  <p style={{ fontSize: 12.5 }}><strong>Email:</strong> {newAdminForm.email}</p>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setIsAddConfirming(false)} className="btn-base btn-secondary">Kembali</button>
                  <button type="button" onClick={handleCreateAdmin} className="btn-base btn-primary">Ya, Buat Akun</button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreateAdmin} className="space-y-4">
                <div>
                  <label className="form-label">Nama Lengkap</label>
                  <input type="text" required value={newAdminForm.nama} onChange={e => setNewAdminForm({ ...newAdminForm, nama: e.target.value })} placeholder="Contoh: Rian Pratama" className="form-input" />
                </div>
                <div>
                  <label className="form-label">Email</label>
                  <input type="email" required value={newAdminForm.email} onChange={e => setNewAdminForm({ ...newAdminForm, email: e.target.value })} placeholder="admin@sahabatsos.id" className="form-input" />
                </div>
                <div>
                  <label className="form-label">Kata Sandi Sementara</label>
                  <input type="password" required value={newAdminForm.password} onChange={e => setNewAdminForm({ ...newAdminForm, password: e.target.value })} placeholder="Minimal 8 karakter" className="form-input" />
                </div>
                <div>
                  <label className="form-label">Role Akses</label>
                  <input type="text" value="ADMIN (Otoritas Terbatas)" disabled className="form-input" />
                  <span className="form-hint">Role tidak dapat diubah melalui formulir ini.</span>
                </div>
                <div className="flex justify-end gap-2 pt-2" style={{ borderTop: '1px solid var(--color-border)' }}>
                  <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn-base btn-secondary">Batal</button>
                  <button type="submit" className="btn-base btn-primary">Lanjutkan</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── MODAL: Kelola Hak Akses ── */}
      {managingAdmin && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setManagingAdmin(null)}>
          <div className="modal-box p-6">
            <div className="flex items-center justify-between pb-4 mb-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text)' }}>Kelola Hak Akses</h2>
              <button onClick={() => setManagingAdmin(null)} className="btn-icon"><X size={15} /></button>
            </div>
            <div className="rounded-xl p-3 mb-4 space-y-1" style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
              <p style={{ fontSize: 13 }}><strong>Admin:</strong> {managingAdmin.nama}</p>
              <p style={{ fontSize: 12.5, color: 'var(--color-text-muted)' }}>{managingAdmin.email}</p>
            </div>
            <form onSubmit={handleSavePermissions} className="space-y-4">
              <div className="space-y-2">
                {availablePermissions.map(perm => (
                  <label key={perm.key} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors" style={{ border: '1px solid var(--color-border)' }}>
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded cursor-pointer accent-teal-700"
                      checked={selectedPermissions.includes(perm.key)}
                      onChange={e => {
                        setSelectedPermissions(e.target.checked
                          ? [...selectedPermissions, perm.key]
                          : selectedPermissions.filter(p => p !== perm.key)
                        );
                      }}
                    />
                    <span style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--color-text)' }}>{perm.label}</span>
                  </label>
                ))}
              </div>
              <div className="flex justify-end gap-2 pt-2" style={{ borderTop: '1px solid var(--color-border)' }}>
                <button type="button" onClick={() => setManagingAdmin(null)} className="btn-base btn-secondary">Batal</button>
                <button type="submit" className="btn-base btn-primary">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: Cabut Hak Akses ── */}
      {revokingAdmin && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setRevokingAdmin(null)}>
          <div className="modal-box p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'var(--color-danger-light)', color: 'var(--color-danger)' }}>
              <AlertTriangle size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--color-text)' }}>Cabut Hak Akses?</h2>
              <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 6 }}>
                Seluruh hak akses admin ini akan dihapus sepenuhnya.
              </p>
              <div className="rounded-xl p-3 mt-3 space-y-1" style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
                <p style={{ fontSize: 13 }}><strong>{revokingAdmin.nama}</strong></p>
                <p style={{ fontSize: 12.5, color: 'var(--color-text-muted)' }}>{revokingAdmin.email}</p>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2" style={{ borderTop: '1px solid var(--color-border)' }}>
              <button onClick={() => setRevokingAdmin(null)} className="btn-base btn-secondary">Batal</button>
              <button onClick={handleRevokePermissions} className="btn-base btn-danger">Cabut Hak Akses</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
