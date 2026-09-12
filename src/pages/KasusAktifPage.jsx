import { useState, useEffect } from 'react';
import { Search, RefreshCw, Filter, Eye, Phone, ArrowUpDown, CheckCircle, Clock, Loader2, AlertTriangle } from 'lucide-react';
import { laporanService } from '../services/laporanService';

const statusBadgeStyles = {
  'aktif':   'bg-[#fef2f2] text-[#ef4444] border border-red-200',
  'proses':  'bg-[#eff6ff] text-[#2563eb] border border-blue-200',
  'selesai': 'bg-[#f0fdf4] text-[#16a34a] border border-green-200',
  // Legacy dummy labels (fallback)
  'SOS Darurat':      'bg-[#fef2f2] text-[#ef4444] border border-red-200',
  'Sedang Ditangani': 'bg-[#eff6ff] text-[#2563eb] border border-blue-200',
  'Menunggu Respon':  'bg-[#fffbeb] text-[#d97706] border border-amber-200',
  'Laporan':          'bg-[#f8fafc] text-[#475569] border border-slate-200',
  'Teratasi':         'bg-[#f0fdf4] text-[#16a34a] border border-green-200',
};

const statusLabel = { aktif: 'Aktif', proses: 'Sedang Ditangani', selesai: 'Selesai' };

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
        // Support both paginated { data: { data: [] } } and flat { data: [] }
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
    { id: 'semua',   label: 'Semua Kasus' },
    { id: 'aktif',   label: 'Aktif / SOS' },
    { id: 'proses',  label: 'Sedang Ditangani' },
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
    <div className="p-6 lg:p-8 space-y-6 max-w-[1680px] w-full mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-black text-slate-900 tracking-tight leading-tight">
            Kasus Aktif
          </h1>
          <p className="text-[14px] text-slate-500 mt-1 font-medium">
            Pantau dan kelola kasus yang sedang berlangsung secara real-time.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => fetchLaporan(activeTab === 'semua' ? null : activeTab)}
            disabled={loading}
            className="btn-base btn-secondary text-[12px] h-9"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            <span>Segarkan Data</span>
          </button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white border border-[#eaedf1] rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 bg-[#f1f5f9] p-1 rounded-xl">
          {filterTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-[13px] font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                activeTab === tab.id
                  ? 'bg-[#0a271f] text-white'
                  : 'bg-slate-200 text-slate-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Sort */}
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-72">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari ID, pelapor, lokasi..."
              className="w-full h-9 pl-9 pr-4 bg-[#f8fafc] border border-slate-200 rounded-xl text-[13px] font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-emerald-600 transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-[#f8fafc] border border-slate-200 rounded-xl px-3 h-9 text-[12px] font-semibold text-slate-600">
            <ArrowUpDown size={13} className="text-slate-400" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="bg-transparent border-none outline-none cursor-pointer"
            >
              <option value="terbaru">Terbaru</option>
              <option value="prioritas">Prioritas Tertinggi</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white border border-[#eaedf1] rounded-2xl p-12 flex items-center justify-center gap-3 shadow-xs">
          <Loader2 size={20} className="animate-spin text-emerald-600" />
          <span className="text-[14px] font-semibold text-slate-500">Memuat data laporan...</span>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-center gap-3">
          <AlertTriangle size={18} className="text-red-500 flex-shrink-0" />
          <p className="text-[13px] text-red-700 font-semibold">{error}</p>
        </div>
      )}

      {/* Data Table */}
      {!loading && !error && (
        <div className="bg-white border border-[#eaedf1] rounded-2xl overflow-hidden shadow-xs">
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
                    {/* ID */}
                    <td>
                      <span className="font-bold text-emerald-600 text-[12px]">
                        #{kasus.id}
                      </span>
                    </td>

                    {/* Status */}
                    <td>
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold inline-block leading-none ${statusBadgeStyles[kasus.status] || 'bg-slate-100 text-slate-600'}`}>
                        {statusLabel[kasus.status] || kasus.status}
                      </span>
                    </td>

                    {/* Kategori */}
                    <td>
                      <div className="font-bold text-slate-800 max-w-[220px] truncate text-[13px]">
                        {kasus.kategori_laporan}
                      </div>
                    </td>

                    {/* Pelapor */}
                    <td>
                      <div>
                        <p className="font-semibold text-slate-800 leading-tight">{kasus.pengguna?.name || '-'}</p>
                        <p className="text-[11px] text-slate-400 leading-tight mt-0.5">{kasus.pengguna?.kategori_user || 'Pengguna'}</p>
                      </div>
                    </td>

                    {/* Lokasi */}
                    <td>
                      <div className="max-w-[200px] truncate text-slate-600 text-[12px]" title={kasus.lokasi_laporan}>
                        {kasus.lokasi_laporan}
                      </div>
                    </td>

                    {/* Relawan */}
                    <td>
                      <span className={kasus.relawan?.name ? 'font-semibold text-slate-700 text-[12px]' : 'text-slate-400 italic text-[12px]'}>
                        {kasus.relawan?.name || 'Belum ditugaskan'}
                      </span>
                    </td>

                    {/* Waktu */}
                    <td>
                      <div className="text-[12px] text-slate-500 flex items-center gap-1">
                        <Clock size={12} className="text-slate-400" />
                        <span>{kasus.waktu_laporan ? new Date(kasus.waktu_laporan).toLocaleDateString('id-ID', { day:'2-digit', month:'short', year:'2-digit' }) : '-'}</span>
                      </div>
                    </td>

                    {/* Action Buttons */}
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => alert(`Menghubungi kontak untuk laporan #${kasus.id}`)}
                          className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
                          title="Hubungi"
                        >
                          <Phone size={12} />
                        </button>
                        <button
                          onClick={() => onOpenDetail?.(kasus.id)}
                          className="btn-base btn-primary text-[11px] py-1 px-2.5 h-7 rounded-lg"
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
              <p className="font-semibold text-[14px]">Tidak ada kasus yang sesuai dengan filter.</p>
            </div>
          )}

          {/* Pagination Info */}
          {pagination && (
            <div className="px-5 py-3 border-t border-[#f1f5f9] flex items-center justify-between">
              <span className="text-[12px] text-slate-400 font-medium">
                Halaman {pagination.current_page} dari {pagination.last_page} Â· Total {pagination.total} laporan
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}