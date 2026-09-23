import {
  Home, AlertTriangle, Clock, MapPin, Settings,
  Siren, Activity, Globe, Wifi, LogOut,
  UserCog, HeartHandshake, ChevronRight, X
} from 'lucide-react';
import InitialsAvatar from './InitialsAvatar';

const mainNavItems = [
  { id: 'dashboard',  label: 'Dashboard Utama',    icon: Home },
  { id: 'kasus-aktif', label: 'Kasus Aktif',       icon: AlertTriangle, badge: true },
  { id: 'riwayat',    label: 'Riwayat Kasus',      icon: Clock },
  { id: 'peta',       label: 'Peta Pemantauan',    icon: MapPin },
  { id: 'pengaturan', label: 'Pengaturan Sistem',  icon: Settings },
];

const manajemenItems = [
  { id: 'manajemen-admin',   label: 'Kelola Admin',   icon: UserCog },
  { id: 'manajemen-relawan', label: 'Kelola Relawan', icon: HeartHandshake },
];

const systemStatus = [
  { label: 'API Backend', status: 'Online',    color: '#34D399' },
  { label: 'Socket.io',   status: 'Connected', color: '#34D399' },
  { label: 'GIS Service', status: 'Standby',   color: '#FBBF24' },
];

function NavItem({ item, isActive, onClick }) {
  const Icon = item.icon;
  return (
    <button
      className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
      onClick={() => onClick(item.id)}
    >
      <span className="sidebar-nav-icon">
        <Icon size={14} />
      </span>
      <span className="flex-1 truncate text-left">{item.label}</span>
      {item.badge && isActive && (
        <ChevronRight size={12} style={{ color: 'rgba(255,255,255,0.3)', flexShrink: 0 }} />
      )}
      {isActive && !item.badge && (
        <ChevronRight size={12} style={{ color: 'rgba(255,255,255,0.3)', flexShrink: 0 }} />
      )}
    </button>
  );
}

export default function Sidebar({ activePage, onPageChange, isOpen, onToggle, currentUser, onLogout }) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          style={{ backdropFilter: 'blur(2px)' }}
          onClick={onToggle}
        />
      )}

      {/* Spacer for desktop layout */}
      <div className="hidden md:block flex-shrink-0" style={{ width: 256 }} aria-hidden="true" />

      {/* Sidebar */}
      <aside
        style={{ backgroundColor: 'var(--nav-bg)', width: 256 }}
        className={`
          fixed inset-y-0 left-0 flex flex-col z-50
          transition-transform duration-280 ease-in-out
          md:translate-x-0
          ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* ── Brand ── */}
        <div
          className="flex items-center justify-between px-4 flex-shrink-0"
          style={{ height: 64, borderBottom: '1px solid var(--nav-border)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: '#DC2626', boxShadow: '0 4px 12px rgba(220,38,38,0.4)' }}
            >
              <Siren size={15} color="white" />
            </div>
            <div>
              <h1 style={{ color: 'white', fontSize: 14, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1 }}>
                Sahabat SOS
              </h1>
              <p style={{ color: 'var(--nav-accent)', fontSize: 9.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 3, opacity: 0.85 }}>
                Admin Command
              </p>
            </div>
          </div>
          {/* Mobile close */}
          <button
            className="md:hidden w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)' }}
            onClick={onToggle}
          >
            <X size={14} />
          </button>
        </div>

        {/* ── Navigation ── */}
        <div
          className="flex-1 flex flex-col overflow-y-auto px-3 pt-4 pb-2"
          style={{ scrollbarWidth: 'none' }}
        >
          {/* Main Nav */}
          <p style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', padding: '0 8px', marginBottom: 6 }}>
            Menu Utama
          </p>
          <div className="space-y-0.5">
            {mainNavItems.map(item => (
              <NavItem
                key={item.id}
                item={item}
                isActive={activePage === item.id}
                onClick={onPageChange}
              />
            ))}
          </div>

          {/* Manajemen Nav */}
          <div className="mt-5">
            <p style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', padding: '0 8px', marginBottom: 6 }}>
              Manajemen
            </p>
            <div className="space-y-0.5">
              {manajemenItems.map(item => (
                <NavItem
                  key={item.id}
                  item={item}
                  isActive={activePage === item.id}
                  onClick={onPageChange}
                />
              ))}
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-1 min-h-3" />

          {/* System Status */}
          <div className="mb-2">
            <div className="flex items-center justify-between px-2 mb-2">
              <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)' }}>
                Status Sistem
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" style={{ animation: 'pulseSoft 2s ease-in-out infinite' }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: '#34D399' }}>Aktif</span>
              </span>
            </div>
            <div
              className="rounded-xl p-2.5 space-y-2"
              style={{ background: 'rgba(0,0,0,0.18)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              {systemStatus.map(s => (
                <div key={s.label} className="flex items-center justify-between">
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{s.label}</span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
                    <span style={{ fontSize: 10, fontWeight: 700, color: s.color }}>{s.status}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── User Profile ── */}
        {currentUser && (
          <div
            className="px-3 pb-3 pt-2 flex-shrink-0"
            style={{ borderTop: '1px solid var(--nav-border)' }}
          >
            <div className="flex items-center gap-2.5 p-2 rounded-xl"
              style={{ ':hover': { background: 'var(--nav-bg-hover)' } }}>
              <InitialsAvatar name={currentUser.nama} size={34} bgClass="bg-teal-700" />
              <div className="flex-1 min-w-0">
                <p style={{ color: 'white', fontSize: 12.5, fontWeight: 700, lineHeight: 1.2 }} className="truncate">
                  {currentUser.nama}
                </p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10.5, lineHeight: 1.2, marginTop: 2 }} className="truncate">
                  {currentUser.role}
                </p>
              </div>
              <button
                onClick={onLogout}
                className="w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0 transition-colors"
                style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}
                title="Keluar dari Akun"
                aria-label="Logout"
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(220,38,38,0.25)';
                  e.currentTarget.style.color = '#FCA5A5';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.color = 'rgba(255,255,255,0.4)';
                }}
              >
                <LogOut size={13} />
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
