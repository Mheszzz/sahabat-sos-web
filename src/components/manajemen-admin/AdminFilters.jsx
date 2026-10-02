import { Search, Filter, Shield, ArrowUpDown } from 'lucide-react';

export default function AdminFilters({
  searchQuery, setSearchQuery,
  statusFilter, setStatusFilter,
  roleFilter, setRoleFilter,
  sortBy, setSortBy,
}) {
  return (
    <div className="bg-white border border-[#eaedf1] rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari nama, email, atau ID admin..."
          className="w-full pl-10 pr-4 h-10 rounded-xl bg-slate-50 border border-slate-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Filter: Hak Akses / Status */}
        <div className="flex items-center gap-2 bg-slate-50 px-3 h-10 rounded-xl border border-slate-200">
          <Filter size={13} className="text-slate-400 flex-shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent border-none text-[13px] font-medium text-slate-700 focus:outline-none focus:ring-0 py-0 pl-0.5 pr-5 cursor-pointer"
          >
            <option value="Semua">Semua Status</option>
            <option value="Punya Akses">Punya Hak Akses</option>
            <option value="Tanpa Akses">Belum Ada Akses</option>
          </select>
        </div>

        {/* Filter: Role */}
        <div className="flex items-center gap-2 bg-slate-50 px-3 h-10 rounded-xl border border-slate-200">
          <Shield size={13} className="text-slate-400 flex-shrink-0" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-transparent border-none text-[13px] font-medium text-slate-700 focus:outline-none focus:ring-0 py-0 pl-0.5 pr-5 cursor-pointer"
          >
            <option value="Semua">Semua Role</option>
            <option value="admin">Admin</option>
            <option value="superadmin">Super Admin</option>
          </select>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 bg-slate-50 px-3 h-10 rounded-xl border border-slate-200">
          <ArrowUpDown size={13} className="text-slate-400 flex-shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent border-none text-[13px] font-medium text-slate-700 focus:outline-none focus:ring-0 py-0 pl-0.5 pr-5 cursor-pointer"
          >
            <option value="terbaru">Terbaru</option>
            <option value="nama">Nama (A–Z)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
