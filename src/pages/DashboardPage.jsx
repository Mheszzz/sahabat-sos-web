import { useState, useEffect } from 'react';
import { RefreshCw, ArrowRight, Users, Phone, FileText, AlertTriangle, ShieldCheck } from 'lucide-react';
import StatCard from '../components/StatCard';
import SOSCard from '../components/SOSCard';
import MapPanel from '../components/MapPanel';
import VolunteerCard from '../components/VolunteerCard';
import DonutChart from '../components/DonutChart';
import { sosCases, volunteers, kategoriLaporan } from '../data/dummyData';
import { adminService } from '../services/adminService';

const dashboardCases = sosCases.slice(0, 3);

export default function DashboardPage({ onOpenDetail }) {
  const [stats, setStats] = useState({
    total_pengguna: 0,
    total_relawan: 0,
    total_admin: 0,
    active_sos: 0,
    total_laporan: 0,
  });
  const [loading, setLoading] = useState(true);

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
    { id: 'jumlah-laporan', label: 'Jumlah Laporan Kasus', value: stats.total_laporan, trendLabel: 'Total laporan masuk', icon: 'FileText', iconBg: 'bg-[#f5f3ff]', iconColor: 'text-[#8b5cf6]' },
    { id: 'darurat-aktif', label: 'Darurat SOS Aktif', value: stats.active_sos, trendLabel: 'Butuh respon segera', icon: 'AlertTriangle', iconBg: 'bg-[#fef2f2]', iconColor: 'text-[#ef4444]', isAlert: true },
    { id: 'relawan-aktif', label: 'Relawan Siap Aktif', value: stats.total_relawan, valueSuffix: 'orang', trendLabel: 'Total relawan terdaftar', icon: 'ShieldCheck', iconBg: 'bg-[#f0fdf4]', iconColor: 'text-[#059669]' },
  ];

  return (
    // gap-5 dipakai konsisten di SEMUA level (antar section, antar card, antar kolom)
    <div className="space-y-5">

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-[22px] font-extrabold tracking-[-0.03em] text-slate-900 sm:text-[26px]">
            Dashboard Utama
          </h1>
          <p className="mt-1 text-[13px] font-medium text-slate-400">
            Pantau kondisi SOS, laporan aktif, dan ketersediaan relawan secara real-time.
          </p>
        </div>
        <div className="flex items-center gap-3 text-[12px] text-slate-500">
          <button
            onClick={fetchStats}
            className={`flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 transition-colors hover:text-slate-700 ${loading ? 'animate-spin' : ''}`}
            title="Muat Ulang Data"
          >
            <RefreshCw size={13} />
          </button>
          <div className="text-right leading-tight">
            <p className="text-[11px] text-slate-400">Terakhir diperbarui</p>
            <p className="font-bold text-slate-700">Baru saja</p>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {dynamicStatCards.map(card => <StatCard key={card.id} card={card} />)}
      </div>

      {/* Konten utama — 2 kolom, tiap kolom isinya 2 card ditumpuk (gap-5) */}
      <div className="mt-6 grid grid-cols-1 items-start gap-5 xl:grid-cols-[1.6fr_1fr]">

        {/* ── KOLOM KIRI ── */}
        <div className="flex flex-col gap-5">
          {/* Kasus Aktif */}
          <div className="rounded-2xl border border-[#e4e7eb] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <div className="mb-4 flex items-center justify-between border-b border-[#eef2f7] pb-3.5">
              <div className="flex items-center gap-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ef4444] pulse-soft" />
                <div>
                  <h2 className="text-[15px] font-bold text-slate-900">Kasus Aktif</h2>
                  <p className="text-[11.5px] font-medium text-slate-400">Daftar laporan SOS yang sedang ditangani</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-500">
                  {dashboardCases.length} Kasus Aktif
                </span>
                <button
                  onClick={() => onOpenDetail?.('all')}
                  className="inline-flex items-center gap-1 text-[12px] font-bold text-slate-500 hover:text-slate-800"
                >
                  Lihat Semua <ArrowRight size={13} />
                </button>
              </div>
            </div>
            <div className="space-y-3">
              {dashboardCases.map(kasus => (
                <SOSCard key={kasus.id} kasus={kasus} onOpenDetail={onOpenDetail} />
              ))}
            </div>
          </div>

          {/* Kategori Kasus (pindah ke kolom kiri, biar sejajar tinggi dengan kolom kanan) */}
          <div className="rounded-2xl border border-[#e4e7eb] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <div className="mb-4 border-b border-[#eef2f7] pb-3.5">
              <h2 className="text-[15px] font-bold text-slate-900">Kategori Kasus</h2>
              <p className="text-[11.5px] font-medium text-slate-400">Distribusi laporan berdasarkan kategori</p>
            </div>
            <DonutChart items={kategoriLaporan} total={stats.total_laporan || 15} />
          </div>
        </div>

        {/* ── KOLOM KANAN ── */}
        <div className="flex flex-col gap-5">
          <MapPanel relawanCount={54} onOpenDetail={onOpenDetail} showLegend={false} />

          <div className="rounded-2xl border border-[#e4e7eb] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <div className="mb-3 flex items-center justify-between border-b border-[#eef2f7] pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <Users size={14} className="text-[#059669]" />
                  <h2 className="text-[15px] font-bold text-slate-900">Relawan Siap Beroperasi</h2>
                </div>
                <p className="mt-0.5 text-[11.5px] font-medium text-slate-400">Daftar relawan yang tersedia dan sedang bertugas</p>
              </div>
              <button className="inline-flex shrink-0 items-center gap-1 text-[12px] font-bold text-slate-500 hover:text-slate-800">
                Lihat Semua <ArrowRight size={13} />
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {volunteers.slice(0, 5).map(vol => (
                <VolunteerCard key={vol.id} relawan={vol} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}