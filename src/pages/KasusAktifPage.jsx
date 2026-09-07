import { useState } from 'react';
import { RefreshCw, Download, Search, Phone, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { sosCases } from '../data/dummyData';

const statusStyles = {
  'Sedang Ditangani': { cls: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
  'Menunggu Respon':  { cls: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
  'Teratasi':         { cls: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
};

const priorityStyles = {
  'DARURAT SOS':      'bg-red-100 text-red-700 border border-red-200',
  'LAPORAN PENGGUNA': 'bg-blue-100 text-blue-700 border border-blue-200',
};

const avatarGradients = [
  'from-blue-400 to-blue-600',
  'from-emerald-400 to-teal-600',
  'from-violet-400 to-purple-600',
  'from-orange-400 to-amber-600',
  'from-pink-400 to-rose-600',
  'from-cyan-400 to-sky-600',
];

export default function KasusAktifPage({ onOpenDetail }) {
  const [activeFilter, setActiveFilter] = useState('semua');
  const [searchQuery, setSearchQuery] = useState('');

  const filters = [
    { id: 'semua',   label: 'Semua Kasus',       count: sosCases.length },
    { id: 'darurat', label: 'Darurat SOS',        count: sosCases.filter(c => c.type === 'darurat').length },
    { id: 'laporan', label: 'Laporan Pengguna',   count: sosCases.filter(c => c.type === 'laporan').length },
  ];

  const filteredCases = sosCases.filter(c => {
    const matchesFilter = activeFilter === 'semua' || c.type === activeFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q ||
      c.id.toLowerCase().includes(q) ||
      c.pelapor.nama.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.lokasi.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-6 space-y-5">
      {/* Page header & Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800">Daftar Kasus Tanggap Darurat Aktif</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            <span className="font-semibold text-slate-600">{filteredCases.length} kasus</span> ditemukan
          </p>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          {/* SINGLE Search Bar in the top control bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari ID kasus, pelapor..."
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all w-full md:w-56"
            />
          </div>
          <button className="flex items-center gap-1.5 text-slate-600 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold px-3 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap">
            <RefreshCw size={13} /> Refresh Real-time
          </button>
          <button className="flex items-center gap-1.5 bg-[#062c26] hover:bg-emerald-900 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap">
            <Download size={13} /> Ekspor Laporan
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1 w-fit">
        {filters.map(f => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-semibold transition-all cursor-pointer ${
              activeFilter === f.id ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {f.label}
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
              activeFilter === f.id
                ? f.id === 'darurat' ? 'bg-red-100 text-red-600'
                : f.id === 'laporan' ? 'bg-blue-100 text-blue-600'
                : 'bg-slate-100 text-slate-600'
                : 'bg-slate-200 text-slate-500'
            }`}>{f.count}</span>
          </button>
        ))}
      </div>

      {/* Table card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[960px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {['ID KASUS & WAKTU','PRIORITAS','PELAPOR & KEBUTUHAN','LOKASI KEJADIAN (TKP)','RELAWAN / PENDAMPING','STATUS RESPON','AKSI'].map(h => (
                  <th key={h} className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredCases.map((kasus, idx) => {
                const st = statusStyles[kasus.status] || { cls: 'bg-slate-100 text-slate-600', dot: 'bg-slate-400' };
                const pt = priorityStyles[kasus.priority] || 'bg-slate-100 text-slate-600';
                const avatarGrad = avatarGradients[idx % avatarGradients.length];
                return (
                  <tr key={kasus.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* ID & Waktu */}
                    <td className="p-4 align-middle">
                      <p className="text-sm font-bold text-slate-800">{kasus.id}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{kasus.waktu}</p>
                    </td>

                    {/* Prioritas */}
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-2">
                        {kasus.type === 'darurat' && (
                          <span className="relative flex h-2 w-2 flex-shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                          </span>
                        )}
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-lg whitespace-nowrap ${pt}`}>{kasus.priority}</span>
                      </div>
                    </td>

                    {/* Pelapor */}
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${avatarGrad} flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0`}>
                          {kasus.pelapor.nama.split(' ').map(w => w[0]).join('').slice(0,2)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{kasus.pelapor.nama}</p>
                          <p className="text-xs text-slate-400">{kasus.pelapor.disabilitas}</p>
                          <p className="text-xs text-slate-400">{kasus.pelapor.kontak}</p>
                        </div>
                      </div>
                    </td>

                    {/* Lokasi */}
                    <td className="p-4 align-middle max-w-[200px]">
                      <p className="text-xs font-medium text-slate-700 leading-snug line-clamp-2">{kasus.lokasiFull}</p>
                    </td>

                    {/* Relawan */}
                    <td className="p-4 align-middle">
                      {kasus.relawan.nama !== 'Belum Ditugaskan' ? (
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                            {kasus.relawan.avatar}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-700">{kasus.relawan.nama}</p>
                            <p className="text-[10px] text-emerald-600 font-medium">{kasus.relawan.badge}</p>
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-amber-500 italic font-medium">Menunggu Penugasan</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="p-4 align-middle">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${st.cls}`}>
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${st.dot}`}></span>
                        {kasus.status}
                      </span>
                    </td>

                    {/* Aksi */}
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <button className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer">
                          <Phone size={11} /> Hubungi
                        </button>
                        <button onClick={() => onOpenDetail?.(kasus.id)} className="flex items-center gap-1 border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-800 px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer">
                          <Eye size={11} /> Detail
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3.5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between flex-wrap gap-3">
          <p className="text-xs text-slate-500">
            Menampilkan <span className="font-semibold text-slate-700">1&ndash;{filteredCases.length}</span> dari{' '}
            <span className="font-semibold text-slate-700">{filteredCases.length}</span> kasus tanggap darurat aktif
          </p>
          <div className="flex items-center gap-1">
            <button disabled className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 disabled:opacity-40 cursor-not-allowed">
              <ChevronLeft size={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#062c26] text-white text-xs font-bold">1</button>
            <button disabled className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 disabled:opacity-40 cursor-not-allowed">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
