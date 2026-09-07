import { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import DashboardPage from './pages/DashboardPage';
import KasusAktifPage from './pages/KasusAktifPage';
import RiwayatKasusPage from './pages/RiwayatKasusPage';
import PetaPemantauanPage from './pages/PetaPemantauanPage';
import PengaturanPage from './pages/PengaturanPage';
import DetailKasusPage from './pages/DetailKasusPage';

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [activeKasusId, setActiveKasusId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      case 'peta':          return <PetaPemantauanPage />;
      case 'pengaturan':    return <PengaturanPage />;
      case 'detail-kasus':  return <DetailKasusPage kasusId={activeKasusId} onBack={() => setActivePage('kasus-aktif')} />;
      default:              return <DashboardPage onOpenDetail={handleOpenDetail} />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100">
      <Sidebar
        activePage={activePage}
        onPageChange={handlePageChange}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(prev => !prev)}
      />
      
      <main className="flex-1 flex flex-col overflow-y-auto">
        <TopHeader
          activePage={activePage}
          onMenuToggle={() => setSidebarOpen(prev => !prev)}
        />
        
        {renderPage()}
        
        <footer className="h-10 bg-white border-t border-slate-200 flex items-center justify-between px-6 flex-shrink-0">
          <p className="text-[11px] text-slate-400">
            &copy; 2026 Sahabat SOS &mdash; Platform Inklusi & Tanggap Darurat Difabel. All rights reserved.
          </p>
          <div className="hidden sm:flex items-center gap-4 text-[11px] text-slate-400">
            <span className="cursor-pointer hover:text-slate-600 transition-colors">Panduan Admin Teknis</span>
            <span className="cursor-pointer hover:text-slate-600 transition-colors">Kontak Teknis Admin</span>
            <span className="cursor-pointer hover:text-slate-600 transition-colors">Sarana SOS</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
