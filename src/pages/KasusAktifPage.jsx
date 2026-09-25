import { useState, useEffect } from 'react';
import { Search, RefreshCw, Eye, ArrowUpDown, Clock, Loader2, AlertTriangle } from 'lucide-react';
import Badge from '../components/Badge';
import { laporanService } from '../services/laporanService';

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
    { id: 'semua', label: 'Semua' },
    { id: 'aktif', label: 'Aktif' },
    { id: 'proses', label: 'Proses' },
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
      (c.pengguna?.name || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Kasus Aktif</h1>
          <p className="mt-1 text-[13px] text-slate-400">
            Pantau dan kelola kasus yang sedang berlangsung.
          </p>
        </div>
        <button
          onClick={() => fetchLaporan(activeTab === 'semua' ? null : activeTab)}
          disabled={loading}
          className="btn-base btn-secondary text-[12px] h-9"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-1.5 rounded-xl bg-[#f1f5f9] p-1">
          {filterTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-lg px-3 py-1.5 text-[12px] font-bold transition-all ${activeTab === tab.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              {tab.label}
              <span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] ${activeTab === tab.id ? 'bg-[#0a271f] text-white' : 'bg-slate-200 text-slate-600'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari ID, pelapor..."
              className="form-input h-9 pr-4 bg-[#f8fafc]"
              style={{ paddingLeft: '36px' }}
            />
          </div>

          <div className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-[#f8fafc] px-3 text-[12px] font-semibold text-slate-600">
            <ArrowUpDown size={13} className="text-slate-400" />
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="bg-transparent outline-none">
              <option value="terbaru">Terbaru</option>
              <option value="prioritas">Prioritas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="card flex items-center justify-center gap-3 p-12">
          <Loader2 size={20} className="animate-spin text-[#0b6f61]" />
          <span className="text-[14px] font-semibold text-slate-500">Memuat data...</span>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="flex items-center justify-between gap-4 card border-red-200 bg-red-50 p-4 text-red-700">
          <div className="flex items-start gap-3">
            <AlertTriangle size={18} className="mt-0.5 flex-shrink-0 text-red-500" />
            <p className="text-[13px] font-semibold">{error}</p>
          </div>
          <button
            onClick={() => fetchLaporan(activeTab === 'semua' ? null : activeTab)}
            className="btn-base btn-danger text-[12px] h-8"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* Table — reduced from 8 to 6 columns */}
      {!loading && !error && (
        <div className="card overflow-hidden">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{width: '80px'}}>ID</th>
                  <th style={{width: '120px'}}>Status</th>
                  <th>Kategori</th>
                  <th style={{width: '160px'}}>Pelapor</th>
                  <th style={{width: '110px'}}>Waktu</th>
                  <th style={{width: '80px'}} className="text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredCases.map(kasus => (
                  <tr key={kasus.id} className="cursor-pointer" onClick={() => onOpenDetail?.(kasus.id)}>
                    <td>
                      <span className="text-[12px] font-bold text-[#0b6f61]">#{kasus.id}</span>
                    </td>
                    <td>
                      <Badge variant={kasus.status} className="text-[11px]" />
                    </td>
                    <td>
                      <span className="text-[13px] font-semibold text-slate-800 line-clamp-1">{kasus.kategori_laporan}</span>
                    </td>
                    <td>
                      <p className="text-[12px] font-semibold text-slate-700 truncate">{kasus.pengguna?.name || '-'}</p>
                    </td>
                    <td>
                      <div className="flex items-center gap-1 text-[12px] text-slate-500">
                        <Clock size={12} className="text-slate-400 flex-shrink-0" />
                        <span>
                          {kasus.waktu_laporan ? new Date(kasus.waktu_laporan).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }) : '-'}
                        </span>
                      </div>
                    </td>
                    <td className="text-right">
                      <button
                        onClick={(e) => { e.stopPropagation(); onOpenDetail?.(kasus.id); }}
                        className="btn-base btn-primary text-[11px] h-7 px-2.5"
                      >
                        <Eye size={12} />
                        <span>Detail</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCases.length === 0 && (
            <div className="p-12 text-center text-slate-400">
              <p className="text-[14px] font-semibold">Tidak ada kasus yang sesuai.</p>
            </div>
          )}

          {pagination && (
            <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 text-[12px] text-slate-500">
              <span>
                Halaman {pagination.current_page} dari {pagination.last_page} • {pagination.total} laporan
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}