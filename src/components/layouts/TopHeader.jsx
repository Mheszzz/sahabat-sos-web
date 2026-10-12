import { Link, useLocation } from 'react-router-dom';
import { Bell, ChevronRight, Menu, AlertTriangle } from 'lucide-react';

function getBreadcrumbs(pathname) {
  if (pathname.startsWith('/detail-kasus')) {
    return [
      { label: 'Kasus Aktif', to: '/kasus-aktif', icon: AlertTriangle },
      { label: 'Detail Kasus' },
    ];
  }
  if (pathname.startsWith('/kasus-aktif')) {
    return [
      { label: 'Kasus Aktif', icon: AlertTriangle },
    ];
  }
  if (pathname.startsWith('/riwayat')) {
    return [
      { label: 'Riwayat Kasus' },
    ];
  }
  if (pathname.startsWith('/peta')) {
    return [
      { label: 'Peta Pemantauan' },
    ];
  }
  if (pathname.startsWith('/pengaturan')) {
    return [
      { label: 'Profil' },
    ];
  }
  if (pathname.startsWith('/manajemen-admin')) {
    return [
      { label: 'Kelola Admin' },
    ];
  }
  if (pathname.startsWith('/detail-relawan')) {
    return [
      { label: 'Kelola Relawan', to: '/manajemen-user' },
      { label: 'Detail Relawan' },
    ];
  }
  if (pathname.startsWith('/manajemen-user')) {
    return [
      { label: 'Kelola Relawan' },
    ];
  }
  if (pathname.startsWith('/detail-laporan')) {
    return [
      { label: 'Master Data Laporan', to: '/master-data' },
      { label: 'Detail Laporan' },
    ];
  }
  if (pathname.startsWith('/master-data')) {
    return [
      { label: 'Master Data Laporan' },
    ];
  }
  return [
    { label: 'Dashboard Utama' },
  ];
}

export default function TopHeader({ onMenuToggle }) {
  const location = useLocation();
  const crumbs = getBreadcrumbs(location.pathname);

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

        <nav className="flex items-center gap-1.5 text-[13px] font-medium" aria-label="Breadcrumb">
          {crumbs.map((crumb, idx) => {
            const isLast = idx === crumbs.length - 1;
            const IconComponent = crumb.icon;

            return (
              <div key={idx} className="flex items-center gap-1.5">
                {crumb.to && !isLast ? (
                  <Link
                    to={crumb.to}
                    className="flex items-center gap-1.5 text-slate-400 hover:text-emerald-700 transition-colors"
                  >
                    {IconComponent && <IconComponent size={14} className="text-slate-400" />}
                    <span>{crumb.label}</span>
                  </Link>
                ) : (
                  <div className="flex items-center gap-1.5">
                    {IconComponent && <IconComponent size={14} className="text-slate-400" />}
                    <span className={isLast ? "font-semibold text-slate-700" : "text-slate-400"}>
                      {crumb.label}
                    </span>
                  </div>
                )}
                {!isLast && (
                  <ChevronRight size={12} className="text-slate-300 flex-shrink-0" />
                )}
              </div>
            );
          })}
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
