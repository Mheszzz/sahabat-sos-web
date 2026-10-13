import { createBrowserRouter, Navigate, useParams } from 'react-router-dom';
import MainLayout from '../components/layouts/MainLayout';
import LoginPage from '../pages/Login/LoginPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import KasusAktifPage from '../pages/KasusAktif/KasusAktifPage';
import RiwayatKasusPage from '../pages/RiwayatKasus/RiwayatKasusPage';
import PetaPemantauanPage from '../pages/PetaPemantauan/PetaPemantauanPage';
import PengaturanPage from '../pages/Pengaturan/PengaturanPage';
import ManajemenAdminPage from '../pages/ManajemenAdmin/ManajemenAdminPage';
import ManajemenUserPage from '../pages/ManajemenUser/ManajemenUserPage';
import DetailKasusPage from '../pages/DetailKasus/DetailKasusPage';
import MasterDataPage from '../pages/MasterData/MasterDataPage';

function DetailRelawanRedirect() {
  const { id } = useParams();
  return <Navigate to={`/manajemen-user?id=${id}`} replace />;
}

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
        path: 'master-data',
        element: <MasterDataPage />
      },
      {
        path: 'detail-kasus/:id',
        element: <DetailKasusPage />
      },
      {
        path: 'detail-relawan/:id',
        element: <DetailRelawanRedirect />
      },
      {
        path: 'detail-laporan/:id',
        element: <div className="p-10"><h1 className="text-2xl font-bold">Halaman Detail Laporan (Belum Dibuat)</h1><p className="mt-2 text-slate-500">Routing berhasil! Silakan buat komponen halamannya nanti.</p></div>
      }
    ]
  }
]);

