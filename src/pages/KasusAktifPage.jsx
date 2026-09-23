import { useState, useEffect } from 'react';
import {
  Search, RefreshCw, Eye, Phone, ArrowUpDown,
  Clock, AlertTriangle, FileText
} from 'lucide-react';
import { laporanService } from '../services/laporanService';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import PageHeader from '../components/PageHeader';

const statusMap = {
  aktif:    { cls: 'badge badge-red',   label: 'SOS Aktif' },
  proses:   { cls: 'badge badge-blue',  label: 'Ditangani' },
  selesai:  { cls: 'badge badge-green', label: 'Selesai' },
  'SOS Darurat':      { cls: 'badge badge-red',   label: 'SOS Darurat' },
  'Sedang Ditangani': { cls: 'badge badge-blue',  label: 'Ditangani' },
  'Menunggu Respon':  { cls: 'badge badge-amber', label: 'Menunggu' },
  'Teratasi':         { cls: 'badge badge-green', label: 'Teratasi' },
};

const filterTabs = [
  { id: 'semua',   label: 'Semua' },
  { id: 'aktif',   label: 'SOS Aktif' },
  { id: 'proses',  label: 'Ditangani' },
  { id: 'selesai', label: 'Selesai' },
];

export default function KasusAktifPage({ onOpenDetail }) {
  const [activeTab, setActiveTab] = useState('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('terbaru');
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLaporan = async (status = null) => {
    try {
      setLoading(true);
      setError('');
      const res = await laporanService.getLaporan(status);
      if (res && res.data) {
        const items = res.data?.data ?? res.data ?? [];
        setCases(Array.isArray(items) ? items : []);
      }
    } catch (err) {
      setError('Gagal mengambil data. Periksa koneksi ke server backend.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLaporan(activeTab === 'semua' ? null : activeTab);
  }, [activeTab]);

  const filteredCases = cases.filter(c => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      String(c.id).toLowerCase().includes(q) ||
      (c.kategori_laporan || '').toLowerCase().includes(q) ||
      (c.pengguna?.name || '').toLowerCase().includes(q) ||
      (c.lokasi_laporan || '').toLowerCase().includes(q)
    );
  });

  const tabCounts = filterTabs.map(t => ({
    ...t,
    count: t.id === 'semua' ? cases.length : cases.filter(c => c.status === t.id).length,
  }));

  return (
    <div className="page-shell space-y-5">
      <PageHeader
        title="Kasus Aktif"
        description="Pantau dan kelola laporan SOS yang sedang berlangsung secara real-time."
        actions={
          <button
            onClick={() => fetchLaporan(activeTab === 'semua' ? null : activeTab)}
            disabled={loading}
            className="btn-base btn-secondary"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            Segarkan
          </button>
        }
      />

      {/* ── Filter & Search Bar ── */}
      <div className="card-base p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Status Tabs */}
          <div
            className="flex items-center gap-1 rounded-xl p-1"
            style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}
          >
            {tabCounts.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all cursor-pointer"
                style={{
                  fontSize: 12.5,
                  fontWeight: 600,
                  background: activeTab === tab.id ? 'white' : 'transparent',
                  color: activeTab === tab.id ? 'var(--color-text)' : 'var(--color-text-muted)',
                  boxShadow: activeTab === tab.id ? '0 1px 3px rgba(15,23,42,0.08)' : 'none',
                  border: 'none',
                }}
              >
                {tab.label}
                <span
                  className="rounded-full px-1.5 py-0.5 font-bold"
                  style={{
                    fontSize: 10,
                    background: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-border)',
                    color: activeTab === tab.id ? 'white' : 'var(--color-text-muted)',
                  }}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search + Sort */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari ID, pelapor, lokasi..."
                className="form-input"
                style={{ paddingLeft: 36, width: 260 }}
              />
            </div>
            <div
              className="flex items-center gap-2 rounded-xl px-3"
              style={{ height: 40, border: '1px solid var(--color-border)', background: 'var(--color-surface-2)', fontSize: 12.5, fontWeight: 600, color: 'var(--color-text-secondary)' }}
            >
              <ArrowUpDown size={13} className="text-slate-400 flex-shrink-0" />
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 'inherit', color: 'inherit', cursor: 'pointer' }}>
                <option value="terbaru">Terbaru</option>
                <option value="prioritas">Prioritas</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ── Table / States ── */}
      <div className="card-base overflow-hidden">
        {loading ? (
          <LoadingSpinner text="Memuat data laporan..." />
        ) : error ? (
          <div className="p-6">
            <div
              className="flex items-center justify-between gap-4 rounded-xl p-4"
              style={{ background: 'var(--color-danger-light)', border: '1px solid var(--color-danger-border)' }}
            >
              <div className="flex items-center gap-3">
                <AlertTriangle size={16} style={{ color: 'var(--color-danger)', flexShrink: 0 }} />
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-danger)' }}>{error}</p>
              </div>
              <button
                onClick={() => fetchLaporan(activeTab === 'semua' ? null : activeTab)}
                className="btn-base btn-danger"
                style={{ height: 34, fontSize: 12 }}
              >
                Coba Lagi
              </button>
            </div>
          </div>
        ) : filteredCases.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="Tidak ada kasus ditemukan"
            description={searchQuery ? 'Coba ubah kata kunci pencarian.' : 'Tidak ada laporan sesuai filter yang dipilih.'}
          />
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Status</th>
                  <th>Kategori Kasus</th>
                  <th>Pelapor</th>
                  <th>Lokasi</th>
                  <th>Relawan</th>
                  <th>Waktu</th>
                  <th style={{ textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredCases.map(kasus => {
                  const st = statusMap[kasus.status] || { cls: 'badge badge-slate', label: kasus.status };
                  return (
                    <tr key={kasus.id}>
                      <td>
                        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-primary)', letterSpacing: '0.02em' }}>
                          #{kasus.id}
                        </span>
                      </td>
                      <td>
                        <span className={st.cls}>{st.label}</span>
                      </td>
                      <td>
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>
                          {kasus.kategori_laporan || '—'}
                        </span>
                      </td>
                      <td>
                        <p style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--color-text)' }}>
                          {kasus.pengguna?.name || '—'}
                        </p>
                        <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>
                          {kasus.pengguna?.kategori_user || 'Pengguna'}
                        </p>
                      </td>
                      <td>
                        <span
                          style={{ fontSize: 12, color: 'var(--color-text-secondary)', display: 'block', maxWidth: 200 }}
                          className="truncate"
                          title={kasus.lokasi_laporan}
                        >
                          {kasus.lokasi_laporan || '—'}
                        </span>
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: kasus.relawan?.name ? 600 : 400,
                            color: kasus.relawan?.name ? 'var(--color-text)' : 'var(--color-text-muted)',
                            fontStyle: kasus.relawan?.name ? 'normal' : 'italic',
                          }}
                        >
                          {kasus.relawan?.name || 'Belum ditugaskan'}
                        </span>
                      </td>
                      <td>
                        <span className="flex items-center gap-1" style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                          <Clock size={11} className="flex-shrink-0" />
                          {kasus.waktu_laporan
                            ? new Date(kasus.waktu_laporan).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })
                            : '—'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => alert(`Menghubungi pelapor kasus #${kasus.id}`)}
                            className="btn-icon"
                            style={{ width: 32, height: 32 }}
                            title="Hubungi Pelapor"
                          >
                            <Phone size={12} />
                          </button>
                          <button
                            onClick={() => onOpenDetail?.(kasus.id)}
                            className="btn-base btn-primary"
                            style={{ height: 32, padding: '0 10px', fontSize: 12 }}
                          >
                            <Eye size={12} />
                            Detail
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}