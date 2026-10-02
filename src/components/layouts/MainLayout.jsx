import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopHeader from './TopHeader';
import { authService } from '../../api/services/authService';

export default function MainLayout() {
  const [currentUser, setCurrentUser] = useState(() => authService.getUser());
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ background: '#f2f5f4' }}>
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(prev => !prev)}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col min-w-0 md:p-5 transition-all">
        <main className="flex min-w-0 flex-1 flex-col overflow-hidden bg-slate-100 md:rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-200/60 relative">
          <TopHeader onMenuToggle={() => setSidebarOpen(prev => !prev)} />

          <div className="flex-1 overflow-y-auto overflow-x-hidden relative">
            <div className="mx-auto w-full min-w-0 max-w-[1600px] px-6 pb-10 pt-6 sm:px-8 lg:px-10">
              <Outlet context={{ currentUser }} />
            </div>

            <footer className="flex min-h-12 flex-shrink-0 flex-wrap items-center justify-between gap-2 border-t border-slate-200/80 bg-white/70 px-6 py-3 lg:px-8">
              <p className="text-[11.5px] font-medium text-slate-400">
                &copy; 2025 Sahabat SOS &mdash; Platform Inklusi &amp; Tanggap Darurat Difabel Mandiri. Hak Cipta Dilindungi.
              </p>
              <div className="hidden items-center gap-5 text-[11.5px] font-medium text-slate-400 sm:flex">
                <span className="cursor-pointer transition-colors hover:text-slate-700">Panduan SOP Relawan</span>
                <span className="cursor-pointer transition-colors hover:text-slate-700">Protokol Keamanan Darurat</span>
                <span className="cursor-pointer transition-colors hover:text-slate-700">Bantuan Teknis POSRO</span>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
