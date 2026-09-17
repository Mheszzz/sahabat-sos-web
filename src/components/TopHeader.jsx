import { useState } from 'react';
import { Bell, ChevronRight, Menu, Siren, Home, ChevronDown, LogOut } from 'lucide-react';

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

function getInitials(name = '') {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

export default function TopHeader({ activePage, onMenuToggle, currentUser, onLogout }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const crumbs = breadcrumbMap[activePage] || ['Beranda', 'Dashboard Utama'];

  return (
    <header className="sticky top-0 z-30 flex h-[72px] flex-shrink-0 items-center justify-between border-b border-slate-200 bg-white/90 px-5 shadow-[0_10px_24px_-24px_rgba(15,23,42,0.35)] backdrop-blur-sm lg:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 lg:hidden"
          aria-label="Toggle Navigation"
        >
          <Menu size={18} />
        </button>

        <nav className="flex items-center gap-2 text-[13px] font-medium">
          <Home size={15} className="text-slate-400" />
          <span className="text-slate-500">{crumbs[0]}</span>
          <ChevronRight size={13} className="text-slate-300" />
          <span className="font-bold text-slate-900">{crumbs[1]}</span>
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <button
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-800"
          aria-label="Notifikasi"
        >
          <Bell size={18} />
          <span className="absolute right-1.5 top-1.5 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[#f04438] px-1 text-[9px] font-bold text-white">
            3
          </span>
        </button>

        <button className="flex items-center gap-2 rounded-xl border border-[#dfe9e5] bg-[#f4faf8] px-3 py-2 text-[12px] font-bold text-[#0d5c52] transition-colors hover:bg-[#edf8f6]">
          <Siren size={14} />
          <span>Sirene Aktif</span>
        </button>

        <div className="hidden h-7 w-px bg-slate-200 sm:block" />

        {currentUser && (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(prev => !prev)}
              className="flex items-center gap-2.5 rounded-xl p-1.5 transition-colors hover:bg-slate-50"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0d1f1b] text-xs font-extrabold text-white shadow-sm">
                {getInitials(currentUser.nama)}
              </div>
              <div className="hidden text-left md:block">
                <p className="max-w-[140px] truncate text-[13px] font-extrabold text-slate-800">{currentUser.nama}</p>
                <p className="mt-0.5 text-[11px] font-medium text-slate-400">{currentUser.role}</p>
              </div>
              <ChevronDown size={14} className="hidden text-slate-400 md:block" />
            </button>

            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setDropdownOpen(false)} />
                <div className="absolute right-0 z-40 mt-2 w-52 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl animate-fade-in">
                  <div className="border-b border-slate-100 px-3 py-2">
                    <p className="text-xs font-bold text-slate-800">{currentUser.nama}</p>
                    <p className="text-[11px] text-slate-400">{currentUser.email || currentUser.role}</p>
                  </div>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onLogout();
                    }}
                    className="mt-1 flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
                  >
                    <LogOut size={14} />
                    <span>Keluar dari Akun</span>
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
