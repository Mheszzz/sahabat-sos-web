import { useState } from 'react';
import { Bell, ChevronRight, Menu, Home, ChevronDown, LogOut, Search } from 'lucide-react';

const breadcrumbMap = {
  dashboard:          ['Beranda',    'Dashboard Utama'],
  'kasus-aktif':      ['Operasional', 'Kasus Aktif'],
  riwayat:            ['Operasional', 'Riwayat Kasus'],
  peta:               ['Operasional', 'Peta Pemantauan'],
  pengaturan:         ['Sistem',     'Pengaturan'],
  'detail-kasus':     ['Kasus Aktif', 'Detail Kasus'],
  'manajemen-admin':  ['Manajemen',  'Kelola Admin'],
  'manajemen-relawan':['Manajemen',  'Kelola Relawan'],
};

function getInitials(name = '') {
  return name.split(' ').filter(Boolean).map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

export default function TopHeader({ activePage, onMenuToggle, currentUser, onLogout }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const crumbs = breadcrumbMap[activePage] || ['Beranda', 'Dashboard Utama'];

  return (
    <header
      className="sticky top-0 z-30 flex flex-shrink-0 items-center justify-between px-5 lg:px-7"
      style={{
        height: 64,
        background: 'rgba(255,255,255,0.96)',
        borderBottom: '1px solid #E2E8F0',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      {/* Left — hamburger + breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuToggle}
          className="btn-icon md:hidden flex-shrink-0"
          aria-label="Toggle Navigation"
        >
          <Menu size={17} />
        </button>

        <nav className="flex items-center gap-1.5 text-[12.5px] font-medium min-w-0">
          <Home size={13} className="text-slate-400 flex-shrink-0" />
          <span className="text-slate-400 hidden sm:inline">{crumbs[0]}</span>
          <ChevronRight size={12} className="text-slate-300 flex-shrink-0 hidden sm:block" />
          <span className="font-semibold text-slate-700 truncate">{crumbs[1]}</span>
        </nav>
      </div>

      {/* Right — notifications + user */}
      <div className="flex items-center gap-2 flex-shrink-0">

        {/* Notifications */}
        <button
          className="btn-icon relative"
          aria-label="Notifikasi"
          title="Notifikasi"
        >
          <Bell size={16} />
          <span
            className="absolute flex items-center justify-center font-bold text-white"
            style={{
              top: 6, right: 6,
              width: 14, height: 14,
              fontSize: 8,
              background: '#DC2626',
              borderRadius: '50%',
              border: '1.5px solid white',
            }}
          >
            3
          </span>
        </button>

        <div style={{ width: 1, height: 24, background: '#E2E8F0' }} className="hidden sm:block" />

        {/* User menu */}
        {currentUser && (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(p => !p)}
              className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition-colors hover:bg-slate-50"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                style={{ background: 'var(--color-primary-dark)' }}
              >
                {getInitials(currentUser.nama)}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-[12.5px] font-semibold text-slate-800 max-w-[130px] truncate leading-none">
                  {currentUser.nama}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-none">{currentUser.role}</p>
              </div>
              <ChevronDown size={13} className="text-slate-400 hidden md:block" />
            </button>

            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setDropdownOpen(false)} />
                <div
                  className="absolute right-0 z-40 mt-1.5 w-48 rounded-2xl bg-white p-1.5 animate-fade-in"
                  style={{
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 10px 40px rgba(15,23,42,0.12)',
                    top: '100%',
                  }}
                >
                  <div className="px-3 py-2.5 border-b border-slate-100">
                    <p className="text-[12.5px] font-semibold text-slate-800 truncate">{currentUser.nama}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{currentUser.email || currentUser.role}</p>
                  </div>
                  <button
                    onClick={() => { setDropdownOpen(false); onLogout(); }}
                    className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-[12.5px] font-semibold text-red-600 transition-colors hover:bg-red-50 cursor-pointer"
                  >
                    <LogOut size={13} />
                    Keluar dari Akun
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
