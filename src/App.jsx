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
import ManajemenRelawanPage from './pages/ManajemenRelawanPage';
import LoginPage from './pages/LoginPage';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const raw = authService.getUser();
    if (!raw) return null;
    // Normalize: raw API returns { name, email, role } — UI uses { nama, email, role }
    return {
      nama:  raw.nama  || raw.name  || 'Admin',
      email: raw.email || '',
      role:  raw.role === 'superadmin' ? 'Super Admin' : (raw.role || 'Admin'),
      id:    raw.id,
    };
  });
  const [activePage, setActivePage] = useState('dashboard');
  const [activeKasusId, setActiveKasusId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLoginSuccess = (user) => setCurrentUser(user);

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
      case 'dashboard':
        return <DashboardPage onOpenDetail={handleOpenDetail} />;
      case 'kasus-aktif':
        return <KasusAktifPage onOpenDetail={handleOpenDetail} />;
      case 'riwayat':
        return <RiwayatKasusPage />;
      case 'peta':
        return <PetaPemantauanPage onOpenDetail={handleOpenDetail} />;
      case 'pengaturan':
        return <PengaturanPage />;
      case 'detail-kasus':
        return (
          <DetailKasusPage
            kasusId={activeKasusId}
            onBack={() => setActivePage('kasus-aktif')}
          />
        );
      case 'manajemen-admin':
        return (
          <ManajemenAdminPage
            currentUser={currentUser}
            onOpenDetail={handleOpenDetail}
            onBackToDashboard={() => setActivePage('dashboard')}
          />
        );
      case 'manajemen-relawan':
        return (
          <ManajemenRelawanPage
            currentUser={currentUser}
            onBackToDashboard={() => setActivePage('dashboard')}
          />
        );
      default:
        return <DashboardPage onOpenDetail={handleOpenDetail} />;
    }
  };

  return (
    <div
      className="flex h-screen w-screen overflow-hidden"
      style={{ background: 'var(--color-bg)' }}
    >
      <Sidebar
        activePage={activePage}
        onPageChange={handlePageChange}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(p => !p)}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 md:p-4 lg:p-5">
        <main
          className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white md:rounded-2xl"
          style={{
            border: '1px solid var(--color-border)',
            boxShadow: '0 1px 4px rgba(15,23,42,0.04)',
          }}
        >
          <TopHeader
            activePage={activePage}
            onMenuToggle={() => setSidebarOpen(p => !p)}
            currentUser={currentUser}
            onLogout={handleLogout}
          />

          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            <div className="w-full min-w-0 max-w-[1680px] mx-auto">
              {renderPage()}
            </div>

            <footer
              className="flex flex-wrap items-center justify-between gap-2 px-6 py-3 lg:px-8"
              style={{
                minHeight: 48,
                borderTop: '1px solid var(--color-border)',
                background: 'var(--color-surface-2)',
              }}
            >
              <p style={{ fontSize: 11.5, color: 'var(--color-text-muted)', fontWeight: 500 }}>
                &copy; 2025 Sahabat SOS &mdash; Platform Inklusi &amp; Tanggap Darurat Difabel Mandiri
              </p>
              <div className="hidden sm:flex items-center gap-4">
                {['Panduan SOP Relawan', 'Protokol Keamanan', 'Bantuan Teknis'].map(link => (
                  <span
                    key={link}
                    className="cursor-pointer transition-colors hover:text-slate-600"
                    style={{ fontSize: 11.5, color: 'var(--color-text-muted)', fontWeight: 500 }}
                  >
                    {link}
                  </span>
                ))}
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
