import { useState, useEffect, useMemo } from 'react';
import {
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
import echo from '../../api/libs/echo';

// ─── CONSTANTS ─────────────────────────────────────────────────────────
const CATEGORY_COLOR_PALETTE = ['#f43f5e', '#10b981', '#3b82f6', '#dc2626', '#f59e0b', '#8b5cf6'];
const PAGE_SIZE = 10;
const CHART_BAR_MIN_HEIGHT = 14;

export default function DashboardPage() {
  const navigate = useNavigate();

  // ─── STATE MANAGEMENT ──────────────────────────────────────────────
  const [loading, setLoading] = useState(false);

  // Top KPI Stats
  const [stats, setStats] = useState(null);

  // Map Data
  const [mapMarkers, setMapMarkers] = useState([]);
  const [relawanCount, setRelawanCount] = useState(0);
  const [sosCount, setSosCount] = useState(0);
  const [laporanCount, setLaporanCount] = useState(0);

  // Category Distribution & Time filter
  const [categoryTimeFilter, setCategoryTimeFilter] = useState('Semua Waktu');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [categoryStats, setCategoryStats] = useState([]);

  // Weekly Trend Chart Data
  const [weeklyChartData, setWeeklyChartData] = useState(null);

  // Computed max values for dynamic bar scales
  const maxWeeklyCount = useMemo(() => {
    if (!weeklyChartData?.harian?.length) return 1;
    const maxVal = Math.max(...weeklyChartData.harian.map(d => d.count));
    return maxVal > 0 ? maxVal : 1;
  }, [weeklyChartData]);

  const maxCategoryCount = useMemo(() => {
    if (!categoryStats.length) return 1;
    const maxVal = Math.max(...categoryStats.map(c => c.count));
    return maxVal > 0 ? maxVal : 1;
  }, [categoryStats]);

  // Dynamic Category Sub-stats (Ancaman Bahaya & Lainnya)
  const ancamanCount = useMemo(() => {
    return categoryStats.find(c => {
      const l = (c.label || '').toLowerCase();
      return l.includes('bahaya') || l.includes('darurat') || l.includes('ancaman');
    })?.count ?? 0;
  }, [categoryStats]);

  const lainnyaCount = useMemo(() => {
    return categoryStats.find(c => {
      const l = (c.label || '').toLowerCase();
      return l.includes('lainnya') || l.includes('umum');
    })?.count ?? 0;
  }, [categoryStats]);

  // ─── TABLE SEARCH & PAGINATION STATE ──────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(PAGE_SIZE);

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
        const sosHariIni = d.kpi?.panggilan_sos_hari_ini?.total ?? 0;
        const lapHariIni = d.kpi?.jumlah_laporan_hari_ini?.total ?? 0;
        const totalToday = sosHariIni + lapHariIni;

        setStats({
          kasusHariIni: d.kpi?.kasus_periode?.hari_ini ?? d.kpi?.total_kasus_hari_ini ?? totalToday,
          kasusMingguLalu: d.kpi?.kasus_periode?.minggu_lalu ?? d.kpi?.total_kasus_minggu_lalu ?? 0,
          kasusBulanLalu: d.kpi?.kasus_periode?.bulan_lalu ?? d.kpi?.total_kasus_bulan_lalu ?? 0,
          daruratSosAktif: d.kpi?.darurat_sos_aktif?.total ?? 0,
          relawanAktif: d.kpi?.relawan_siaga_aktif?.siaga_bebas ?? d.kpi?.relawan_siaga_aktif?.total_personel ?? 0,
        });
      } else {
        setStats(prev => prev ?? {
          kasusHariIni: 0,
          kasusMingguLalu: 0,
          kasusBulanLalu: 0,
          daruratSosAktif: 0,
          relawanAktif: 0,
        });
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
            lokasi: sos.alamat || sos.lokasi_kejadian || sos.lokasi || '-',
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
            label: `${idKasus}${lap.kategori ? ' • ' + lap.kategori : ''}`,
            pelapor: lap.pelapor,
            kategori: lap.kategori || '-',
            status: lap.status,
            lokasi: lap.lokasi_laporan || lap.alamat || lap.lokasi || '-',
            lat: lap.latitude,
            lng: lap.longitude,
          });
        });

        (p.posisi_relawan || []).forEach(rel => {
          const cleanName = rel.nama ? rel.nama.replace(/\s*\(Relawan\)/i, '').trim() : 'Relawan';
          points.push({
            id: rel.id,
            displayId: `REL-${rel.id}`,
            type: 'relawan',
            label: cleanName,
            pelapor: cleanName,
            kategori: rel.kompetensi || 'Relawan Lapangan',
            status: rel.status,
            lokasi: rel.lokasi_user ? rel.lokasi_user.replace(/Posko\s+/gi, '').trim() : '-',
            lat: rel.latitude,
            lng: rel.longitude,
          });
        });

        setMapMarkers(points);

        setSosCount(summary.total_sos_aktif ?? (p.titik_darurat_sos?.length || 0));
        setLaporanCount(summary.total_laporan_aktif ?? (p.titik_laporan_aktif?.length || 0));
        const siaga = summary.total_relawan_siaga_bebas;
        const posRelawanLen = p.posisi_relawan?.length || 0;
        setRelawanCount(siaga !== undefined && siaga !== null ? siaga : posRelawanLen);
      }

      // Process Sebaran Kategori Laporan
      if (sebaranRes.status === 'fulfilled' && sebaranRes.value?.data?.sebaran_kategori_laporan) {
        const rawCats = sebaranRes.value.data.sebaran_kategori_laporan;
        const mapped = rawCats.map((item, idx) => ({
          label: item.label || item.kategori,
          count: item.jumlah,
          color: CATEGORY_COLOR_PALETTE[idx % CATEGORY_COLOR_PALETTE.length],
          dotColor: `bg-[${CATEGORY_COLOR_PALETTE[idx % CATEGORY_COLOR_PALETTE.length]}]`,
        }));
        setCategoryStats(mapped);
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
        setWeeklyChartData({
          totalKasus: g.total_kasus ?? 0,
          rataRataHarian: g.rata_rata_harian ?? 0,
          puncakInsiden: g.puncak_insiden || { hari: '-', total: 0 },
          harian: mappedHarian,
        });
      } else {
        setWeeklyChartData(prev => prev ?? {
          totalKasus: 0,
          rataRataHarian: 0,
          puncakInsiden: { hari: '-', total: 0 },
          harian: [
            { day: 'Min', count: 0, isPeak: false },
            { day: 'Sen', count: 0, isPeak: false },
            { day: 'Sel', count: 0, isPeak: false },
            { day: 'Rab', count: 0, isPeak: false },
            { day: 'Kam', count: 0, isPeak: false },
            { day: 'Jum', count: 0, isPeak: false },
            { day: 'Sab', count: 0, isPeak: false },
          ],
        });
      }

      // Process Cases Table (Hanya Kasus SOS Aktif)
      if (tugasRes.status === 'fulfilled' && tugasRes.value?.data) {
        const d = tugasRes.value.data;
        const rawSos = d.sos?.data || (Array.isArray(d.sos) ? d.sos : []);

        const activeSos = rawSos.filter(s => {
          const st = (s.status_raw || s.status || '').toLowerCase();
          return st !== 'selesai' && st !== 'batal';
        });

        const sosCases = activeSos.map(s => ({
          id: s.id,
          displayId: s.id_kasus || s.nomor_kasus || `#SOS-${s.id}`,
          tipe: 'SOS',
          status: (s.status_raw || s.status || 'ditangani').toLowerCase(),
          kategori: s.sub_judul || s.jenis_laporan || 'Darurat SOS',
          kategoriDotColor: 'bg-[#dc2626]',
          pelapor: s.pelapor?.name || '-',
          kontak: s.pelapor?.no_telp || '-',
          kontakWa: s.pelapor?.no_telp_wa || s.pelapor?.no_telp || null,
          whatsappUrl: s.pelapor?.whatsapp_url,
          waktu: formatWaktu(s.waktu),
          rawDate: s.waktu || new Date().toISOString(),
        }));

        setCasesList(sosCases);
      } else {
        setCasesList([]);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setCasesList([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper date formatter: "10 Okt • 14:20 WIB"
  const formatWaktu = (dateStr) => {
    if (!dateStr) return '-';
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
      return '-';
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // ─── LARAVEL REVERB WEBSOCKET SUBSCRIPTION ──────────────────────
    const channel = echo.channel('command-center');

    // 1. Relawan Location Real-time Update
    channel.listen('.RelawanLocationUpdate', (data) => {
      console.log('[Reverb Real-time] RelawanLocationUpdate:', data);
      if (!data.relawan_id) return;

      setMapMarkers((prev) => {
        const index = prev.findIndex(
          (m) => m.type === 'relawan' && String(m.id) === String(data.relawan_id)
        );

        const cleanName = data.nama ? data.nama.replace(/\s*\(Relawan\)/i, '').trim() : 'Relawan';
        const updatedItem = {
          id: data.relawan_id,
          displayId: `REL-${data.relawan_id}`,
          type: 'relawan',
          label: cleanName,
          pelapor: cleanName,
          kategori: 'Relawan Lapangan',
          status: data.status || 'siaga_bebas',
          lokasi: data.lokasi_user ? data.lokasi_user.replace(/Posko\s+/gi, '').trim() : '-',
          lat: parseFloat(data.latitude),
          lng: parseFloat(data.longitude),
          heading: data.heading,
        };

        if (index >= 0) {
          const next = [...prev];
          next[index] = { ...next[index], ...updatedItem };
          return next;
        } else {
          return [...prev, updatedItem];
        }
      });
    });

    // 2. SOS Baru Dibuat
    channel.listen('.SOSCreated', (data) => {
      console.log('[Reverb Real-time] SOSCreated:', data);
      fetchDashboardData();
    });

    // 3. Status SOS Diperbarui (Relawan Ambil / Selesai / Batal)
    channel.listen('.SOSUpdateStatus', (data) => {
      console.log('[Reverb Real-time] SOSUpdateStatus:', data);
      fetchDashboardData();
    });

    // 4. Laporan Warga Baru Dibuat
    channel.listen('.LaporanCreated', (data) => {
      console.log('[Reverb Real-time] LaporanCreated:', data);
      fetchDashboardData();
    });

    // 5. Status Relawan Diperbarui (Aktif / Nonaktif)
    channel.listen('.RelawanStatusUpdated', (data) => {
      console.log('[Reverb Real-time] RelawanStatusUpdated:', data);
      fetchDashboardData();
    });

    return () => {
      echo.leaveChannel('command-center');
    };
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
        const mapped = rawCats.map((item, idx) => ({
          label: item.label || item.kategori,
          count: item.jumlah,
          color: CATEGORY_COLOR_PALETTE[idx % CATEGORY_COLOR_PALETTE.length],
          dotColor: `bg-[${CATEGORY_COLOR_PALETTE[idx % CATEGORY_COLOR_PALETTE.length]}]`,
        }));
        setCategoryStats(mapped);
      }
    } catch (e) {
      console.error('Gagal memfilter sebaran kategori:', e);
    }
  };

  // Filtered & Sorted Cases for the Data Table (Hanya Kasus SOS Aktif)
  const filteredCases = useMemo(() => {
    return casesList
      .filter(item => {
        if (item.tipe !== 'SOS') return false;
        if (item.status === 'selesai' || item.status === 'batal') return false;

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchId = String(item.id).toLowerCase().includes(q) || item.displayId?.toLowerCase().includes(q);
          const matchPelapor = item.pelapor?.toLowerCase().includes(q);
          const matchKategori = item.kategori?.toLowerCase().includes(q);
          return matchId || matchPelapor || matchKategori;
        }

        return true;
      })
      .sort((a, b) => new Date(b.rawDate) - new Date(a.rawDate));
  }, [casesList, searchQuery]);

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

  const handleOpenDetail = (id, type, item) => {
    if (type === 'relawan') {
      const searchParam = item?.pelapor ? `?search=${encodeURIComponent(item.pelapor)}` : (id ? `?id=${id}` : '');
      navigate(`/manajemen-user${searchParam}`);
      return;
    }
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
          {/* Card 1: Grafik SOS Harian (Tren SOS Mingguan) */}
          <div className="rounded-[20px] border border-slate-200/80 bg-white p-5 shadow-xs">
            {loading && !weeklyChartData ? (
              <div className="animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="space-y-1.5">
                    <div className="h-4 w-28 rounded bg-slate-200" />
                    <div className="h-3 w-20 rounded bg-slate-100" />
                  </div>
                  <div className="h-6 w-24 rounded-full bg-slate-100" />
                </div>
                <div className="mt-6 flex items-end justify-between gap-2 px-1">
                  {[35, 60, 45, 80, 25, 55, 90].map((h, i) => (
                    <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
                      <div className="h-3 w-3 rounded bg-slate-100" />
                      <div className="relative flex h-20 w-full items-end justify-center rounded-sm">
                        <div className="w-full max-w-[28px] rounded-sm bg-slate-200" style={{ height: `${h}%` }} />
                      </div>
                      <div className="h-3 w-5 rounded bg-slate-100" />
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                  <div className="h-3 w-36 rounded bg-slate-100" />
                  <div className="h-3 w-20 rounded bg-slate-100" />
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-[13px] font-bold text-slate-800">
                      Grafik SOS pekan ini
                    </h3>
                  </div>

                  {/* Badge Total Kasus */}
                  <div className="rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-[11px] font-extrabold text-[#dc2626]">
                    {weeklyChartData?.totalKasus ?? 0} Total Kasus
                  </div>
                </div>

                {/* 7-Bar Chart Visual */}
                <div className="mt-5 flex items-end justify-between gap-2 px-1">
                  {(weeklyChartData?.harian || []).map((d, idx) => {
                    const heightPct = Math.max(CHART_BAR_MIN_HEIGHT, (d.count / maxWeeklyCount) * 100);
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
                      Puncak insiden: {weeklyChartData?.puncakInsiden?.hari || '-'} ({weeklyChartData?.puncakInsiden?.total ?? 0} SOS)
                    </span>
                  </div>
                  <div className="text-slate-400 font-medium">
                    Rata-rata: {weeklyChartData?.rataRataHarian ?? 0}/hari
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Card 2: Statistik Kasus (Hari Ini, Minggu Lalu, Bulan Lalu) */}
          <div className="relative overflow-hidden rounded-[20px] border border-slate-200/80 bg-white p-5 shadow-xs transition-shadow hover:shadow-sm">
            {loading && !stats ? (
              <div className="animate-pulse space-y-4">
                <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
                  <div className="space-y-1.5">
                    <div className="h-4 w-28 rounded bg-slate-200" />
                    <div className="h-3 w-36 rounded bg-slate-100" />
                  </div>
                  <div className="h-9 w-9 rounded-xl bg-slate-100" />
                </div>
                <div className="grid grid-cols-3 divide-x divide-slate-100 text-center">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="px-1.5 space-y-1">
                      <div className="mx-auto h-3 w-14 rounded bg-slate-100" />
                      <div className="mx-auto h-7 w-10 rounded bg-slate-200" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
                  <div>
                    <h3 className="text-[13px] font-bold text-slate-800">
                      Statistik Kasus
                    </h3>
                    <p className="text-[11px] font-bold text-slate-900 mt-0.5">
                      Total Laporan & SOS
                    </p>
                  </div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-200/90 bg-[#ecfdf5] text-emerald-600">
                    <FileText size={18} />
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 divide-x divide-slate-100 text-center">
                  <div className="px-1.5">
                    <span className="text-[11px] font-semibold text-slate-500 block">
                      Hari Ini
                    </span>
                    <span className="text-2xl font-black tracking-tight text-slate-900 mt-1 block">
                      {stats?.kasusHariIni ?? 0}
                    </span>
                  </div>
                  <div className="px-1.5">
                    <span className="text-[11px] font-semibold text-slate-500 block">
                      Minggu Lalu
                    </span>
                    <span className="text-2xl font-black tracking-tight text-slate-900 mt-1 block">
                      {stats?.kasusMingguLalu ?? 0}
                    </span>
                  </div>
                  <div className="px-1.5">
                    <span className="text-[11px] font-semibold text-slate-500 block">
                      Bulan Lalu
                    </span>
                    <span className="text-2xl font-black tracking-tight text-slate-900 mt-1 block">
                      {stats?.kasusBulanLalu ?? 0}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Card 3: Sebaran Kategori Laporan */}
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
            {loading && categoryStats.length === 0 ? (
              <div className="mt-4 space-y-3 animate-pulse">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between">
                      <div className="h-3 w-24 rounded bg-slate-200" />
                      <div className="h-3 w-10 rounded bg-slate-100" />
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-100" />
                  </div>
                ))}
              </div>
            ) : categoryStats.length === 0 ? (
              <div className="py-6 text-center text-[12px] text-slate-400 font-medium">
                Belum ada data kategori laporan
              </div>
            ) : (
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
                          width: `${Math.min(100, Math.max(12, (item.count / maxCategoryCount) * 100))}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Bottom Sub-stats */}
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[10px] font-medium text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                <span>Ancaman Bahaya: {ancamanCount} kasus</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                <span>Lainnya: {lainnyaCount} kasus</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          5. BAGIAN BAWAH: TABEL MANAJEMEN DATA (Kasus & Relawan)
      ══════════════════════════════════════════════════════════════════ */}
      <div className="overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-xs">
        {/* ── Header Tabel: Kasus Darurat SOS Aktif ── */}
        <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-4.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <h2 className="text-[15px] font-extrabold tracking-tight text-slate-900">
              Daftar Kasus Darurat SOS Aktif
            </h2>
            <span className="rounded-full bg-red-50 border border-red-200/80 px-2.5 py-0.5 text-[11px] font-bold text-red-600">
              {filteredCases.length} Kasus Aktif
            </span>
          </div>

          {/* Bilah Pencarian */}
          <div className="relative min-w-[240px]">
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Cari ID, pelapor, atau insiden..."
              className="h-9 w-full rounded-xl border border-slate-200 bg-white pr-3 pl-9 text-[12px] font-medium text-slate-700 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none"
            />
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
                <th className="px-3 py-3.5">KONTAK PELAPOR</th>
                <th className="px-3 py-3.5">WAKTU</th>
                <th className="py-3.5 pl-3 pr-6 text-right">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {loading && casesList.length === 0 ? (
                [1, 2, 3, 4].map((i) => (
                  <tr key={`skeleton-${i}`} className="animate-pulse">
                    <td className="py-4 pl-6 pr-3"><div className="h-3.5 w-14 rounded bg-slate-200" /></td>
                    <td className="px-3 py-4"><div className="h-4 w-12 rounded-full bg-slate-200" /></td>
                    <td className="px-3 py-4"><div className="h-4 w-20 rounded-full bg-slate-200" /></td>
                    <td className="px-3 py-4"><div className="h-3.5 w-28 rounded bg-slate-200" /></td>
                    <td className="px-3 py-4"><div className="h-3.5 w-24 rounded bg-slate-200" /></td>
                    <td className="px-3 py-4"><div className="h-3.5 w-24 rounded bg-slate-200" /></td>
                    <td className="px-3 py-4"><div className="h-3.5 w-20 rounded bg-slate-200" /></td>
                    <td className="py-4 pl-3 pr-6 text-right"><div className="ml-auto h-7 w-16 rounded-lg bg-slate-200" /></td>
                  </tr>
                ))
              ) : paginatedCases.length > 0 ? (
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
                    Tidak ada kasus darurat SOS aktif saat ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── Table Footer & Pagination ── */}
        <div className="flex flex-col gap-3 border-t border-slate-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between text-[11px] font-medium text-slate-500">
          <div>
            Menampilkan {paginatedCases.length} dari {filteredCases.length} darurat SOS aktif saat ini
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
