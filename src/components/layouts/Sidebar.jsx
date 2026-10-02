import { Link, useLocation } from 'react-router-dom';
import {
  Home, AlertTriangle, Clock, MapPin, Settings,
  Siren, LogOut, UserCog, Users, ChevronRight
} from 'lucide-react';
import InitialsAvatar from '../global/InitialsAvatar';

const navItems = [
  { id: 'dashboard', label: 'Dashboard Utama', icon: Home },
  { id: 'kasus-aktif', label: 'Kasus Aktif', icon: AlertTriangle, badge: 6 },
  { id: 'riwayat', label: 'Riwayat Kasus', icon: Clock },
  { id: 'peta', label: 'Peta Pemantauan', icon: MapPin },
  { id: 'pengaturan', label: 'Pengaturan Sistem', icon: Settings },
];

const manajemenItems = [
  { id: 'manajemen-admin', label: 'Kelola Admin', icon: UserCog },
  { id: 'manajemen-user', label: 'Kelola Relawan', icon: Users },
];

function NavButton({ id, label, icon: Icon, badge, isActive }) {
  return (
    <Link
      to={id === 'dashboard' ? '/' : '/' + id}
      className={`
        w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold
        transition-all duration-150 cursor-pointer text-left group
        ${isActive
          ? 'bg-white/[0.10] text-white'
          : 'text-white/50 hover:text-white/80 hover:bg-white/[0.06]'
        }
      `}
    >
      <span className={`w-[30px] h-[30px] flex items-center justify-center rounded-lg flex-shrink-0 transition-colors ${isActive
          ? 'bg-[#0b6f61] text-[#34d399]'
          : 'bg-white/[0.05] text-white/40 group-hover:bg-white/[0.08] group-hover:text-white/60'
        }`}>
        <Icon size={15} />
      </span>
      <span className="flex-1 truncate">{label}</span>
      {badge && (
        <span className="bg-[#ef4444] text-white text-[10px] font-bold rounded-full min-w-[19px] h-[19px] flex items-center justify-center flex-shrink-0 px-1">
          {badge}
        </span>
      )}
      {isActive && !badge && (
        <ChevronRight size={13} className="flex-shrink-0 text-white/30" />
      )}
    </Link>
  );
}

export default function Sidebar({ isOpen, onToggle, currentUser, onLogout }) {
  const location = useLocation();
  // derive activePage from pathname roughly
  const activePage = location.pathname === '/' ? 'dashboard' : location.pathname.substring(1);
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={onToggle}
        />
      )}

      {/* Spacer */}
      <div className="hidden md:block w-[266px] flex-shrink-0" aria-hidden="true" />

      {/* Sidebar */}
      <aside
        style={{ backgroundColor: '#0a271f' }}
        className={`
          fixed inset-y-0 left-0 w-[256px] flex flex-col z-50
          transition-transform duration-300 ease-in-out
          md:translate-x-0
          ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Brand Header */}
        <div className="h-[64px] px-5 flex items-center gap-3 flex-shrink-0 border-b border-white/[0.07]">
          <img src="/logo.png" alt="Sahabat SOS Logo" className="h-8 w-auto object-contain rounded-md bg-white p-0.5" />
          <div className="min-w-0">
            <h1 className="text-white font-extrabold text-[15px] tracking-tight leading-none">Sahabat SOS</h1>
            <p className="text-[#34d399] text-[10px] font-bold uppercase tracking-[0.12em] mt-[3px] leading-none opacity-80">
              Admin Command
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 flex flex-col overflow-y-auto px-3 pt-4 pb-2" style={{ scrollbarWidth: 'none' }}>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/30 px-2.5 mb-2">
            Menu Utama
          </p>
          <div className="space-y-0.5">
            {navItems.map(item => (
              <NavButton key={item.id} {...item} isActive={activePage === item.id}  />
            ))}
          </div>

          {/* Manajemen Section */}
          <div className="mt-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/30 px-2.5 mb-2">
              Manajemen
            </p>
            <div className="space-y-0.5">
              {manajemenItems.map(item => (
                <NavButton key={item.id} {...item} isActive={activePage === item.id}  />
              ))}
            </div>
          </div>

          <div className="flex-1" />
        </div>

        {/* User Profile */}
        {currentUser && (
          <div className="px-3 pb-3 pt-2 border-t border-white/[0.07] flex-shrink-0">
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-white/[0.06] transition-colors">
              <InitialsAvatar name={currentUser.nama} size={34} bgClass="bg-[#0b6f61]" />
              <div className="flex-1 min-w-0">
                <p className="text-white text-[13px] font-bold truncate leading-tight">{currentUser.nama}</p>
                <p className="text-white/40 text-[11px] truncate leading-tight mt-0.5">{currentUser.role}</p>
              </div>
              <button
                onClick={onLogout}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.07] text-white/50 hover:text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer flex-shrink-0"
                title="Keluar dari Akun"
                aria-label="Logout"
              >
                <LogOut size={14} />
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}





