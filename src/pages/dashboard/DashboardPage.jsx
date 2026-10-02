import { useState, useEffect } from 'react';
import { RefreshCw, ArrowRight, Users } from 'lucide-react';
import StatCard from '../../components/global/StatCard';
import SOSCard from '../../components/global/SOSCard';
import MapPanel from '../../components/MapPanel';
import VolunteerCard from '../../components/global/VolunteerCard';
import DonutChart from '../../components/global/DonutChart';
import { sosCases, volunteers, kategoriLaporan } from '../../utils/dummyData';
import { adminService } from '../../api/services/adminService';

// Show only 2 active cases on dashboard (progressive disclosure)
const dashboardCases = sosCases.slice(0, 2);
// Show only 3 volunteers on dashboard
const dashboardVolunteers = volunteers.slice(0, 3);

import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const navigate = useNavigate();
  const onOpenDetail = (id) => navigate('/detail-kasus/' + id);
  const [stats, setStats] = useState({
    total_pengguna: 0,
    total_relawan: 0,
    total_admin: 0,
    active_sos: 0,
    total_laporan: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await adminService.getDashboardStats();
      if (res && res.stats) setStats(res.stats);
    } catch (error) {
      console.error('Gagal mengambil data statistik', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  const dynamicStatCards = [
    { id: 'total-pengguna', label: 'Total Pengguna', value: stats.total_pengguna, trendLabel: 'Total pengguna terdaftar', icon: 'Phone', iconBg: 'bg-[#ecfdf5]', iconColor: 'text-[#10b981]' },
    { id: 'jumlah-laporan', label: 'Jumlah Laporan', value: stats.total_laporan, trendLabel: 'Total laporan masuk', icon: 'FileText', iconBg: 'bg-[#f5f3ff]', iconColor: 'text-[#8b5cf6]' },
    { id: 'darurat-aktif', label: 'Darurat SOS Aktif', value: stats.active_sos, trendLabel: 'Butuh respon segera', icon: 'AlertTriangle', iconBg: 'bg-[#fef2f2]', iconColor: 'text-[#ef4444]', isAlert: true },
    { id: 'relawan-aktif', label: 'Relawan Aktif', value: stats.total_relawan, valueSuffix: 'orang', trendLabel: 'Total relawan terdaftar', icon: 'ShieldCheck', iconBg: 'bg-[#f0fdf4]', iconColor: 'text-[#059669]' },
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

      {/* Main Content â€” 2 columns */}
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
              {dashboardCases.map(kasus => (
                <SOSCard key={kasus.id} kasus={kasus} onOpenDetail={onOpenDetail} />
              ))}
            </div>
          </div>

          {/* Kategori Kasus */}
          <div className="card p-5">
            <div className="mb-4">
              <h2 className="text-[15px] font-bold text-slate-900">Kategori Kasus</h2>
              <p className="text-[12px] text-slate-400 mt-0.5">Distribusi laporan berdasarkan kategori</p>
            </div>
            <DonutChart items={kategoriLaporan} total={stats.total_laporan || 15} />
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col gap-6">
          {/* Peta */}
          <MapPanel relawanCount={54} onOpenDetail={onOpenDetail} showLegend={false} />

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
              {dashboardVolunteers.map(vol => (
                <VolunteerCard key={vol.id} volunteer={vol} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

