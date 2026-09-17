import { useState, useEffect } from 'react';
import { Search, RefreshCw, Eye, Phone, ArrowUpDown, Clock, Loader2, AlertTriangle } from 'lucide-react';
import { laporanService } from '../services/laporanService';

const statusBadgeStyles = {
  aktif: 'bg-[#fef2f2] text-[#ef4444]',
  proses: 'bg-[#eff6ff] text-[#2563eb]',
  selesai: 'bg-[#ecfdf5] text-[#15803d]',
  'SOS Darurat': 'bg-[#fef2f2] text-[#ef4444]',
  'Sedang Ditangani': 'bg-[#eff6ff] text-[#2563eb]',
  'Menunggu Respon': 'bg-[#fff7ed] text-[#d97706]',
  'Laporan': 'bg-[#f8fafc] text-[#475569]',
  'Teratasi': 'bg-[#ecfdf5] text-[#15803d]',
};

const statusLabel = {
  aktif: 'Aktif',
  proses: 'Sedang Ditangani',
  selesai: 'Selesai',
};

export default function KasusAktifPage({ onOpenDetail }) {
  const [activeTab, setActiveTab] = useState('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('terbaru');
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState(null);

  const fetchLaporan = async (status = null) => {
    try {
      setLoading(true);
      setError('');
      const res = await laporanService.getLaporan(status);
      if (res && res.data) {
        const items = res.data?.data ?? res.data ?? [];
        setCases(Array.isArray(items) ? items : []);
        setPagination(res.data?.last_page ? res.data : null);
      }
    } catch (err) {
      setError('Gagal mengambil data laporan. Pastikan server backend berjalan.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const status = activeTab === 'semua' ? null : activeTab;
    fetchLaporan(status);
  }, [activeTab]);

  const filterTabs = [
    { id: 'semua', label: 'Semua Kasus' },
    { id: 'aktif', label: 'Aktif / SOS' },
    { id: 'proses', label: 'Sedang Ditangani' },
    { id: 'selesai', label: 'Selesai' },
  ].map(tab => ({
    ...tab,
    count: tab.id === 'semua' ? cases.length : cases.filter(c => c.status === tab.id).length,
  }));

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

  return (
    <div className="page-shell space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-[24px] font-extrabold tracking-[-0.04em] text-slate-900">Kasus Aktif</h1>
          <p className="mt-1 text-[14px] font-medium text-slate-500">
            Pantau dan kelola kasus yang sedang berlangsung secara real-time.
          </p>
        </div>

        <button
          onClick={() => fetchLaporan(activeTab === 'semua' ? null : activeTab)}
          disabled={loading}
          className="btn-base btn-secondary text-[12px] h-9"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          <span>Segarkan Data</span>
        </button>
      </div>

      <div className="rounded-[22px] border border-[#e2e8f0] bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-1.5 rounded-2xl bg-[#f1f5f9] p-1">
            {filterTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-xl px-3.5 py-1.5 text-[12px] font-bold transition-all ${activeTab === tab.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              >
                <span>{tab.label}</span>
                <span className={`ml-2 rounded-full px-1.5 py-0.5 text-[9px] ${activeTab === tab.id ? 'bg-[#0a271f] text-white' : 'bg-slate-200 text-slate-600'}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-72">
              <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari ID, pelapor, lokasi..."
                className="form-input h-10 pr-4 bg-[#f8fafc]"
                style={{ paddingLeft: '40px' }}
              />
            </div>

            <div className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-[#f8fafc] px-3 text-[12px] font-semibold text-slate-600">
              <ArrowUpDown size={13} className="text-slate-400" />
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="bg-transparent outline-none">
                <option value="terbaru">Terbaru</option>
                <option value="prioritas">Prioritas Tertinggi</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center gap-3 rounded-[22px] border border-[#e2e8f0] bg-white p-12 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
          <Loader2 size={20} className="animate-spin text-[#0a271f]" />
          <span className="text-[14px] font-semibold text-slate-500">Memuat data laporan...</span>
        </div>
      )}

      {!loading && error && (
        <div className="flex items-center justify-between gap-4 rounded-[22px] border border-red-200 bg-red-50 p-4 text-red-700 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertTriangle size={18} className="mt-0.5 flex-shrink-0 text-red-500" />
            <p className="text-[13px] font-semibold">{error}</p>
          </div>
          <button
            onClick={() => fetchLaporan(activeTab === 'semua' ? null : activeTab)}
            className="rounded-lg bg-red-600 px-3 py-2 text-[12px] font-bold text-white transition-colors hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="overflow-hidden rounded-[22px] border border-[#e2e8f0] bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
          <div className="table-responsive">
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
                  <th className="text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredCases.map(kasus => (
                  <tr key={kasus.id}>
                    <td className="min-w-0 align-middle">
                      <span className="block text-[12px] font-extrabold tracking-[0.04em] text-[#0a271f] break-words">#{kasus.id}</span>
                    </td>

                    <td className="min-w-0 align-middle">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold break-words ${statusBadgeStyles[kasus.status] || 'bg-slate-100 text-slate-600'}`}>
                        {statusLabel[kasus.status] || kasus.status}
                      </span>
                    </td>

                    <td className="min-w-0 align-middle">
                      <div className="max-w-[220px] truncate text-[13px] font-bold text-slate-800 break-words">{kasus.kategori_laporan}</div>
                    </td>

                    <td className="min-w-0 align-middle">
                      <div className="max-w-[180px]">
                        <p className="text-[12px] font-semibold text-slate-800 break-words">{kasus.pengguna?.name || '-'}</p>
                        <p className="mt-0.5 text-[11px] text-slate-400 break-words">{kasus.pengguna?.kategori_user || 'Pengguna'}</p>
                      </div>
                    </td>

                    <td className="min-w-0 align-middle">
                      <div className="max-w-[200px] truncate text-[12px] text-slate-600 break-words" title={kasus.lokasi_laporan}>{kasus.lokasi_laporan}</div>
                    </td>

                    <td className="min-w-0 align-middle">
                      <span className={kasus.relawan?.name ? 'block text-[12px] font-semibold text-slate-700 break-words' : 'block text-[12px] italic text-slate-400 break-words'}>
                        {kasus.relawan?.name || 'Belum ditugaskan'}
                      </span>
                    </td>

                    <td className="min-w-0 align-middle">
                      <div className="flex items-center gap-1 text-[12px] text-slate-500">
                        <Clock size={12} className="text-slate-400 flex-shrink-0" />
                        <span className="break-words">
                          {kasus.waktu_laporan ? new Date(kasus.waktu_laporan).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: '2-digit' }) : '-'}
                        </span>
                      </div>
                    </td>

                    <td className="text-right align-middle min-w-0">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => alert(`Menghubungi kontak untuk laporan #${kasus.id}`)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 flex-shrink-0"
                          title="Hubungi"
                        >
                          <Phone size={12} />
                        </button>
                        <button
                          onClick={() => onOpenDetail?.(kasus.id)}
                          className="btn-base btn-primary text-[11px] h-8 px-2.5 rounded-lg"
                        >
                          <Eye size={12} />
                          <span>Detail</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCases.length === 0 && (
            <div className="p-12 text-center text-slate-400">
              <p className="text-[14px] font-semibold">Tidak ada kasus yang sesuai dengan filter.</p>
            </div>
          )}

          {pagination && (
            <div className="flex items-center justify-between border-t border-[#f1f5f9] px-5 py-3 text-[12px] text-slate-500">
              <span>
                Halaman {pagination.current_page} dari {pagination.last_page} • Total {pagination.total} laporan
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}