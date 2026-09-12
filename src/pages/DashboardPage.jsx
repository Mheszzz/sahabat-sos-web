import { useState, useEffect } from 'react';
import { RefreshCw, Phone, FileText, AlertTriangle, ShieldCheck } from 'lucide-react';
import StatCard from '../components/StatCard';
import SOSCard from '../components/SOSCard';
import MapPanel from '../components/MapPanel';
import VolunteerCard from '../components/VolunteerCard';
import ProgressBarChart from '../components/ProgressBarChart';
import DonutChart from '../components/DonutChart';
import { sosCases, volunteers, kategoriDifabel, kategoriLaporan } from '../data/dummyData';
import { adminService } from '../services/adminService';

const dashboardCases = sosCases.slice(0, 4);

export default function DashboardPage({ onOpenDetail }) {
  const [stats, setStats] = useState({
    total_pengguna: 0,
    total_relawan: 0,
    total_admin: 0,
    active_sos: 0,
    total_laporan: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await adminService.getDashboardStats();
      if (res && res.stats) {
        setStats(res.stats);
      }
    } catch (error) {
      console.error("Gagal mengambil data statistik", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const dynamicStatCards = [
    {
      id: 'total-pengguna',
      label: 'Total Pengguna',
      value: stats.total_pengguna,
      trend: null,
      trendLabel: 'Total Pengguna Terdaftar',
      icon: 'Phone',
      iconBg: 'bg-[#ecfdf5]',
      iconColor: 'text-[#10b981]',
    },
    {
      id: 'jumlah-laporan',
      label: 'Jumlah Laporan Kasus',
      value: stats.total_laporan,
      trend: null,
      trendLabel: 'Total laporan masuk',
      icon: 'FileText',
      iconBg: 'bg-[#f5f3ff]',
      iconColor: 'text-[#8b5cf6]',
    },
    {
      id: 'darurat-aktif',
      label: 'Darurat SOS Aktif',
      value: stats.active_sos,
      trend: null,
      trendLabel: 'Butuh Respon Segera',
      icon: 'AlertTriangle',
      iconBg: 'bg-[#fef2f2]',
      iconColor: 'text-[#ef4444]',
      isAlert: true,
    },
    {
      id: 'relawan-aktif',
      label: 'Relawan Siap Aktif',
      value: stats.total_relawan,
      valueSuffix: 'orang',
      trend: null,
      trendLabel: 'Total relawan terdaftar',
      icon: 'ShieldCheck',
      iconBg: 'bg-[#f0fdf4]',
      iconColor: 'text-[#059669]',
    },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1680px] w-full mx-auto">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-black text-slate-900 tracking-tight leading-tight">
            Dashboard Utama
          </h1>
          <p className="text-[14px] text-slate-500 mt-1 font-medium">
            Pantau kondisi SOS, laporan aktif, dan ketersediaan relawan secara real-time.
          </p>
        </div>

        {/* Right Timestamp & Online Badge */}
        <div className="flex items-center gap-3 text-[12px] text-slate-500 flex-shrink-0">
          <button
            onClick={fetchStats}
            className={`w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:text-slate-700 hover:border-slate-300 transition-colors cursor-pointer ${loading ? 'animate-spin' : ''}`}
            title="Muat Ulang Data"
          >
            <RefreshCw size={13} />
          </button>
          <div className="text-right leading-tight">
            <p className="text-[11px] text-slate-400">Terakhir diperbarui</p>
            <p className="font-semibold text-slate-700">Baru saja</p>
          </div>
          <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
            <span className="font-bold text-[#059669]">Online</span>
          </div>
        </div>
      </div>

      {/* ── 4 Statistics Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {dynamicStatCards.map(card => (
          <StatCard key={card.id} card={card} />
        ))}
      </div>

      {/* ── Main Monitoring: Left (Kasus SOS) & Right (Map + Relawan) ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.58fr_1fr] gap-6 items-start">
        {/* LEFT: Kasus SOS Aktif & Laporan Terbaru */}
        <div className="bg-white border border-[#eaedf1] rounded-2xl p-5 shadow-xs">
          {/* Section Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#f1f5f9] mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ef4444] animate-pulse" />
              <h2 className="text-[15px] font-bold text-slate-900 tracking-tight">
                Kasus SOS Aktif & Laporan Terbaru
              </h2>
            </div>
            <button
              onClick={() => onOpenDetail?.('all')}
              className="text-[12px] font-semibold text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Lihat Semua</span>
              <span>→</span>
            </button>
          </div>

          {/* List of Cases */}
          <div className="space-y-3.5">
            {dashboardCases.map(kasus => (
              <SOSCard key={kasus.id} kasus={kasus} onOpenDetail={onOpenDetail} />
            ))}
          </div>
        </div>

        {/* RIGHT: Map + Relawan Terdekat */}
        <div className="space-y-6">
          {/* Map Panel */}
          <MapPanel relawanCount={54} onOpenDetail={onOpenDetail} />

          {/* Relawan Aktif Terdekat */}
          <div className="bg-white border border-[#eaedf1] rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3.5 border-b border-[#f1f5f9] mb-2">
              <h2 className="text-[14px] font-bold text-slate-900">Relawan Aktif Terdekat</h2>
              <button className="text-[12px] font-semibold text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1 cursor-pointer">
                <span>Lihat Semua</span>
                <span>→</span>
              </button>
            </div>

            <div className="divide-y divide-[#f8fafc]">
              {volunteers.map(vol => (
                <VolunteerCard key={vol.id} relawan={vol} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Section: Analytics & Statistics ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Left Analytics: Kebutuhan Difabel */}
        <div className="bg-white border border-[#eaedf1] rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3.5 border-b border-[#f1f5f9] mb-3">
            <div className="flex items-center gap-2">
              <h2 className="text-[14px] font-bold text-slate-900">Analitik & Statistik</h2>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-slate-300" />
              <span className="w-2 h-2 rounded-full bg-slate-400" />
            </div>
          </div>

          <div className="mb-2">
            <h3 className="text-[13px] font-bold text-slate-800">Kebutuhan Difabel</h3>
          </div>

          <ProgressBarChart items={kategoriDifabel} />
        </div>

        {/* Right Analytics: Persentase Kategori Laporan */}
        <div className="bg-white border border-[#eaedf1] rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3.5 border-b border-[#f1f5f9] mb-4">
            <h2 className="text-[14px] font-bold text-slate-900">Persentase Kategori Laporan</h2>
          </div>

          <DonutChart items={kategoriLaporan} total={683} />
        </div>
      </div>
    </div>
  );
}
