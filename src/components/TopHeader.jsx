import { useState } from 'react';
import { Bell, ChevronRight, Menu, Siren, Home, ChevronDown, LogOut, Shield } from 'lucide-react';

const breadcrumbMap = {
  'dashboard':        ['Beranda', 'Dashboard Utama'],
  'kasus-aktif':      ['Beranda', 'Kasus Aktif'],
  'riwayat':          ['Beranda', 'Riwayat Kasus'],
  'peta':             ['Beranda', 'Peta Pemantauan'],
  'pengaturan':       ['Beranda', 'Pengaturan Sistem'],
  'detail-kasus':     ['Kasus Aktif', 'Detail Kasus'],
  'manajemen-admin':  ['Manajemen', 'Manajemen Admin'],
  'manajemen-user':   ['Manajemen', 'Manajemen User'],
};

function getInitials(name = '') {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

export default function TopHeader({ activePage, onMenuToggle, currentUser, onLogout }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const crumbs = breadcrumbMap[activePage] || ['Beranda', 'Dashboard Utama'];

  return (
    <header className="h-[64px] bg-white border-b border-[#eaedf1] px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 flex-shrink-0">
      {/* Left side: Hamburger & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Toggle Navigation"
        >
          <Menu size={20} />
        </button>

        <nav className="flex items-center gap-2 text-[13px]">
          <Home size={15} className="text-slate-400" />
          <span className="text-slate-500 font-medium">{crumbs[0]}</span>
          <ChevronRight size={13} className="text-slate-300" />
          <span className="text-slate-900 font-bold">{crumbs[1]}</span>
        </nav>
      </div>

      {/* Right side: Notifications, Sirene Button & Dynamic Profile */}
      <div className="flex items-center gap-3.5">
        {/* Notification Bell */}
        <button
          className="relative w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
          aria-label="Notifikasi"
        >
          <Bell size={18} />
          <span className="absolute top-1 right-1 bg-[#ef4444] text-white text-[9px] font-bold rounded-full min-w-[15px] h-[15px] flex items-center justify-center px-0.5">
            3
          </span>
        </button>

        {/* Sirene Aktif Button */}
        <button className="flex items-center gap-2 bg-[#ef4444] hover:bg-[#dc2626] text-white text-[12px] font-bold px-3.5 py-2 rounded-full shadow-sm shadow-red-200 transition-all cursor-pointer">
          <Siren size={14} className="animate-bounce" />
          <span className="tracking-wide">Sirene Aktif</span>
        </button>

        <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />

        {/* Authenticated User Menu */}
        {currentUser && (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(prev => !prev)}
              className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-[#059669] text-white font-bold text-xs flex items-center justify-center shadow-xs">
                {getInitials(currentUser.nama)}
              </div>
              <div className="hidden md:block text-left leading-none">
                <p className="text-[13px] font-bold text-slate-800 truncate max-w-[130px]">{currentUser.nama}</p>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">{currentUser.role}</p>
              </div>
              <ChevronDown size={14} className="text-slate-400 hidden md:block" />
            </button>

            {/* Profile Dropdown */}
            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-[#eaedf1] p-1.5 z-40 animate-fade-in">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-800">{currentUser.nama}</p>
                    <p className="text-[11px] text-slate-400">{currentUser.email || currentUser.role}</p>
                  </div>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer mt-1"
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
