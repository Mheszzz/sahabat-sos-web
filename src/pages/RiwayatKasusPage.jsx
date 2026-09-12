import { useState } from 'react';
import { Search, Download, Calendar, Filter, ChevronLeft, ChevronRight, Eye, CheckCircle2, XCircle } from 'lucide-react';

const riwayatData = [
  { id:'SOS-5016', tanggal:'06 Sep 2026, 22:14', kategori:'Kecelakaan Lalu Lintas', pelapor:'Budi Hartono', disabilitas:'Tunanetra', lokasi:'Jl. Gatot Subroto No.12, Jakarta Selatan', relawan:'Agus Setiawan', durasi:'12 Menit', status:'Selesai' },
  { id:'SOS-5015', tanggal:'06 Sep 2026, 19:42', kategori:'Disorientasi di Transportasi Publik', pelapor:'Siti Rahayu', disabilitas:'Rungu & Wicara', lokasi:'Stasiun Gambir, Jakarta Pusat', relawan:'Fitri Rahayu', durasi:'28 Menit', status:'Selesai' },
  { id:'SOS-5014', tanggal:'06 Sep 2026, 16:05', kategori:'Aksesibilitas Buruk — Lift Rusak', pelapor:'Joko Susanto', disabilitas:'Daksa (Kursi Roda)', lokasi:'MRT Lebak Bulus, Jakarta Selatan', relawan:'Tri Handoko', durasi:'9 Menit', status:'Selesai' },
  { id:'SOS-5013', tanggal:'06 Sep 2026, 14:30', kategori:'Serangan Panik di Ruang Publik', pelapor:'Rina Wati', disabilitas:'Psikososial', lokasi:'Plaza Indonesia, Jakarta Pusat', relawan:'Nia Kurniasih', durasi:'35 Menit', status:'Selesai' },
  { id:'SOS-5012', tanggal:'06 Sep 2026, 11:18', kategori:'Laporan Tidak Valid', pelapor:'Tidak Diketahui', disabilitas:'-', lokasi:'Lokasi tidak terdeteksi', relawan:'-', durasi:'-', status:'Dibatalkan' },
  { id:'SOS-5011', tanggal:'06 Sep 2026, 09:55', kategori:'Butuh Panduan Navigasi Bandara', pelapor:'Arif Wicaksono', disabilitas:'Tunanetra', lokasi:'Bandara Soekarno-Hatta Terminal 3', relawan:'Dwi Riskianto', durasi:'22 Menit', status:'Selesai' },
  { id:'SOS-5010', tanggal:'05 Sep 2026, 20:33', kategori:'Kondisi Medis Mendadak', pelapor:'Dian Purnama', disabilitas:'Epilepsi', lokasi:'Taman Monas, Jakarta Pusat', relawan:'Budi Santoso', durasi:'18 Menit', status:'Selesai' },
  { id:'SOS-5009', tanggal:'05 Sep 2026, 17:10', kategori:'Sinyal Palsu / Test Tombol', pelapor:'Perangkat IoT-003', disabilitas:'-', lokasi:'Bekasi Barat (Uji Coba Perangkat)', relawan:'-', durasi:'-', status:'Dibatalkan' },
];

export default function RiwayatKasusPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = riwayatData.filter(r => {
    const matchStatus = statusFilter === 'Semua' || r.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch = !q ||
      r.id.toLowerCase().includes(q) ||
      r.kategori.toLowerCase().includes(q) ||
      r.pelapor.toLowerCase().includes(q) ||
      r.lokasi.toLowerCase().includes(q) ||
      r.relawan.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1680px] w-full mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-black text-slate-900 tracking-tight leading-tight">
            Riwayat Kasus
          </h1>
          <p className="text-[14px] text-slate-500 mt-1 font-medium">
            Lihat dan telusuri seluruh riwayat laporan dan penanganan insiden lampau.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => alert('Mengekspor data riwayat ke CSV...')}
            className="btn-base btn-secondary text-[12px] h-9"
          >
            <Download size={13} />
            <span>Ekspor Laporan</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-[#eaedf1] rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari ID, pelapor, relawan, lokasi..."
            className="w-full h-9 pl-9 pr-4 bg-[#f8fafc] border border-slate-200 rounded-xl text-[13px] font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-emerald-600 transition-all"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 bg-[#f8fafc] border border-slate-200 rounded-xl px-3 h-9 text-[12px] font-semibold text-slate-600">
            <Calendar size={13} className="text-slate-400" />
            <select className="bg-transparent border-none outline-none cursor-pointer">
              <option value="30">30 Hari Terakhir</option>
              <option value="7">7 Hari Terakhir</option>
              <option value="90">3 Bulan Terakhir</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-[#f8fafc] border border-slate-200 rounded-xl px-3 h-9 text-[12px] font-semibold text-slate-600">
            <Filter size={13} className="text-slate-400" />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-transparent border-none outline-none cursor-pointer"
            >
              <option value="Semua">Semua Status</option>
              <option value="Selesai">Selesai</option>
              <option value="Dibatalkan">Dibatalkan</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-[#eaedf1] rounded-2xl overflow-hidden shadow-xs">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID Kasus</th>
                <th>Tanggal & Waktu</th>
                <th>Kategori</th>
                <th>Pelapor</th>
                <th>Lokasi</th>
                <th>Relawan</th>
                <th>Status</th>
                <th>Durasi Respon</th>
                <th className="text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(row => (
                <tr key={row.id}>
                  {/* ID */}
                  <td>
                    <span className="font-bold text-slate-900 text-[12px]">
                      {row.id}
                    </span>
                  </td>

                  {/* Tanggal */}
                  <td>
                    <span className="text-slate-500 text-[12px]">{row.tanggal}</span>
                  </td>

                  {/* Kategori */}
                  <td>
                    <span className="font-semibold text-slate-800 text-[13px]">{row.kategori}</span>
                  </td>

                  {/* Pelapor */}
                  <td>
                    <div>
                      <p className="font-semibold text-slate-800 text-[12px] leading-tight">{row.pelapor}</p>
                      <p className="text-[11px] text-slate-400 leading-tight mt-0.5">{row.disabilitas}</p>
                    </div>
                  </td>

                  {/* Lokasi */}
                  <td>
                    <span className="text-slate-600 text-[12px] max-w-[200px] truncate block" title={row.lokasi}>
                      {row.lokasi}
                    </span>
                  </td>

                  {/* Relawan */}
                  <td>
                    <span className="text-slate-700 font-medium text-[12px]">{row.relawan}</span>
                  </td>

                  {/* Status */}
                  <td>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      row.status === 'Selesai'
                        ? 'bg-[#f0fdf4] text-[#16a34a]'
                        : 'bg-[#fef2f2] text-[#dc2626]'
                    }`}>
                      {row.status === 'Selesai' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                      <span>{row.status}</span>
                    </span>
                  </td>

                  {/* Durasi */}
                  <td>
                    <span className="font-semibold text-slate-700 text-[12px]">{row.durasi}</span>
                  </td>

                  {/* Action */}
                  <td className="text-right">
                    <button
                      onClick={() => alert(`Membuka arsip ${row.id}`)}
                      className="btn-base btn-secondary py-1 px-2.5 text-[11px] h-7 rounded-lg"
                    >
                      <Eye size={12} />
                      <span>Arsip</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t border-[#f1f5f9] flex items-center justify-between text-[12px] text-slate-500">
          <span>Menampilkan 1-8 dari {filtered.length} riwayat</span>
          <div className="flex items-center gap-1.5">
            <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-40" disabled>
              <ChevronLeft size={14} />
            </button>
            <button className="w-8 h-8 rounded-lg bg-[#0a271f] text-white font-bold flex items-center justify-center">
              1
            </button>
            <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
