import { Plus, Activity } from 'lucide-react';
import StatCard from '../components/StatCard';
import SOSCard from '../components/SOSCard';
import MapPanel from '../components/MapPanel';
import VolunteerCard from '../components/VolunteerCard';
import ProgressBarChart from '../components/ProgressBarChart';
import { statCards, sosCases, volunteers, kategoriDifabel, kategoriLaporan } from '../data/dummyData';

const dashboardCases = sosCases.slice(0, 3);
const darurataCount = sosCases.filter(c => c.type === 'darurat' && c.status !== 'Teratasi').length;

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-slate-800">Dashboard Utama - Sahabat SOS</h1>
        <p className="text-sm text-slate-400 mt-0.5">Senin, 07 September 2026 - Pembaruan otomatis tiap 30 detik</p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map(card => (
          <StatCard key={card.id} card={card} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_360px] gap-6">
        <div className="space-y-5 min-w-0">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-sm font-bold text-slate-800">Daftar SOS Darurat dan Laporan Aktif</h2>
                <span className="flex items-center gap-1.5 bg-red-50 text-red-600 text-[11px] font-semibold px-2 py-1 rounded-full border border-red-100">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                  </span>
                  Live Status ({darurataCount} Darurat SOS)
                </span>
              </div>
              <button
                id="btn-tambah-sos"
                className="flex items-center gap-1.5 bg-[#062c26] hover:bg-emerald-900 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-all cursor-pointer shadow-sm"
              >
                <Plus size={13} />
                Tambahkan SOS Baru
              </button>
            </div>
            <div className="p-4 space-y-3">
              {dashboardCases.map(kasus => (
                <SOSCard key={kasus.id} kasus={kasus} />
              ))}
            </div>
            <div className="px-4 pb-4 text-center">
              <button className="text-xs text-slate-400 hover:text-emerald-600 font-medium transition-colors cursor-pointer">
                Lihat semua {sosCases.length} kasus aktif
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-800">Sebaran Kategori Kebutuhan Difabel</h2>
                <p className="text-xs text-slate-400 mt-0.5">Total: <span className="font-semibold text-slate-600">683 Kasus Tercatat</span></p>
              </div>
              <button className="text-[11px] text-slate-400 hover:text-emerald-600 font-medium transition-colors cursor-pointer">
                Lihat Detail
              </button>
            </div>
            <ProgressBarChart items={kategoriDifabel} />
            <p className="text-[10px] text-slate-400 mt-3 text-center">Data diperbarui setiap hari pada 00:00 WIB</p>
          </div>
        </div>

        <div className="space-y-4 min-w-0">
          <MapPanel relawanCount={54} />

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800">Relawan Siap Beroperasi</h3>
              <span className="text-xs text-slate-400">Terdekat dari lokasi</span>
            </div>
            <div className="p-3 space-y-2">
              {volunteers.map((rel, idx) => (
                <VolunteerCard key={rel.id} relawan={rel} index={idx} />
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-800">Persentase Kategori Laporan</h3>
              <span className="text-[11px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">683 Total</span>
            </div>
            <ProgressBarChart items={kategoriLaporan} />
          </div>
        </div>
      </div>
    </div>
  );
}
