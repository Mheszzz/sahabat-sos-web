import { useState, useEffect } from 'react';
import { Search, RefreshCw, Eye, ArrowUpDown, Clock, Loader2, AlertTriangle, Filter } from 'lucide-react';
import Badge from '../../components/global/Badge';
import { kasusAktifService } from '../../api/services/kasusAktifService';
import { useNavigate } from 'react-router-dom';

/**
 * KasusAktifPage
 * Menampilkan semua tugas aktif (SOS + Laporan) dari endpoint GET /tugas-aktif.
 *
 * Response shape: { data: { laporan: { data: [...] }, sos: { data: [...] } } }
 * Setiap item memiliki: { id, status, status_raw, kategori ('SOS'|'Laporan'),
 *   jenis_laporan, pelapor, relawan, lokasi, waktu }
 */
export default function KasusAktifPage() {
  const navigate = useNavigate();

  // Navigate ke detail dengan query tipe agar hook tahu endpoint yang dipakai
  const onOpenDetail = (id, tipeKategori) => {
    const tipe = tipeKategori === 'SOS' ? 'sos' : 'laporan';
    navigate(`/detail-kasus/${id}?tipe=${tipe}`);
  };

  const [activeTab, setActiveTab] = useState('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('terbaru');
  const [filterKategori, setFilterKategori] = useState('');
  const [cases, setCases] = useState([]);     // merged flat array dari laporan + sos
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTugasAktif = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await kasusAktifService.getAll();
      // Response: { data: { laporan: { data: [...] }, sos: { data: [...] } } }
      const d = res?.data ?? {};

      const laporanItems = d.laporan?.data ?? (Array.isArray(d.laporan) ? d.laporan : []);
      const sosItems     = d.sos?.data     ?? (Array.isArray(d.sos)     ? d.sos     : []);

      // Gabungkan dan tandai tipe
      const merged = [
        ...sosItems.map(i => ({ ...i, _tipeKategori: 'SOS' })),
        ...laporanItems.map(i => ({ ...i, _tipeKategori: 'Laporan' })),
      ];

      setCases(merged);
    } catch (err) {
      setError('Gagal mengambil data tugas aktif. Pastikan server backend berjalan.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTugasAktif();
  }, []);

  // Helper: ambil nama pelapor dari berbagai format field
  const getPelapor = (c) =>
    c.pelapor?.name ?? c.pengguna?.name ?? c.korban ?? '—';

  // Helper: ambil label waktu
  const getWaktu = (c) => {
    const raw = c.waktu ?? c.waktu_laporan ?? c.waktu_sos ?? c.created_at;
    if (!raw) return '—';
    if (typeof raw === 'string' && raw.includes('lalu')) return raw; // waktu relatif
    try {
      return new Date(raw).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
    } catch { return raw; }
  };

  // Helper: ambil status raw (aktif/proses/selesai)
  const getStatusRaw = (c) => c.status_raw ?? c.status ?? '';

  // Helper: label tampilan kategori/insiden
  const getKategori = (c) =>
    c.jenis_laporan ?? c.sub_judul ?? c.kategori_laporan ?? (c._tipeKategori === 'SOS' ? 'Darurat SOS' : 'Laporan');

  // Filter tabs
  const filterTabs = [
    { id: 'semua',    label: 'Semua' },
    { id: 'sos',      label: 'SOS' },
    { id: 'laporan',  label: 'Laporan' },
    { id: 'aktif',    label: 'Aktif' },
    { id: 'proses',   label: 'Proses' },
  ].map(tab => ({
    ...tab,
    count:
      tab.id === 'semua'   ? cases.length
      : tab.id === 'sos'   ? cases.filter(c => c._tipeKategori === 'SOS').length
      : tab.id === 'laporan' ? cases.filter(c => c._tipeKategori !== 'SOS').length
      : cases.filter(c => getStatusRaw(c) === tab.id).length,
  }));

  const filteredCases = cases.filter(c => {
    if (activeTab === 'sos'     && c._tipeKategori !== 'SOS')    return false;
    if (activeTab === 'laporan' && c._tipeKategori === 'SOS')    return false;
    if (activeTab === 'aktif'   && getStatusRaw(c) !== 'aktif')  return false;
    if (activeTab === 'proses'  && getStatusRaw(c) !== 'proses') return false;
    
    if (filterKategori && getKategori(c).toLowerCase() !== filterKategori.toLowerCase()) return false;

    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      String(c.id).toLowerCase().includes(q) ||
      getKategori(c).toLowerCase().includes(q) ||
      getPelapor(c).toLowerCase().includes(q)
    );
  });

  const sorted = [...filteredCases].sort((a, b) => {
    if (sortBy === 'prioritas') {
      if (a._tipeKategori === 'SOS' && b._tipeKategori !== 'SOS') return -1;
      if (a._tipeKategori !== 'SOS' && b._tipeKategori === 'SOS') return  1;
    }
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Kasus Aktif</h1>
          <p className="mt-1 text-[13px] text-slate-400">
            Pantau dan kelola kasus SOS & laporan yang sedang berlangsung.
          </p>
        </div>
        <button
          onClick={fetchTugasAktif}
          disabled={loading}
          className="btn-base btn-secondary text-[12px] h-9"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-1.5 rounded-xl bg-[#f1f5f9] p-1 flex-wrap">
          {filterTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-lg px-3 py-1.5 text-[12px] font-bold transition-all ${
                activeTab === tab.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
              <span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] ${
                activeTab === tab.id ? 'bg-[#006D77] text-white' : 'bg-slate-200 text-slate-600'
              }`}>
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
              placeholder="Cari ID, pelapor, kategori..."
              className="form-input h-9 pr-4 bg-[#f8fafc]"
              style={{ paddingLeft: '36px' }}
            />
          </div>
          <div className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-[#f8fafc] px-3 text-[12px] font-semibold text-slate-600">
            <Filter size={13} className="text-slate-400" />
            <select value={filterKategori} onChange={e => setFilterKategori(e.target.value)} className="bg-transparent outline-none max-w-[120px] truncate">
              <option value="">Semua Kategori</option>
              <option value="Darurat SOS">Darurat SOS</option>
              <option value="tersesat">Tersesat</option>
              <option value="butuh_pendamping">Butuh Pendamping</option>
              <option value="aksesibilitas_rusak">Aksesibilitas Rusak</option>
            </select>
          </div>
          <div className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-[#f8fafc] px-3 text-[12px] font-semibold text-slate-600">
            <ArrowUpDown size={13} className="text-slate-400" />
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="bg-transparent outline-none">
              <option value="terbaru">Terbaru</option>
              <option value="prioritas">Prioritas (SOS duluan)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="card flex items-center justify-center gap-3 p-12">
          <Loader2 size={20} className="animate-spin text-[#0b6f61]" />
          <span className="text-[14px] font-semibold text-slate-500">Memuat data kasus aktif...</span>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="flex items-center justify-between gap-4 card border-red-200 bg-red-50 p-4 text-red-700">
          <div className="flex items-start gap-3">
            <AlertTriangle size={18} className="mt-0.5 flex-shrink-0 text-red-500" />
            <p className="text-[13px] font-semibold">{error}</p>
          </div>
          <button onClick={fetchTugasAktif} className="btn-base btn-danger text-[12px] h-8">Coba Lagi</button>
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        <div className="card overflow-hidden">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{minWidth: '90px'}}>ID</th>
                  <th style={{minWidth: '100px'}}>Tipe</th>
                  <th style={{minWidth: '140px'}}>Status</th>
                  <th style={{minWidth: '180px'}}>Kategori / Insiden</th>
                  <th style={{minWidth: '180px'}}>Pelapor</th>
                  <th style={{minWidth: '130px'}}>Waktu</th>
                  <th style={{minWidth: '120px'}} className="text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map(kasus => (
                  <tr
                    key={`${kasus._tipeKategori}-${kasus.id}`}
                    className="cursor-pointer"
                    onClick={() => onOpenDetail(kasus.id, kasus._tipeKategori)}
                  >
                    <td>
                      <span className="text-[12px] font-bold text-[#0b6f61]">#{kasus.id}</span>
                    </td>
                    <td>
                      <span className={`inline-flex items-center whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        kasus._tipeKategori === 'SOS'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {kasus._tipeKategori}
                      </span>
                    </td>
                    <td>
                      <Badge variant={getStatusRaw(kasus)} className="text-[11px]" />
                    </td>
                    <td>
                      <span className="text-[13px] font-semibold text-slate-800 line-clamp-1">
                        {getKategori(kasus)}
                      </span>
                    </td>
                    <td>
                      <p className="text-[12px] font-semibold text-slate-700 truncate">{getPelapor(kasus)}</p>
                    </td>
                    <td>
                      <div className="flex items-center gap-1 text-[12px] text-slate-500">
                        <Clock size={12} className="text-slate-400 flex-shrink-0" />
                        <span>{getWaktu(kasus)}</span>
                      </div>
                    </td>
                    <td className="text-right">
                      <button
                        onClick={e => { e.stopPropagation(); onOpenDetail(kasus.id, kasus._tipeKategori); }}
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

          {sorted.length === 0 && (
            <div className="p-12 text-center text-slate-400">
              <p className="text-[14px] font-semibold">Tidak ada kasus yang sesuai dengan filter.</p>
            </div>
          )}

          <div className="border-t border-slate-100 px-5 py-3 text-[12px] text-slate-500">
            <span>Menampilkan {sorted.length} dari {cases.length} kasus aktif</span>
          </div>
        </div>
      )}
    </div>
  );
}
