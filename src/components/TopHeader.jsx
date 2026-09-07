import { Bell, ChevronRight, Menu, Siren } from 'lucide-react';

const breadcrumbMap = {
  'dashboard': ['Halaman Utama', 'Dashboard Utama'],
  'kasus-aktif': ['Halaman Utama', 'Kasus Aktif'],
  'riwayat': ['Halaman Utama', 'Riwayat Kasus'],
  'peta': ['Halaman Utama', 'Peta Pemantauan'],
  'pengaturan': ['Halaman Utama', 'Pengaturan Sistem'],
};

export default function TopHeader({ activePage, onMenuToggle }) {
  const crumbs = breadcrumbMap[activePage] || ['Halaman Utama', 'Dashboard'];

  return (
    <header className="h-16 flex-shrink-0 bg-white border-b border-slate-200 flex items-center px-6 gap-4 sticky top-0 z-10 shadow-sm">
      {/* Mobile menu button */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
      >
        <Menu size={20} />
      </button>

      {/* Breadcrumbs */}
      <nav className="hidden sm:flex items-center gap-1.5 text-sm flex-shrink-0">
        <span className="text-slate-400 font-medium">{crumbs[0]}</span>
        <ChevronRight size={14} className="text-slate-300" />
        <span className="text-slate-700 font-semibold">{crumbs[1]}</span>
      </nav>

      {/* Spacer to push actions to the right */}
      <div className="flex-1" />

      {/* Right actions */}
      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-all cursor-pointer">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
        </button>

        {/* Sirine Toggle */}
        <button className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-all shadow-sm shadow-red-200 cursor-pointer">
          <Siren size={14} />
          <span className="hidden sm:inline">Sirine On</span>
        </button>
      </div>
    </header>
  );
}
