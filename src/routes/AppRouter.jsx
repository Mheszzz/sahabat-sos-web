import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '../components/layouts/MainLayout';
import LoginPage from '../pages/Login/LoginPage';
import DashboardPage from '../pages/Dashboard/DashboardPage';
import KasusAktifPage from '../pages/KasusAktif/KasusAktifPage';
import RiwayatKasusPage from '../pages/RiwayatKasus/RiwayatKasusPage';
import PetaPemantauanPage from '../pages/PetaPemantauan/PetaPemantauanPage';
import PengaturanPage from '../pages/Pengaturan/PengaturanPage';
import ManajemenAdminPage from '../pages/ManajemenAdmin/ManajemenAdminPage';
import ManajemenUserPage from '../pages/ManajemenUser/ManajemenUserPage';
import DetailKasusPage from '../pages/DetailKasus/DetailKasusPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />
      },
      {
        path: 'dashboard',
        element: <DashboardPage />
      },
      {
        path: 'kasus-aktif',
        element: <KasusAktifPage />
      },
      {
        path: 'riwayat',
        element: <RiwayatKasusPage />
      },
      {
        path: 'peta',
        element: <PetaPemantauanPage />
      },
      {
        path: 'pengaturan',
        element: <PengaturanPage />
      },
      {
        path: 'manajemen-admin',
        element: <ManajemenAdminPage />
      },
      {
        path: 'manajemen-user',
        element: <ManajemenUserPage />
      },
      {
        path: 'detail-kasus/:id',
        element: <DetailKasusPage />
      },
      {
        path: 'detail-relawan/:id',
        element: <div className="p-10"><h1 className="text-2xl font-bold">Halaman Detail Relawan (Belum Dibuat)</h1><p className="mt-2 text-slate-500">Routing berhasil! Silakan buat komponen halamannya nanti.</p></div>
      },
      {
        path: 'detail-laporan/:id',
        element: <div className="p-10"><h1 className="text-2xl font-bold">Halaman Detail Laporan (Belum Dibuat)</h1><p className="mt-2 text-slate-500">Routing berhasil! Silakan buat komponen halamannya nanti.</p></div>
      }
    ]
  }
]);

