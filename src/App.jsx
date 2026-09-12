import { useState } from 'react';
import { authService } from './services/authService';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import DashboardPage from './pages/DashboardPage';
import KasusAktifPage from './pages/KasusAktifPage';
import RiwayatKasusPage from './pages/RiwayatKasusPage';
import PetaPemantauanPage from './pages/PetaPemantauanPage';
import PengaturanPage from './pages/PengaturanPage';
import DetailKasusPage from './pages/DetailKasusPage';
import ManajemenAdminPage from './pages/ManajemenAdminPage';
import ManajemenUserPage from './pages/ManajemenUserPage';
import LoginPage from './pages/LoginPage';

export default function App() {
  // Ambil data user dari localStorage jika sudah pernah login
  const [currentUser, setCurrentUser] = useState(() => authService.getUser());
  const [activePage, setActivePage] = useState('dashboard');
  const [activeKasusId, setActiveKasusId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setActivePage('dashboard');
    setActiveKasusId(null);
  };

  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  const handlePageChange = (pageId) => {
    setActivePage(pageId);
    setActiveKasusId(null);
    setSidebarOpen(false);
  };

  const handleOpenDetail = (kasusId) => {
    setActiveKasusId(kasusId);
    setActivePage('detail-kasus');
  };

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':     return <DashboardPage onOpenDetail={handleOpenDetail} />;
      case 'kasus-aktif':   return <KasusAktifPage onOpenDetail={handleOpenDetail} />;
      case 'riwayat':       return <RiwayatKasusPage />;
      case 'peta':          return <PetaPemantauanPage onOpenDetail={handleOpenDetail} />;
      case 'pengaturan':        return <PengaturanPage />;
      case 'detail-kasus':      return <DetailKasusPage kasusId={activeKasusId} onBack={() => setActivePage('kasus-aktif')} />;
      case 'manajemen-admin':   return (
        <ManajemenAdminPage
          currentUser={currentUser}
          onOpenDetail={handleOpenDetail}
          onBackToDashboard={() => setActivePage('dashboard')}
        />
      );
      case 'manajemen-user':    return (
        <ManajemenUserPage
          currentUser={currentUser}
          onBackToDashboard={() => setActivePage('dashboard')}
        />
      );
      default:                  return <DashboardPage onOpenDetail={handleOpenDetail} />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F6F8FA]">
      <Sidebar
        activePage={activePage}
        onPageChange={handlePageChange}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(prev => !prev)}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      <main className="flex-1 flex flex-col overflow-y-auto min-w-0 bg-[#F6F8FA]">
        <TopHeader
          activePage={activePage}
          onMenuToggle={() => setSidebarOpen(prev => !prev)}
          currentUser={currentUser}
          onLogout={handleLogout}
        />

        {renderPage()}

        <footer className="h-12 bg-white border-t border-slate-200 flex items-center justify-between px-6 lg:px-8 flex-shrink-0">
          <p className="text-[12px] text-slate-500 font-medium">
            &copy; 2026 Sahabat SOS &mdash; Platform Inklusi &amp; Tanggap Darurat Difabel
          </p>
          <div className="hidden sm:flex items-center gap-6 text-[12px] text-slate-500 font-medium">
            <span className="cursor-pointer hover:text-slate-800 transition-colors">Panduan Sistem</span>
            <span className="cursor-pointer hover:text-slate-800 transition-colors">Dukungan Teknis</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
