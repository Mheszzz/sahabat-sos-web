import {
  Home, AlertTriangle, Clock, MapPin, Settings,
  Siren, ChevronRight, Activity, Radio, Globe, Wifi, LogOut,
  UserCog, Users
} from 'lucide-react';

function getInitials(name = '') {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

const navItems = [
  { id: 'dashboard',   label: 'Dashboard Utama',   icon: Home },
  { id: 'kasus-aktif', label: 'Kasus Aktif',       icon: AlertTriangle, badge: 6 },
  { id: 'riwayat',     label: 'Riwayat Kasus',     icon: Clock },
  { id: 'peta',        label: 'Peta Pemantauan',   icon: MapPin },
  { id: 'pengaturan',  label: 'Pengaturan Sistem', icon: Settings },
];

const systemStatus = [
  { label: 'API Backend',  status: 'Online',    icon: Wifi,      color: 'bg-[#10b981]/20 text-[#34d399]' },
  { label: 'Socket.io',    status: 'Connected', icon: Activity,  color: 'bg-[#10b981]/20 text-[#34d399]' },
  { label: 'GIS Service',  status: 'Standby',   icon: Globe,     color: 'bg-[#f59e0b]/20 text-[#fbbf24]' },
];

export default function Sidebar({ activePage, onPageChange, isOpen, onToggle, currentUser, onLogout }) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onToggle}
        />
      )}

      {/* Desktop spacer — 260px */}
      <div className="hidden lg:block w-[260px] flex-shrink-0" aria-hidden="true" />

      {/* Sidebar Aside */}
      <aside
        style={{ backgroundColor: '#0a271f' }}
        className={`
          fixed inset-y-0 left-0 w-[260px] flex flex-col z-50
          transition-transform duration-300 ease-in-out border-r border-[#133d32]
          lg:translate-x-0
          ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Brand Header */}
        <div className="h-[68px] px-5 flex items-center gap-3.5 flex-shrink-0 border-b border-[#143d32]">
          <div className="w-9 h-9 rounded-xl bg-[#ef4444] flex items-center justify-center flex-shrink-0 shadow-md shadow-red-950/40">
            <Siren size={18} className="text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-white font-bold text-[15px] tracking-tight leading-none">Sahabat SOS</h1>
            <p className="text-[#34d399] text-[10px] font-bold uppercase tracking-wider mt-1 leading-none">Admin System</p>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 flex flex-col justify-between overflow-y-auto px-3.5 py-4 scrollbar-none">
          <div className="space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={`
                    w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-[13px] font-semibold
                    transition-all duration-150 cursor-pointer text-left
                    ${isActive
                      ? 'bg-[#154d3e] text-white shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-[#113a2f]'
                    }
                  `}
                >
                  <Icon
                    size={17}
                    className={`flex-shrink-0 ${isActive ? 'text-[#34d399]' : 'text-slate-400'}`}
                  />
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge && (
                    <span className="bg-[#ef4444] text-white text-[11px] font-bold rounded-full w-[20px] h-[20px] flex items-center justify-center flex-shrink-0">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Super Admin Management Section */}
          {currentUser?.role === 'Super Admin' && (
            <div className="mt-5 pt-3.5 border-t border-[#143d32]">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#34d399]/70 px-3.5 mb-2">
                Manajemen
              </p>
              <div className="space-y-1">
                <button
                  onClick={() => onPageChange('manajemen-admin')}
                  className={`
                    w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-[13px] font-semibold
                    transition-all duration-150 cursor-pointer text-left
                    ${activePage === 'manajemen-admin'
                      ? 'bg-[#154d3e] text-white shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-[#113a2f]'
                    }
                  `}
                >
                  <UserCog
                    size={17}
                    className={`flex-shrink-0 ${activePage === 'manajemen-admin' ? 'text-[#34d399]' : 'text-slate-400'}`}
                  />
                  <span className="flex-1 truncate">Manajemen Admin</span>
                </button>

                <button
                  onClick={() => onPageChange('manajemen-user')}
                  className={`
                    w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-[13px] font-semibold
                    transition-all duration-150 cursor-pointer text-left
                    ${activePage === 'manajemen-user'
                      ? 'bg-[#154d3e] text-white shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-[#113a2f]'
                    }
                  `}
                >
                  <Users
                    size={17}
                    className={`flex-shrink-0 ${activePage === 'manajemen-user' ? 'text-[#34d399]' : 'text-slate-400'}`}
                  />
                  <span className="flex-1 truncate">Manajemen User</span>
                </button>
              </div>
            </div>
          )}

          {/* Status Sistem Widget */}
          <div className="mt-6 mb-2">
            <div className="px-1 mb-2.5 flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Status Sistem</span>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                <span className="text-[11px] font-semibold text-[#34d399]">Sistem Aktif</span>
              </div>
            </div>

            <div className="bg-[#061e18] rounded-xl p-3 border border-[#143d32] space-y-2">
              {systemStatus.map(s => {
                const SIcon = s.icon;
                return (
                  <div key={s.label} className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2 text-slate-300">
                      <SIcon size={13} className="text-slate-400" />
                      <span>{s.label}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-md font-semibold text-[10px] ${s.color}`}>
                      {s.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* User Profile Card (Dynamic from currentUser) */}
        {currentUser && (
          <div className="p-3 border-t border-[#143d32] flex-shrink-0 bg-[#071f19]">
            <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#0d342a] transition-colors">
              <div className="w-9 h-9 rounded-full bg-[#059669] flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-sm">
                {getInitials(currentUser.nama)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-[13px] font-bold truncate leading-tight">{currentUser.nama}</p>
                <p className="text-slate-400 text-[11px] truncate leading-tight mt-0.5">{currentUser.role}</p>
              </div>
              <button
                onClick={onLogout}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/30 transition-colors cursor-pointer"
                title="Keluar"
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
