import { useState, useEffect } from 'react';
import { RefreshCw, ArrowRight, Users } from 'lucide-react';
import StatCard from '../../components/global/StatCard';
import SOSCard from '../../components/global/SOSCard';
import MapPanel from '../../components/MapPanel';
import VolunteerCard from '../../components/global/VolunteerCard';
import DonutChart from '../../components/global/DonutChart';
import { adminService } from '../../api/services/adminService';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const navigate = useNavigate();
  const onOpenDetail = (id, type) => {
    if (type === 'relawan') navigate('/detail-relawan/' + id);
    else if (type === 'laporan') navigate('/detail-laporan/' + id);
    else navigate('/detail-kasus/' + id);
  };
  
  const [stats, setStats] = useState({
    panggilan_sos_hari_ini: 0,
    jumlah_laporan_hari_ini: 0,
    darurat_sos_aktif: 0,
    relawan_aktif: 0,
    total_kasus: 0
  });
  
  const [dashboardCases, setDashboardCases] = useState([]);
  const [dashboardVolunteers, setDashboardVolunteers] = useState([]);
  const [kategoriLaporan, setKategoriLaporan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [relawanCount, setRelawanCount] = useState(0);
  const [mapData, setMapData] = useState([]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await adminService.getDashboardStats();
      if (res && res.data) {
        const d = res.data;
        
        // 1. KPI Stats
        setStats({
          panggilan_sos_hari_ini: d.kpi?.panggilan_sos_hari_ini?.total || 0,
          jumlah_laporan_hari_ini: d.kpi?.jumlah_laporan_hari_ini?.total || 0,
          darurat_sos_aktif: d.kpi?.darurat_sos_aktif?.total || 0,
          relawan_aktif: d.kpi?.relawan_siaga_aktif?.total_personel || 0,
          total_kasus: (d.kpi?.panggilan_sos_hari_ini?.total || 0) + (d.kpi?.jumlah_laporan_hari_ini?.total || 0)
        });

        // 2. Active Cases (antrean_kasus) mapped for SOSCard
        const mappedCases = (d.antrean_kasus || []).slice(0, 2).map(item => ({
          id: item.raw_id,
          displayId: item.id_kasus,
          type: item.tipe_kasus === 'SOS' ? 'darurat' : 'laporan',
          status: item.status,
          kategori: item.judul_insiden,
          lokasi: item.lokasi?.alamat || 'Lokasi tidak diketahui',
          waktu: item.waktu_relatif
        }));
        setDashboardCases(mappedCases);

        // 3. Volunteers (gis_map.posisi_relawan) mapped for VolunteerCard
        const volunteersList = d.gis_map?.posisi_relawan || [];
        setRelawanCount(volunteersList.length);
        const mappedVolunteers = volunteersList.slice(0, 3).map((v, i) => {
          const colors = ['bg-[#0ea5e9]', 'bg-[#10b981]', 'bg-[#f59e0b]'];
          return {
            id: v.id,
            nama: v.nama,
            avatarBg: colors[i % colors.length],
            jarak: 'GPS Aktif',
            eta: 'Tersedia',
            status: v.status === 'siaga' ? 'Standby' : 'Bertugas'
          };
        });
        setDashboardVolunteers(mappedVolunteers);

        // Parse Map Data
        const mapData = [];
        (d.gis_map?.titik_darurat || []).forEach(t => {
          mapData.push({
            id: t.id,
            displayId: t.id_kasus,
            type: 'sos',
            label: t.id_kasus,
            kategori: 'Kasus Darurat Aktif',
            prioritas: t.status === 'aktif' ? 'DARURAT' : 'Ditangani',
            pelapor: t.korban,
            lokasi: 'Lokasi Darurat SOS',
            status: t.status,
            relawan: t.relawan || 'Menunggu Penugasan',
            eta: '—',
            lat: t.latitude,
            lng: t.longitude,
            waktu: 'Baru saja'
          });
        });
        
        (d.gis_map?.posisi_relawan || []).forEach(r => {
          mapData.push({
            id: 'REL-' + r.id,
            type: 'relawan',
            label: r.nama,
            kategori: r.kompetensi || 'Relawan Siaga',
            prioritas: r.status === 'sedang_bertugas' ? 'Bertugas' : 'Siaga',
            pelapor: 'Unit Relawan',
            lokasi: r.lokasi_user || 'Area Terdekat',
            status: r.status === 'sedang_bertugas' ? 'Menuju Lokasi' : 'Siaga',
            relawan: r.nama,
            eta: '-',
            lat: r.latitude,
            lng: r.longitude,
            waktu: 'Real-time GPS'
          });
        });

        // Use setMapData (we need to add it to state)
        setMapData(mapData);

        // 4. Kategori Laporan (Donut Chart)
        const categoriesData = d.analisis?.persentase_kategori_laporan || [];
        const chartColors = ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
        const mappedCategories = categoriesData.map((cat, i) => ({
          label: cat.kategori,
          pct: cat.persentase,
          color: chartColors[i % chartColors.length]
        }));
        
        // Fallback if no categories
        if (mappedCategories.length === 0) {
          mappedCategories.push(
            { label: 'Belum Ada Laporan', pct: 100, color: '#94a3b8' }
          );
        }
        
        setKategoriLaporan(mappedCategories);
      }
    } catch (error) {
      console.error('Gagal mengambil data statistik', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  const dynamicStatCards = [
    { id: 'panggilan-sos', label: 'SOS Hari Ini', value: stats.panggilan_sos_hari_ini, trendLabel: 'Panggilan SOS hari ini', icon: 'Phone', iconBg: 'bg-[#ecfdf5]', iconColor: 'text-[#10b981]' },
    { id: 'jumlah-laporan', label: 'Jumlah Laporan', value: stats.jumlah_laporan_hari_ini, trendLabel: 'Total laporan hari ini', icon: 'FileText', iconBg: 'bg-[#f5f3ff]', iconColor: 'text-[#8b5cf6]' },
    { id: 'darurat-aktif', label: 'Darurat SOS Aktif', value: stats.darurat_sos_aktif, trendLabel: 'Butuh respon segera', icon: 'AlertTriangle', iconBg: 'bg-[#fef2f2]', iconColor: 'text-[#ef4444]', isAlert: true },
    { id: 'relawan-aktif', label: 'Relawan Aktif', value: stats.relawan_aktif, valueSuffix: 'orang', trendLabel: 'Total relawan terdaftar', icon: 'ShieldCheck', iconBg: 'bg-[#f0fdf4]', iconColor: 'text-[#059669]' },
  ];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Dashboard Utama
          </h1>
          <p className="mt-1 text-[13px] text-slate-400">
            Pantau kondisi SOS, laporan aktif, dan ketersediaan relawan.
          </p>
        </div>
        <button
          onClick={fetchStats}
          disabled={loading}
          className="btn-base btn-secondary text-[12px] h-9"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dynamicStatCards.map(card => <StatCard key={card.id} card={card} />)}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[1.5fr_1fr]">

        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-6">
          {/* Kasus Aktif */}
          <div className="card p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#ef4444] pulse-soft" />
                <h2 className="text-[15px] font-bold text-slate-900">Kasus Aktif</h2>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-500">
                  {dashboardCases.length}
                </span>
              </div>
              <button className="text-[12px] font-semibold text-slate-400 hover:text-slate-700 flex items-center gap-1">
                Lihat Semua <ArrowRight size={13} />
              </button>
            </div>
            <div className="space-y-3">
              {dashboardCases.length > 0 ? dashboardCases.map(kasus => (
                <SOSCard key={kasus.id} kasus={kasus} onOpenDetail={onOpenDetail} />
              )) : (
                <div className="text-center py-6 text-slate-400 text-sm">Tidak ada kasus aktif saat ini.</div>
              )}
            </div>
          </div>

          {/* Kategori Kasus */}
          <div className="card p-5">
            <div className="mb-4">
              <h2 className="text-[15px] font-bold text-slate-900">Kategori Kasus</h2>
              <p className="text-[12px] text-slate-400 mt-0.5">Distribusi laporan berdasarkan kategori</p>
            </div>
            <DonutChart items={kategoriLaporan} total={stats.total_kasus || 0} />
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col gap-6">
          {/* Peta */}
          <MapPanel relawanCount={relawanCount} onOpenDetail={onOpenDetail} showLegend={false} mapData={mapData} />

          {/* Relawan */}
          <div className="card p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users size={14} className="text-[#059669]" />
                <h2 className="text-[15px] font-bold text-slate-900">Relawan Siaga</h2>
              </div>
              <button className="text-[12px] font-semibold text-slate-400 hover:text-slate-700 flex items-center gap-1">
                Lihat Semua <ArrowRight size={13} />
              </button>
            </div>
            <div>
              {dashboardVolunteers.length > 0 ? dashboardVolunteers.map(vol => (
                <VolunteerCard key={vol.id} volunteer={vol} />
              )) : (
                <div className="text-center py-6 text-slate-400 text-sm">Tidak ada relawan siaga.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
