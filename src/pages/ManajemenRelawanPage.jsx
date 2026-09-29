// ManajemenRelawanPage.jsx
// Halaman manajemen relawan: verifikasi pending, daftar relawan terverifikasi
import { useState, useEffect } from 'react';
import {
  HeartHandshake, Search, Phone, MapPin,
  Check, X, Lock, ArrowLeft, ShieldCheck, Clock, RefreshCw
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Badge from '../components/Badge';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { relawanService } from '../services/relawanService';



const tabs = [
  { id: 'relawan',  label: 'Relawan Terverifikasi', icon: HeartHandshake },
  { id: 'pending',  label: 'Menunggu Verifikasi',  icon: Clock, badge: true },
];

export default function ManajemenRelawanPage({ currentUser, onBackToDashboard }) {
  const isSuperAdmin = currentUser?.role === 'Super Admin' || currentUser?.role === 'superadmin';

  const [activeTab, setActiveTab] = useState('relawan');
  const [search, setSearch] = useState('');
  const [pendingRelawans, setPendingRelawans] = useState([]);
  const [verifiedRelawans, setVerifiedRelawans] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3200);
  };

  const fetchVerified = async () => {
    try {
      const res = await relawanService.getRelawan();
      if (res && res.data) {
        const items = Array.isArray(res.data) ? res.data : [];
        setVerifiedRelawans(items.map((r, i) => ({
          id: r.id,
          nama: r.name || r.nama || `Relawan #${r.id}`,
          peran: r.role_title || r.peran || 'Relawan',
          avatar: (r.name || r.nama || 'R').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
          avatarBg: ['bg-blue-600','bg-emerald-600','bg-amber-500','bg-purple-600','bg-pink-600'][i % 5],
          keahlian: r.keahlian || [],
          kontak: r.no_telp || r.kontak || '—',
          jarak: r.jarak || null,
          status: r.status === 'bertugas' ? 'Bertugas' : 'Online',
        })));
      }
    } catch (err) {
      console.error('Gagal mengambil relawan:', err);
    }
  };

  const fetchPending = async () => {
    try {
      setIsLoading(true);
      const res = await relawanService.getPendingRelawan();
      if (res && res.data) setPendingRelawans(res.data);
    } catch (err) {
      console.error('Gagal mengambil relawan pending:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchPending(); fetchVerified(); }, []);

  const handleVerify = async (id, status) => {
    try {
      await relawanService.verifikasiRelawan(id, status);
      setPendingRelawans(prev => prev.filter(r => r.id !== id));
      if (status === 'terverifikasi') fetchVerified();
      showToast(`Relawan berhasil ${status === 'terverifikasi' ? 'disetujui' : 'ditolak'}.`);
    } catch (err) {
      console.error('Gagal verifikasi:', err);
      showToast('Terjadi kesalahan saat verifikasi.');
    }
  };

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

  const filteredRelawan = verifiedRelawans.filter(v => {
    const q = search.toLowerCase();
    return !q || v.nama.toLowerCase().includes(q) || (v.peran || '').toLowerCase().includes(q) || (v.kontak || '').includes(q);
  });

  const filteredPending = pendingRelawans.filter(v => {
    const q = search.toLowerCase();
    return !q || (v.name || '').toLowerCase().includes(q) || (v.email || '').toLowerCase().includes(q);
  });

  return (
    <div className="page-shell space-y-5">

      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 flex items-center gap-2.5 rounded-xl px-4 py-3 shadow-xl z-50 animate-fade-in"
          style={{ background: 'var(--nav-bg)', color: 'white', border: '1px solid rgba(255,255,255,0.08)' }}>
          <ShieldCheck size={15} style={{ color: '#34D399', flexShrink: 0 }} />
          <span style={{ fontSize: 13, fontWeight: 600 }}>{toastMsg}</span>
        </div>
      )}

      <PageHeader
        title="Kelola Relawan"
        description="Verifikasi pendaftaran relawan baru dan pantau daftar relawan aktif."
        actions={
          <button onClick={fetchPending} className="btn-base btn-secondary" disabled={isLoading}>
            <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
            Segarkan
          </button>
        }
      />

      {/* Pending Alert Banner */}
      {pendingRelawans.length > 0 && (
        <div
          className="flex items-center gap-3 rounded-xl px-4 py-3"
          style={{ background: 'var(--color-warning-light)', border: '1px solid var(--color-warning-border)' }}
        >
          <Clock size={15} style={{ color: 'var(--color-warning)', flexShrink: 0 }} />
          <p style={{ fontSize: 13, fontWeight: 600, color: '#92400E' }}>
            {pendingRelawans.length} relawan menunggu verifikasi — klik tab "Menunggu Verifikasi" untuk meninjau.
          </p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 w-fit rounded-xl" style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const count = tab.id === 'pending' ? pendingRelawans.length : null;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 rounded-lg px-4 py-2 transition-all cursor-pointer"
              style={{
                fontSize: 13,
                fontWeight: 600,
                background: isActive ? 'white' : 'transparent',
                color: isActive ? 'var(--color-text)' : 'var(--color-text-muted)',
                boxShadow: isActive ? '0 1px 3px rgba(15,23,42,0.08)' : 'none',
                border: 'none',
              }}
            >
              <Icon size={14} />
              {tab.label}
              {count !== null && count > 0 && (
                <span
                  className="rounded-full px-1.5 py-0.5 font-bold"
                  style={{ fontSize: 10, background: 'var(--color-warning)', color: 'white', minWidth: 18, textAlign: 'center' }}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="card-base p-4">
        <div className="relative" style={{ maxWidth: 320 }}>
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={activeTab === 'relawan' ? 'Cari nama, peran, kontak...' : 'Cari nama atau email...'}
            className="form-input"
            style={{ paddingLeft: 36 }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="card-base overflow-hidden">
        {isLoading ? (
          <LoadingSpinner text="Memuat data relawan..." />
        ) : activeTab === 'relawan' ? (
          filteredRelawan.length === 0 ? (
            <EmptyState icon={HeartHandshake} title="Tidak ada relawan" description="Belum ada relawan terverifikasi." />
          ) : (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Relawan</th>
                    <th>Peran / Keahlian</th>
                    <th>Kontak</th>
                    <th>Jarak</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRelawan.map(v => (
                    <tr key={v.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white flex-shrink-0 ${v.avatarBg || 'bg-slate-500'}`}>
                            {v.avatar || v.nama?.[0]}
                          </div>
                          <div>
                            <p style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--color-text)' }}>{v.nama}</p>
                            <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 1 }}>{v.id}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <p style={{ fontSize: 12.5, color: 'var(--color-text-secondary)' }}>{v.peran}</p>
                        {v.keahlian && (
                          <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }} className="truncate max-w-[160px]">
                            {v.keahlian.join(', ')}
                          </p>
                        )}
                      </td>
                      <td><span style={{ fontSize: 12.5, color: 'var(--color-text-secondary)' }}>{v.kontak}</span></td>
                      <td><span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{v.jarak || '—'}</span></td>
                      <td>
                        <Badge variant={v.status === 'Bertugas' ? 'Sedang Bertugas' : 'Online'} showDot />
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => alert(`Menghubungi ${v.nama} (${v.kontak})`)}
                          className="btn-base btn-primary"
                          style={{ height: 32, padding: '0 10px', fontSize: 12 }}
                        >
                          <Phone size={12} /> Kontak
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          // Pending tab
          filteredPending.length === 0 ? (
            <EmptyState
              icon={ShieldCheck}
              title="Tidak ada pendaftaran menunggu"
              description="Semua relawan sudah ditinjau."
            />
          ) : (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Pendaftar</th>
                    <th>Email</th>
                    <th>Telepon</th>
                    <th>Alamat</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Tindakan</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPending.map(v => (
                    <tr key={v.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white flex-shrink-0 bg-amber-500">
                            {v.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'RL'}
                          </div>
                          <div>
                            <p style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--color-text)' }}>{v.name}</p>
                            <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 1 }}>Relawan #{v.id}</p>
                          </div>
                        </div>
                      </td>
                      <td><span style={{ fontSize: 12.5, color: 'var(--color-text-secondary)' }}>{v.email || '—'}</span></td>
                      <td><span style={{ fontSize: 12.5, color: 'var(--color-text-secondary)' }}>{v.no_telp || '—'}</span></td>
                      <td>
                        <span style={{ fontSize: 12, color: 'var(--color-text-muted)', display: 'block', maxWidth: 200 }} className="truncate">
                          {v.alamat || '—'}
                        </span>
                      </td>
                      <td><Badge variant="Menunggu" /></td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleVerify(v.id, 'ditolak')}
                            className="btn-base btn-secondary"
                            style={{ height: 32, padding: '0 10px', fontSize: 12, border: '1px solid var(--color-danger-border)', color: 'var(--color-danger)' }}
                          >
                            <X size={12} /> Tolak
                          </button>
                          <button
                            onClick={() => handleVerify(v.id, 'terverifikasi')}
                            className="btn-base"
                            style={{ height: 32, padding: '0 10px', fontSize: 12, background: 'var(--color-success-light)', color: 'var(--color-success)', border: '1px solid var(--color-success-border)' }}
                          >
                            <Check size={12} /> Setujui
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>
    </div>
  );
}
