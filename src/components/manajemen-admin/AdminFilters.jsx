import { Search, Filter, ArrowUpDown } from 'lucide-react';

export default function AdminFilters({ searchQuery, setSearchQuery, statusFilter, setStatusFilter, sortBy, setSortBy }) {
  return (
    <div className="bg-white border border-[#eaedf1] rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari nama, ID, atau email admin..."
          className="w-full pl-10 pr-4 h-10 rounded-xl bg-slate-50 border border-slate-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
        />
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-slate-50 px-3 h-10 rounded-xl border border-slate-200">
          <Filter size={14} className="text-slate-400" />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent border-none text-[13px] font-medium text-slate-700 focus:outline-none focus:ring-0 py-0 pl-1 pr-6 cursor-pointer"
          >
            <option value="Semua">Semua Status</option>
            <option value="Aktif">Aktif</option>
            <option value="Sedang Bertugas">Sedang Bertugas</option>
            <option value="Offline">Offline</option>
            <option value="Nonaktif">Nonaktif</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2 bg-slate-50 px-3 h-10 rounded-xl border border-slate-200">
          <ArrowUpDown size={14} className="text-slate-400" />
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent border-none text-[13px] font-medium text-slate-700 focus:outline-none focus:ring-0 py-0 pl-1 pr-6 cursor-pointer"
          >
            <option value="terbaru">Terbaru</option>
            <option value="nama">Nama (A-Z)</option>
            <option value="kasus">Kasus Ditangani</option>
          </select>
        </div>
      </div>
    </div>
  );
}
