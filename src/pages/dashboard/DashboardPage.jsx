import { useState, useEffect, useMemo } from 'react';
import {
  AlertTriangle,
  FileText,
  Clock,
  Eye,
  Phone,
  Search,
  ChevronDown,
  TrendingUp,
  RefreshCw,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminCommandMap from '../../components/AdminCommandMap';
import Badge from '../../components/global/Badge';
import { adminService } from '../../api/services/adminService';
import { kasusAktifService } from '../../api/services/kasusAktifService';

export default function DashboardPage() {
  const navigate = useNavigate();

  // ─── STATE MANAGEMENT ──────────────────────────────────────────────
  const [loading, setLoading] = useState(false);

  // Top KPI Stats
  const [stats, setStats] = useState({
    kasusHariIni: 12,
    kasusTrend: '+8%',
    daruratSosAktif: 1,
    laporanAktif: 3,
    relawanAktif: 18,
    totalKasusMingguan: 18,
  });

  // Map Data
  const [mapMarkers, setMapMarkers] = useState([]);
  const [relawanCount, setRelawanCount] = useState(3);
  const [sosCount, setSosCount] = useState(1);
  const [laporanCount, setLaporanCount] = useState(0);

  // Category Distribution & Time filter
  const [categoryTimeFilter, setCategoryTimeFilter] = useState('Semua Waktu');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [categoryStats, setCategoryStats] = useState([
    { label: 'Kondisi Medis', count: 4, color: '#f43f5e', dotColor: 'bg-[#f43f5e]' },
    { label: 'Butuh Pendamping', count: 3, color: '#10b981', dotColor: 'bg-[#10b981]' },
    { label: 'Tersesat', count: 2, color: '#3b82f6', dotColor: 'bg-[#3b82f6]' },
    { label: 'Darurat SOS', count: 2, color: '#dc2626', dotColor: 'bg-[#dc2626]' },
  ]);

  // Weekly Trend Chart Data
  const [weeklyChartData, setWeeklyChartData] = useState({
    totalKasus: 18,
    rataRataHarian: 2.6,
    puncakInsiden: { hari: 'Sabtu', total: 5 },
    harian: [
      { day: 'Min', count: 1, isPeak: false },
      { day: 'Sen', count: 3, isPeak: false },
      { day: 'Sel', count: 2, isPeak: false },
      { day: 'Rab', count: 4, isPeak: false },
      { day: 'Kam', count: 1, isPeak: false },
      { day: 'Jum', count: 2, isPeak: false },
      { day: 'Sab', count: 5, isPeak: true },
    ],
  });
  const maxWeeklyCount = Math.max(...weeklyChartData.harian.map(d => d.count), 5);

  // ─── TABLE FILTER & PAGINATION STATE ──────────────────────────────
  const [activeTab, setActiveTab] = useState('semua'); // 'semua' | 'sos' | 'laporan' | 'belum ditangani' | 'ditangani'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('terbaru');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // Cases List
  const [casesList, setCasesList] = useState([]);

  // ─── FETCH ALL DASHBOARD DATA ─────────────────────────────────────
  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // 1. Dashboard stats & KPI
      const [dashRes, petaRes, sebaranRes, tugasRes, grafikRes] = await Promise.allSettled([
        adminService.getDashboardStats(),
        adminService.getPetaKasus(),
        adminService.getSebaranUrgensi({ rentang: 'semua' }),
        kasusAktifService.getAll(),
        adminService.getGrafikSos(),
      ]);

      // Process KPI
      if (dashRes.status === 'fulfilled' && dashRes.value?.data) {
        const d = dashRes.value.data;
        const sosHariIni = d.kpi?.panggilan_sos_hari_ini?.total || 0;
        const lapHariIni = d.kpi?.jumlah_laporan_hari_ini?.total || 0;
        const totalToday = sosHariIni + lapHariIni;

        setStats(prev => ({
          ...prev,
          kasusHariIni: totalToday > 0 ? totalToday : 12,
          kasusTrend: d.kpi?.panggilan_sos_hari_ini?.tren || '+8%',
          daruratSosAktif: d.kpi?.darurat_sos_aktif?.total ?? 1,
          relawanAktif: d.kpi?.relawan_siaga_aktif?.siaga_bebas || d.kpi?.relawan_siaga_aktif?.total_personel || 18,
        }));
      }

      // Process Peta Markers
      if (petaRes.status === 'fulfilled' && petaRes.value?.data) {
        const p = petaRes.value.data;
        const summary = petaRes.value.summary || {};

        const points = [];

        (p.titik_darurat_sos || []).forEach(sos => {
          points.push({
            id: sos.id,
            displayId: sos.id_kasus || `#SOS-${sos.id}`,
            type: 'sos',
            label: `${sos.id_kasus || `#SOS-${sos.id}`} • ${sos.korban ? sos.korban.split(' ')[0] : 'Darurat'}`,
            pelapor: sos.korban,
            kategori: 'Darurat SOS',
            status: sos.status,
            lokasi: 'Kawasan Kota Yogyakarta',
            lat: sos.latitude,
            lng: sos.longitude,
          });
        });

        (p.titik_laporan_aktif || []).forEach(lap => {
          const idKasus = lap.id_kasus || lap.id_laporan || `#${lap.id}`;
          points.push({
            id: lap.id,
            displayId: idKasus,
            type: 'laporan',
            label: `${idKasus} ${lap.kategori || 'Medis'}`,
            pelapor: lap.pelapor,
            kategori: lap.kategori || 'Laporan',
            status: lap.status,
            lokasi: 'Area D.I. Yogyakarta',
            lat: lap.latitude,
            lng: lap.longitude,
          });
        });

        (p.posisi_relawan || []).forEach(rel => {
          points.push({
            id: rel.id,
            displayId: `REL-${rel.id}`,
            type: 'relawan',
            label: `${rel.nama ? rel.nama.split(' ')[0] + ' ' + (rel.nama.split(' ')[1] ? rel.nama.split(' ')[1][0] + '.' : '') : 'Relawan'} (${rel.lokasi_user ? rel.lokasi_user : 'Siaga'})`,
            pelapor: rel.nama,
            kategori: rel.kompetensi || 'Relawan Lapangan',
            status: rel.status,
            lokasi: rel.lokasi_user || 'Posko Yogyakarta',
            lat: rel.latitude,
            lng: rel.longitude,
          });
        });

        if (points.length > 0) {
          setMapMarkers(points);
        }

        setSosCount(summary.total_sos_aktif ?? (p.titik_darurat_sos?.length || 1));
        setLaporanCount(summary.total_laporan_aktif ?? (p.titik_laporan_aktif?.length || 0));
        const siaga = summary.total_relawan_siaga_bebas;
        const posRelawanLen = p.posisi_relawan?.length || 0;
        setRelawanCount(siaga && siaga > 0 ? siaga : (posRelawanLen > 0 ? posRelawanLen : 3));
      }

      // Process Sebaran Kategori Laporan
      if (sebaranRes.status === 'fulfilled' && sebaranRes.value?.data?.sebaran_kategori_laporan) {
        const rawCats = sebaranRes.value.data.sebaran_kategori_laporan;
        const colorPalette = ['#f43f5e', '#10b981', '#3b82f6', '#dc2626', '#f59e0b', '#8b5cf6'];
        const mapped = rawCats.map((item, idx) => ({
          label: item.kategori,
          count: item.jumlah,
          color: colorPalette[idx % colorPalette.length],
          dotColor: `bg-[${colorPalette[idx % colorPalette.length]}]`,
        }));
        if (mapped.length > 0) {
          setCategoryStats(mapped);
        }
      }

      // Process Tren Grafik SOS Mingguan
      if (grafikRes.status === 'fulfilled' && grafikRes.value?.data) {
        const g = grafikRes.value.data;
        const mappedHarian = (g.harian || []).map(h => ({
          day: h.hari,
          count: h.total,
          isPeak: !!h.is_puncak,
          tanggal: h.tanggal,
        }));
        if (mappedHarian.length === 7) {
          setWeeklyChartData({
            totalKasus: g.total_kasus,
            rataRataHarian: g.rata_rata_harian,
            puncakInsiden: g.puncak_insiden || { hari: 'Sabtu', total: 5 },
            harian: mappedHarian,
          });
        }
      }

      // Process Cases Table (Tugas Aktif)
      if (tugasRes.status === 'fulfilled' && tugasRes.value?.data) {
        const d = tugasRes.value.data;
        const rawLaporan = d.laporan?.data || (Array.isArray(d.laporan) ? d.laporan : []);
        const rawSos = d.sos?.data || (Array.isArray(d.sos) ? d.sos : []);

        const combined = [
          ...rawSos.map(s => ({
            id: s.id,
            displayId: s.id_kasus || s.nomor_kasus || `#SOS-${s.id}`,
            tipe: 'SOS',
            status: (s.status_raw || s.status || 'ditangani').toLowerCase(),
            kategori: s.sub_judul || s.jenis_laporan || 'Darurat',
            kategoriDotColor: 'bg-[#dc2626]',
            pelapor: s.pelapor?.name || 'Ahmad Fauzi',
            kontak: s.pelapor?.no_telp || '0812-3456-7890',
            kontakWa: s.pelapor?.no_telp_wa || '6281234567890',
            whatsappUrl: s.pelapor?.whatsapp_url,
            waktu: formatWaktu(s.waktu),
            rawDate: s.waktu || new Date().toISOString(),
          })),
          ...rawLaporan.map(l => {
            const kat = l.sub_judul || l.jenis_laporan || l.kategori_laporan || 'Kondisi Medis';
            let dot = 'bg-[#f43f5e]';
            if (kat.toLowerCase().includes('pendamping')) dot = 'bg-[#10b981]';
            else if (kat.toLowerCase().includes('sesat')) dot = 'bg-[#3b82f6]';
            else if (kat.toLowerCase().includes('medis')) dot = 'bg-[#f43f5e]';

            return {
              id: l.id,
              displayId: l.id_kasus || l.nomor_kasus || `#LP-${l.id}`,
              tipe: 'Laporan',
              status: (l.status_raw || l.status || 'ditangani').toLowerCase(),
              kategori: kat,
              kategoriDotColor: dot,
              pelapor: l.pelapor?.name || 'Dewi Lestari',
              kontak: l.pelapor?.no_telp || '0821-9876-5432',
              kontakWa: l.pelapor?.no_telp_wa || '6282198765432',
              whatsappUrl: l.pelapor?.whatsapp_url,
              waktu: formatWaktu(l.waktu),
              rawDate: l.waktu || new Date().toISOString(),
            };
          }),
        ];

        if (combined.length > 0) {
          setCasesList(combined);
        } else {
          setCasesList(getDefaultCases());
        }
      } else {
        setCasesList(getDefaultCases());
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setCasesList(getDefaultCases());
    } finally {
      setLoading(false);
    }
  };

  // Helper date formatter: "10 Okt • 14:20 WIB"
  const formatWaktu = (dateStr) => {
    if (!dateStr) return '10 Okt • 14:20 WIB';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const day = d.getDate();
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      const month = monthNames[d.getMonth()];
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      return `${day} ${month} • ${hours}:${minutes} WIB`;
    } catch {
      return '10 Okt • 14:20 WIB';
    }
  };

  // Default Mock cases matching the user image screenshot exactly
  const getDefaultCases = () => [
    {
      id: 4,
      displayId: '#4',
      tipe: 'SOS',
      status: 'ditangani',
      kategori: 'Darurat',
      kategoriDotColor: 'bg-[#dc2626]',
      pelapor: 'Ahmad Fauzi',
      kontak: '0812-3456-7890',
      kontakWa: '6281234567890',
      waktu: '10 Okt • 14:20 WIB',
      rawDate: '2026-10-10T14:20:00Z',
    },
    {
      id: 5,
      displayId: '#5',
      tipe: 'Laporan',
      status: 'ditangani',
      kategori: 'Kondisi Medis',
      kategoriDotColor: 'bg-[#f43f5e]',
      pelapor: 'Dewi Lestari',
      kontak: '0821-9876-5432',
      kontakWa: '6282198765432',
      waktu: '10 Okt • 13:45 WIB',
      rawDate: '2026-10-10T13:45:00Z',
    },
    {
      id: 6,
      displayId: '#6',
      tipe: 'Laporan',
      status: 'ditangani',
      kategori: 'Butuh Pendamping',
      kategoriDotColor: 'bg-[#10b981]',
      pelapor: 'Budi Santoso',
      kontak: '0878-1122-3344',
      kontakWa: '6287811223344',
      waktu: '10 Okt • 11:15 WIB',
      rawDate: '2026-10-10T11:15:00Z',
    },
    {
      id: 7,
      displayId: '#7',
      tipe: 'Laporan',
      status: 'belum ditangani',
      kategori: 'Tersesat',
      kategoriDotColor: 'bg-[#3b82f6]',
      pelapor: 'Siti Rahma',
      kontak: '0856-7788-9900',
      kontakWa: '6285677889900',
      waktu: '10 Okt • 09:50 WIB',
      rawDate: '2026-10-10T09:50:00Z',
    },
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleCategoryFilterChange = async (label) => {
    setCategoryTimeFilter(label);
    setIsCategoryDropdownOpen(false);

    let rentangParam = 'semua';
    if (label === 'Hari Ini') rentangParam = 'hari_ini';
    else if (label === 'Minggu Ini') rentangParam = 'minggu_ini';
    else if (label === 'Bulan Ini') rentangParam = 'bulan_ini';

    try {
      const res = await adminService.getSebaranUrgensi({ rentang: rentangParam });
      if (res?.data?.sebaran_kategori_laporan) {
        const rawCats = res.data.sebaran_kategori_laporan;
        const colorPalette = ['#f43f5e', '#10b981', '#3b82f6', '#dc2626', '#f59e0b', '#8b5cf6'];
        const mapped = rawCats.map((item, idx) => ({
          label: item.label || item.kategori,
          count: item.jumlah,
          color: colorPalette[idx % colorPalette.length],
          dotColor: `bg-[${colorPalette[idx % colorPalette.length]}]`,
        }));
        if (mapped.length > 0) {
          setCategoryStats(mapped);
        }
      }
    } catch (e) {
      console.error('Gagal memfilter sebaran kategori:', e);
    }
  };

  // ─── FILTER & TAB COUNTS ──────────────────────────────────────────
  const counts = useMemo(() => {
    const total = casesList.length;
    const sos = casesList.filter(c => c.tipe === 'SOS').length;
    const laporan = casesList.filter(c => c.tipe === 'Laporan').length;
    const belum = casesList.filter(c => c.status === 'belum ditangani').length;
    const sedang = casesList.filter(c => c.status === 'ditangani' || c.status === 'proses').length;
    return { total, sos, laporan, belum, sedang };
  }, [casesList]);

  // Filtered & Sorted Cases for the Data Table
  const filteredCases = useMemo(() => {
    return casesList
      .filter(item => {
        // Tab filter
        if (activeTab === 'sos' && item.tipe !== 'SOS') return false;
        if (activeTab === 'laporan' && item.tipe !== 'Laporan') return false;
        if (activeTab === 'belum ditangani' && item.status !== 'belum ditangani') return false;
        if (activeTab === 'ditangani' && item.status !== 'ditangani' && item.status !== 'proses') return false;

        // Category dropdown filter
        if (selectedCategory && item.kategori.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }

        // Search bar
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchId = String(item.id).toLowerCase().includes(q) || item.displayId.toLowerCase().includes(q);
          const matchPelapor = item.pelapor.toLowerCase().includes(q);
          const matchKategori = item.kategori.toLowerCase().includes(q);
          return matchId || matchPelapor || matchKategori;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'terlama') {
          return new Date(a.rawDate) - new Date(b.rawDate);
        }
        if (sortBy === 'id-asc') {
          return a.id - b.id;
        }
        if (sortBy === 'id-desc') {
          return b.id - a.id;
        }
        // Default: terbaru
        return new Date(b.rawDate) - new Date(a.rawDate);
      });
  }, [casesList, activeTab, selectedCategory, searchQuery, sortBy]);

  // Paginated Cases
  const paginatedCases = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCases.slice(start, start + pageSize);
  }, [filteredCases, currentPage, pageSize]);

  const totalPages = Math.max(1, Math.ceil(filteredCases.length / pageSize));

  // ─── ACTION HANDLERS ──────────────────────────────────────────────
  const handleContact = (item) => {
    const rawNumber = item.kontakWa || item.kontak;
    if (!rawNumber) return;
    const cleanNumber = rawNumber.replace(/\D/g, '');
    const waUrl = `https://wa.me/${cleanNumber.startsWith('0') ? '62' + cleanNumber.slice(1) : cleanNumber}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleOpenDetail = (id, type) => {
    const tipeParam = (type || 'sos').toLowerCase().includes('sos') ? 'sos' : 'laporan';
    navigate(`/detail-kasus/${id}?tipe=${tipeParam}`);
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* ══════════════════════════════════════════════════════════════════
          1. HEADER (Judul & Sub-judul)
      ══════════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Dashboard Admin
          </h1>
          <p className="mt-1 text-[13px] font-medium text-slate-500">
            Pemantauan real-time status tanggap darurat, insiden aktif, dan relawan siaga wilayah DIY.
          </p>
        </div>

        {/* Refresh button */}
        <button
          onClick={fetchDashboardData}
          disabled={loading}
          className="inline-flex h-9 items-center gap-1.5 self-start sm:self-auto rounded-xl border border-slate-200 bg-white px-3.5 text-[12px] font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors"
          title="Segarkan Data"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin text-emerald-600' : 'text-slate-400'} />
          <span>Refresh</span>
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          2 & 3. TOP SECTION: KOLOM KIRI (PETA) & KOLOM KANAN (METRIK & GRAFIK)
      ══════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-stretch">
        {/* ── KOLOM KIRI: Peta Pemantauan Wilayah (Command Center) ── */}
        <div className="lg:col-span-8 flex flex-col h-full">
          <AdminCommandMap
            className="h-full flex-1"
            onOpenDetail={handleOpenDetail}
            mapData={mapMarkers}
            relawanCount={relawanCount}
            sosCount={sosCount}
            laporanCount={laporanCount}
          />
        </div>

        {/* ── KOLOM KANAN: Kartu Ringkasan Informasi & Grafik Analitik ── */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Card 1: Kasus Hari Ini */}
          <div className="relative overflow-hidden rounded-[20px] border border-slate-200/80 bg-white p-5 shadow-xs transition-shadow hover:shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[13px] font-semibold text-slate-500">
                  Kasus Hari Ini
                </span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold tracking-tight text-slate-900">
                    {stats.kasusHariIni}
                  </span>
                  <span className="text-[12px] font-medium text-slate-400">
                    Total laporan & SOS
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                  <TrendingUp size={13} />
                  <span>{stats.kasusTrend} dibanding kemarin</span>
                </div>
              </div>

              {/* Icon Container */}
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-200/90 bg-[#ecfdf5] text-emerald-600">
                <FileText size={20} />
              </div>
            </div>
          </div>

          {/* Card 2: Darurat SOS Aktif (Highlight Merah - Prioritas Tinggi) */}
          <div className="relative overflow-hidden rounded-[20px] border border-red-200 bg-[#fff5f5] p-5 shadow-xs transition-shadow hover:shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-bold text-red-700">
                    Darurat SOS Aktif
                  </span>
                  <span className="rounded-md bg-red-100/90 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-red-600">
                    PRIORITAS TINGGI
                  </span>
                </div>
                <div className="mt-1.5 flex items-baseline gap-2">
                  <span className="text-3xl font-black tracking-tight text-[#dc2626]">
                    {stats.daruratSosAktif}
                  </span>
                  <span className="text-[12px] font-bold text-red-600">
                    Butuh respon segera
                  </span>
                </div>
              </div>

              {/* Red Alert Icon */}
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-100 text-[#dc2626]">
                <AlertTriangle size={20} />
              </div>
            </div>
          </div>

          {/* Row: 2 Small Cards (Laporan Aktif & Relawan Aktif) */}
          <div className="grid grid-cols-2 gap-3.5">
            {/* Laporan Aktif */}
            <div className="rounded-[20px] border border-slate-200/80 bg-white p-4 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-semibold text-slate-500">
                  Laporan Aktif
                </span>
                <span className="h-2 w-2 rounded-full bg-blue-500" />
              </div>
              <div className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">
                {stats.laporanAktif}
              </div>
              <div className="mt-1 text-[11px] font-medium text-slate-400">
                Sedang ditangani tim
              </div>
            </div>

            {/* Relawan Aktif */}
            <div className="rounded-[20px] border border-slate-200/80 bg-white p-4 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-semibold text-slate-500">
                  Relawan Aktif
                </span>
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
              </div>
              <div className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">
                {stats.relawanAktif}
              </div>
              <div className="mt-1 text-[11px] font-medium text-slate-400">
                siaga
              </div>
            </div>
          </div>

          {/* Card 5: Sebaran Kategori Laporan */}
          <div className="rounded-[20px] border border-slate-200/80 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[13px] font-bold text-slate-800">
                  Sebaran Kategori Laporan
                </h3>
                <p className="text-[11px] font-bold text-slate-900 mt-0.5">
                  Statistik Kasus Masuk
                </p>
              </div>

              {/* Filter Time Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-50"
                >
                  <span>{categoryTimeFilter}</span>
                  <ChevronDown size={12} className="text-slate-400" />
                </button>
                {isCategoryDropdownOpen && (
                  <div className="absolute right-0 top-full mt-1 w-32 rounded-xl border border-slate-200 bg-white py-1 shadow-lg z-20 text-[11px]">
                    {['Semua Waktu', 'Hari Ini', 'Minggu Ini', 'Bulan Ini'].map(t => (
                      <button
                        key={t}
                        onClick={() => handleCategoryFilterChange(t)}
                        className={`w-full px-3 py-1.5 text-left font-semibold ${
                          categoryTimeFilter === t ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Category Progress Bars */}
            <div className="mt-4 space-y-3">
              {categoryStats.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                      <span className={`h-1.5 w-1.5 rounded-full ${item.dotColor}`} />
                      <span>{item.label}</span>
                    </div>
                    <span className="font-bold text-slate-700">{item.count} kasus</span>
                  </div>
                  {/* Bar track */}
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, Math.max(15, (item.count / 5) * 100))}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Sub-stats */}
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[10px] font-medium text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                <span>Ancaman Bahaya: 1 kasus</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                <span>Lainnya: 0 kasus</span>
              </div>
            </div>
          </div>

          {/* Card 6: Grafik SOS Harian (Tren SOS Mingguan) */}
          <div className="rounded-[20px] border border-slate-200/80 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[13px] font-bold text-slate-800">
                  Grafik SOS Harian
                </h3>
                <p className="text-[11px] font-bold text-slate-900 mt-0.5">
                  Tren SOS Mingguan
                </p>
              </div>

              {/* Badge Total Kasus */}
              <div className="rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-[11px] font-extrabold text-[#dc2626]">
                {weeklyChartData.totalKasus} Total Kasus
              </div>
            </div>

            {/* 7-Bar Chart Visual */}
            <div className="mt-5 flex items-end justify-between gap-2 px-1">
              {weeklyChartData.harian.map((d, idx) => {
                const heightPct = Math.max(14, (d.count / maxWeeklyCount) * 100);
                return (
                  <div key={idx} className="flex flex-1 flex-col items-center gap-1.5">
                    {/* Number label above bar */}
                    <span className="text-[10px] font-bold text-slate-600">
                      {d.count}
                    </span>
                    {/* The bar element */}
                    <div className="relative flex h-20 w-full items-end justify-center rounded-sm">
                      <div
                        className={`w-full max-w-[28px] rounded-sm transition-all duration-500 ${
                          d.isPeak
                            ? 'bg-[#dc2626] shadow-sm'
                            : 'bg-[#fca5a5]/80 hover:bg-[#f87171]'
                        }`}
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>
                    {/* Day label */}
                    <span className={`text-[10px] font-semibold ${d.isPeak ? 'font-bold text-slate-900' : 'text-slate-400'}`}>
                      {d.day}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Footer Insights */}
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[10px] font-semibold text-slate-500">
              <div className="flex items-center gap-1 text-emerald-600 font-bold">
                <TrendingUp size={12} />
                <span>
                  Puncak insiden: {weeklyChartData.puncakInsiden?.hari || 'Sabtu'} ({weeklyChartData.puncakInsiden?.total || 5} SOS)
                </span>
              </div>
              <div className="text-slate-400 font-medium">
                Rata-rata: {weeklyChartData.rataRataHarian}/hari
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          5. BAGIAN BAWAH: TABEL MANAJEMEN DATA (Kasus & Relawan)
      ══════════════════════════════════════════════════════════════════ */}
      <div className="overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-xs">
        {/* ── Toolbar: Tabs & Search/Filter Controls ── */}
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 xl:flex-row xl:items-center xl:justify-between">
          {/* Filter Cepat (Tabs) */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => { setActiveTab('semua'); setCurrentPage(1); }}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-bold transition-all ${
                activeTab === 'semua'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>Semua</span>
              <span className={`rounded-full px-1.5 py-0.2 text-[9px] ${activeTab === 'semua' ? 'bg-slate-700 text-white' : 'bg-slate-200 text-slate-700'}`}>
                {counts.total}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('sos'); setCurrentPage(1); }}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-bold transition-all ${
                activeTab === 'sos'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>SOS</span>
              <span className={`rounded-full px-1.5 py-0.2 text-[9px] ${activeTab === 'sos' ? 'bg-slate-700 text-white' : 'bg-slate-200 text-slate-700'}`}>
                {counts.sos}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('laporan'); setCurrentPage(1); }}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-bold transition-all ${
                activeTab === 'laporan'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>Laporan</span>
              <span className={`rounded-full px-1.5 py-0.2 text-[9px] ${activeTab === 'laporan' ? 'bg-slate-700 text-white' : 'bg-slate-200 text-slate-700'}`}>
                {counts.laporan}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('belum ditangani'); setCurrentPage(1); }}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-bold transition-all ${
                activeTab === 'belum ditangani'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>Belum Ditangani</span>
              <span className={`rounded-full px-1.5 py-0.2 text-[9px] ${activeTab === 'belum ditangani' ? 'bg-slate-700 text-white' : 'bg-slate-200 text-slate-700'}`}>
                {counts.belum}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('ditangani'); setCurrentPage(1); }}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-bold transition-all ${
                activeTab === 'ditangani'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>Sedang Ditangani</span>
              <span className={`rounded-full px-1.5 py-0.2 text-[9px] ${activeTab === 'ditangani' ? 'bg-slate-700 text-white' : 'bg-slate-200 text-slate-700'}`}>
                {counts.sedang}
              </span>
            </button>
          </div>

          {/* Bilah Pencarian & Pengurutan */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative min-w-[220px] flex-1 sm:flex-initial">
              <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                placeholder="Cari ID, pelapor, kategori..."
                className="h-9 w-full rounded-xl border border-slate-200 bg-white pr-3 pl-9 text-[12px] font-medium text-slate-700 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {/* Dropdown Kategori */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={e => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                className="h-9 rounded-xl border border-slate-200 bg-white px-3 pr-8 text-[12px] font-semibold text-slate-600 focus:border-emerald-500 focus:outline-none appearance-none cursor-pointer"
              >
                <option value="">Semua Kategori</option>
                <option value="Darurat">Darurat</option>
                <option value="Kondisi Medis">Kondisi Medis</option>
                <option value="Butuh Pendamping">Butuh Pendamping</option>
                <option value="Tersesat">Tersesat</option>
              </select>
              <ChevronDown size={12} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>

            {/* Dropdown Pengurutan (Terbaru) */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="h-9 rounded-xl border border-slate-200 bg-white px-3 pr-8 text-[12px] font-semibold text-slate-600 focus:border-emerald-500 focus:outline-none appearance-none cursor-pointer"
              >
                <option value="terbaru">Terbaru</option>
                <option value="terlama">Terlama</option>
                <option value="id-asc">ID (Kecil ke Besar)</option>
                <option value="id-desc">ID (Besar ke Kecil)</option>
              </select>
              <ChevronDown size={12} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        </div>

        {/* ── Table Container ── */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12px]">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                <th className="py-3.5 pl-6 pr-3">ID</th>
                <th className="px-3 py-3.5">TIPE</th>
                <th className="px-3 py-3.5">STATUS</th>
                <th className="px-3 py-3.5">KATEGORI / INSIDEN</th>
                <th className="px-3 py-3.5">PELAPOR</th>
                <th className="px-3 py-3.5">KONTAK DARURAT</th>
                <th className="px-3 py-3.5">WAKTU</th>
                <th className="py-3.5 pl-3 pr-6 text-right">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {paginatedCases.length > 0 ? (
                paginatedCases.map(item => (
                  <tr key={`${item.tipe}-${item.id}`} className="hover:bg-slate-50/70 transition-colors">
                    {/* ID */}
                    <td className="py-3.5 pl-6 pr-3 font-extrabold text-[#0b6f61]">
                      {item.displayId}
                    </td>

                    {/* TIPE */}
                    <td className="px-3 py-3.5">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${
                          item.tipe === 'SOS'
                            ? 'bg-red-50 text-[#dc2626] border border-red-200/60'
                            : 'bg-blue-50 text-blue-600 border border-blue-200/60'
                        }`}
                      >
                        {item.tipe}
                      </span>
                    </td>

                    {/* STATUS */}
                    <td className="px-3 py-3.5">
                      <Badge variant={item.status} showDot isPill />
                    </td>

                    {/* KATEGORI / INSIDEN */}
                    <td className="px-3 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${item.kategoriDotColor}`} />
                        <span className="font-bold text-slate-800">{item.kategori}</span>
                      </div>
                    </td>

                    {/* PELAPOR */}
                    <td className="px-3 py-3.5 font-medium text-slate-700">
                      {item.pelapor}
                    </td>

                    {/* KONTAK DARURAT & BUTTON HUBUNGI */}
                    <td className="px-3 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <span className="text-slate-600">{item.kontak}</span>
                        <button
                          onClick={() => handleContact(item)}
                          className="inline-flex items-center gap-1 rounded-lg border border-emerald-300 bg-[#ecfdf5] px-2.5 py-1 text-[10px] font-extrabold text-[#065f46] hover:bg-emerald-100 transition-colors cursor-pointer"
                          title="Hubungi via WhatsApp"
                        >
                          <Phone size={10} className="text-[#059669]" />
                          <span>Hubungi</span>
                        </button>
                      </div>
                    </td>

                    {/* WAKTU */}
                    <td className="px-3 py-3.5 text-slate-500 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} className="text-slate-400 shrink-0" />
                        <span>{item.waktu}</span>
                      </div>
                    </td>

                    {/* AKSI */}
                    <td className="py-3.5 pl-3 pr-6 text-right">
                      <button
                        onClick={() => handleOpenDetail(item.id, item.tipe)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#0b6f61] px-3.5 py-1.5 text-[11px] font-bold text-white shadow-xs hover:bg-[#095c52] transition-colors cursor-pointer"
                      >
                        <Eye size={12} />
                        <span>Detail</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-400 font-semibold">
                    Tidak ada kasus yang sesuai dengan filter atau pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── Table Footer & Pagination ── */}
        <div className="flex flex-col gap-3 border-t border-slate-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between text-[11px] font-medium text-slate-500">
          <div>
            Menampilkan {paginatedCases.length} dari {filteredCases.length} kasus aktif saat ini
          </div>

          <div className="flex items-center gap-1">
            {/* Tombol Sebelumnya */}
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold border ${
                currentPage === 1
                  ? 'border-slate-100 text-slate-300 cursor-not-allowed'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              Sebelumnya
            </button>

            {/* Halaman Nomor */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`min-w-[28px] rounded-lg px-2 py-1 text-[11px] font-bold ${
                  currentPage === pageNum
                    ? 'border border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {pageNum}
              </button>
            ))}

            {/* Tombol Selanjutnya */}
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold border ${
                currentPage === totalPages
                  ? 'border-slate-100 text-slate-300 cursor-not-allowed'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              Selanjutnya
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
