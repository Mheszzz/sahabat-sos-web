import { Bell, ChevronRight, Menu, Home } from 'lucide-react';

const breadcrumbMap = {
  dashboard: ['Beranda', 'Dashboard Utama'],
  'kasus-aktif': ['Beranda', 'Kasus Aktif'],
  riwayat: ['Beranda', 'Riwayat Kasus'],
  peta: ['Beranda', 'Peta Pemantauan'],
  pengaturan: ['Beranda', 'Pengaturan Sistem'],
  'detail-kasus': ['Kasus Aktif', 'Detail Kasus'],
  'manajemen-admin': ['Manajemen', 'Manajemen Admin'],
  'manajemen-user': ['Manajemen', 'Manajemen User'],
};

import { useLocation } from 'react-router-dom';

export default function TopHeader({ onMenuToggle }) {
  const location = useLocation();
  const activePage = location.pathname === '/' ? 'dashboard' : location.pathname.substring(1);
  const crumbs = breadcrumbMap[activePage] || ['Beranda', 'Dashboard Utama'];

  return (
    <header className="sticky top-0 z-30 flex h-[56px] flex-shrink-0 items-center justify-between border-b border-slate-200 bg-white/95 px-5 backdrop-blur-sm lg:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 lg:hidden"
          aria-label="Toggle Navigation"
        >
          <Menu size={18} />
        </button>

        <nav className="flex items-center gap-2 text-[13px] font-medium">
          <Home size={14} className="text-slate-400" />
          <span className="text-slate-400">{crumbs[0]}</span>
          <ChevronRight size={12} className="text-slate-300" />
          <span className="font-semibold text-slate-700">{crumbs[1]}</span>
        </nav>
      </div>

      <button
        className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-800"
        aria-label="Notifikasi"
      >
        <Bell size={17} />
        <span className="absolute -right-0.5 -top-0.5 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[#ef4444] px-1 text-[10px] font-bold text-white">
          3
        </span>
      </button>
    </header>
  );
}
