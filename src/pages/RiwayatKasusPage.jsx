import { useState } from 'react';
import { Search, Download, Calendar, Filter, ChevronLeft, ChevronRight, CheckCircle2, XCircle, Clock, Archive } from 'lucide-react';

const riwayatData = [
  { id:'SOS-5016', tanggal:'06 Sep 2026, 22:14', kategori:'Kecelakaan Lalu Lintas', prioritas:'DARURAT SOS', pelapor:'Budi Hartono', disabilitas:'Tunanetra', lokasi:'Jl. Gatot Subroto No.12, Jakarta Selatan', relawan:'Agus Setiawan', durasi:'12 Menit', status:'Selesai' },
  { id:'SOS-5015', tanggal:'06 Sep 2026, 19:42', kategori:'Disorientasi di Transportasi Publik', prioritas:'LAPORAN PENGGUNA', pelapor:'Siti Rahayu', disabilitas:'Rungu & Wicara', lokasi:'Stasiun Gambir, Jakarta Pusat', relawan:'Fitri Rahayu', durasi:'28 Menit', status:'Selesai' },
  { id:'SOS-5014', tanggal:'06 Sep 2026, 16:05', kategori:'Aksesibilitas Buruk — Lift Rusak', prioritas:'LAPORAN PENGGUNA', pelapor:'Joko Susanto', disabilitas:'Daksa (Kursi Roda)', lokasi:'MRT Lebak Bulus, Jakarta Selatan', relawan:'Tri Handoko', durasi:'9 Menit', status:'Selesai' },
  { id:'SOS-5013', tanggal:'06 Sep 2026, 14:30', kategori:'Serangan Panik di Ruang Publik', prioritas:'DARURAT SOS', pelapor:'Rina Wati', disabilitas:'Psikososial', lokasi:'Plaza Indonesia, Jakarta Pusat', relawan:'Nia Kurniasih', durasi:'35 Menit', status:'Selesai' },
  { id:'SOS-5012', tanggal:'06 Sep 2026, 11:18', kategori:'Laporan Tidak Valid', prioritas:'LAPORAN PENGGUNA', pelapor:'Tidak Diketahui', disabilitas:'-', lokasi:'Lokasi tidak terdeteksi', relawan:'-', durasi:'-', status:'Dibatalkan' },
  { id:'SOS-5011', tanggal:'06 Sep 2026, 09:55', kategori:'Butuh Panduan Navigasi Bandara', prioritas:'LAPORAN PENGGUNA', pelapor:'Arif Wicaksono', disabilitas:'Tunanetra', lokasi:'Bandara Soekarno-Hatta Terminal 3', relawan:'Dwi Riskianto', durasi:'22 Menit', status:'Selesai' },
  { id:'SOS-5010', tanggal:'05 Sep 2026, 20:33', kategori:'Kondisi Medis Mendadak', prioritas:'DARURAT SOS', pelapor:'Dian Purnama', disabilitas:'Epilepsi', lokasi:'Taman Monas, Jakarta Pusat', relawan:'Budi Santoso', durasi:'18 Menit', status:'Selesai' },
  { id:'SOS-5009', tanggal:'05 Sep 2026, 17:10', kategori:'Sinyal Palsu / Test Tombol', prioritas:'DARURAT SOS', pelapor:'Perangkat IoT-003', disabilitas:'-', lokasi:'Bekasi Barat (Uji Coba Perangkat)', relawan:'-', durasi:'-', status:'Dibatalkan' },
];

const filterTabs = [
  { id:'semua',     label:'Semua Selesai',       count: riwayatData.length },
  { id:'darurat',   label:'Darurat SOS Selesai', count: riwayatData.filter(r => r.prioritas === 'DARURAT SOS' && r.status === 'Selesai').length },
  { id:'laporan',   label:'Laporan Ditutup',     count: riwayatData.filter(r => r.prioritas === 'LAPORAN PENGGUNA' && r.status === 'Selesai').length },
  { id:'batal',     label:'Batal / Palsu',       count: riwayatData.filter(r => r.status === 'Dibatalkan').length },
];

const avatarGradients = [
  'from-blue-400 to-blue-600','from-emerald-400 to-teal-600','from-violet-400 to-purple-600',
  'from-orange-400 to-amber-600','from-pink-400 to-rose-600','from-cyan-400 to-sky-600',
  'from-red-400 to-rose-600','from-lime-400 to-green-600',
];

export default function RiwayatKasusPage() {
  const [activeTab, setActiveTab] = useState('semua');
  const [search, setSearch] = useState('');

  const filtered = riwayatData.filter(r => {
    const matchTab =
      activeTab === 'semua'   ? true :
      activeTab === 'darurat' ? r.prioritas === 'DARURAT SOS' && r.status === 'Selesai' :
      activeTab === 'laporan' ? r.prioritas === 'LAPORAN PENGGUNA' && r.status === 'Selesai' :
      activeTab === 'batal'   ? r.status === 'Dibatalkan' : true;
    const q = search.toLowerCase();
    const matchSearch = !q || r.id.toLowerCase().includes(q) || r.pelapor.toLowerCase().includes(q) || r.kategori.toLowerCase().includes(q) || r.lokasi.toLowerCase().includes(q);
    return matchTab && matchSearch;
  });

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
            <Archive className="text-slate-500" size={20} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-800">Riwayat & Arsip Kasus Darurat</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-sm text-slate-400">Total arsip:</p>
              <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{riwayatData.length} kasus</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button className="flex items-center gap-1.5 text-slate-600 border border-slate-200 hover:bg-slate-50 bg-white text-xs font-semibold px-3 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap">
            <Calendar size={13} /> Filter Tanggal
          </button>
          <button className="flex items-center gap-1.5 text-slate-600 border border-slate-200 hover:bg-slate-50 bg-white text-xs font-semibold px-3 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap">
            <Filter size={13} /> Filter Kategori
          </button>
          <button className="flex items-center gap-1.5 bg-[#062c26] hover:bg-emerald-900 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap">
            <Download size={13} /> Ekspor CSV/Excel
          </button>
        </div>
      </div>

      {/* Filter tabs + search */}
      <div className="bg-white rounded-xl border border-slate-200 px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1 flex-wrap">
          {filterTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                activeTab === tab.id ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                activeTab === tab.id ? 'bg-slate-100 text-slate-600' : 'bg-slate-200 text-slate-500'
              }`}>{tab.count}</span>
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Cari ID, pelapor, kategori, lokasi..."
            className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all w-60"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {['ID KASUS & TANGGAL','KATEGORI & PRIORITAS','PELAPOR (DIFABEL)','LOKASI','RELAWAN TERPILIH','DURASI PENANGANAN','STATUS AKHIR'].map(h => (
                  <th key={h} className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((r, idx) => (
                <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-4 align-middle">
                    <p className="text-sm font-bold text-slate-800">{r.id}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Clock size={10} className="text-slate-400" />
                      <p className="text-xs text-slate-400">{r.tanggal}</p>
                    </div>
                  </td>
                  <td className="p-4 align-middle">
                    <p className="text-xs font-semibold text-slate-700 mb-1 leading-snug">{r.kategori}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      r.prioritas === 'DARURAT SOS' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                    }`}>{r.prioritas}</span>
                  </td>
                  <td className="p-4 align-middle">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${avatarGradients[idx % avatarGradients.length]} flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0`}>
                        {r.pelapor !== 'Tidak Diketahui' && r.pelapor !== 'Perangkat IoT-003' ? r.pelapor.split(' ').map(w=>w[0]).join('').slice(0,2) : '?'}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{r.pelapor}</p>
                        <p className="text-xs text-slate-400">{r.disabilitas}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 align-middle max-w-[180px]">
                    <p className="text-xs text-slate-700 font-medium leading-snug line-clamp-2">{r.lokasi}</p>
                  </td>
                  <td className="p-4 align-middle">
                    {r.relawan !== '-' ? (
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                          {r.relawan.split(' ').map(w=>w[0]).join('').slice(0,2)}
                        </div>
                        <p className="text-xs font-semibold text-slate-700">{r.relawan}</p>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">-</span>
                    )}
                  </td>
                  <td className="p-4 align-middle">
                    {r.durasi !== '-' ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">
                        <Clock size={11} className="text-slate-400" /> {r.durasi}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">-</span>
                    )}
                  </td>
                  <td className="p-4 align-middle">
                    {r.status === 'Selesai' ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">
                        <CheckCircle2 size={12} /> Selesai
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-500">
                        <XCircle size={12} /> Dibatalkan
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3.5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between flex-wrap gap-3">
          <p className="text-xs text-slate-500">
            Menampilkan <span className="font-semibold text-slate-700">1&ndash;{filtered.length}</span> dari{' '}
            <span className="font-semibold text-slate-700">{filtered.length}</span> arsip kasus
          </p>
          <div className="flex items-center gap-1">
            <button disabled className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 disabled:opacity-40 cursor-not-allowed"><ChevronLeft size={14} /></button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#062c26] text-white text-xs font-bold">1</button>
            <button disabled className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 disabled:opacity-40 cursor-not-allowed"><ChevronRight size={14} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
