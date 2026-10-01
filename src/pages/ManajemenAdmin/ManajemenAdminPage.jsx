import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { useOutletContext, Navigate } from 'react-router-dom';
import PageHeader from '../../components/global/PageHeader';
import { useAdminData } from '../../hooks/manajemen-admin/useAdminData';
import AdminStats from '../../components/manajemen-admin/AdminStats';
import AdminFilters from '../../components/manajemen-admin/AdminFilters';
import AdminTable from '../../components/manajemen-admin/AdminTable';
import AdminAddModal from '../../components/manajemen-admin/AdminAddModal';
import AdminPermissionsModal from '../../components/manajemen-admin/AdminPermissionsModal';

export default function ManajemenAdminPage() {
  const { currentUser } = useOutletContext() || {};
  const { admins, isLoading, searchQuery, setSearchQuery, statusFilter, setStatusFilter, sortBy, setSortBy, totalAdmin, adminAktif, sedangBertugas, offlineCount, fetchAdmins } = useAdminData();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [managingPerms, setManagingPerms] = useState(null);

  // Akses Kontrol
  if (!(currentUser?.role === 'Super Admin' || currentUser?.role === 'superadmin')) {
    return (
      <div className="p-12 text-center">
        <h1 className="text-2xl font-black text-slate-900">403 - Akses Ditolak</h1>
        <p className="text-slate-500 mt-2">Halaman khusus Super Admin.</p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1680px] w-full mx-auto relative">
      <PageHeader 
        title="Manajemen Admin" 
        description="Kelola akun administrator dan pantau aktivitas operasional." 
        actions={
          <button onClick={() => setIsAddOpen(true)} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 h-10 rounded-xl text-[13px] font-semibold transition-colors">
            <UserPlus size={15} />
            <span>Tambah Admin</span>
          </button>
        } 
      />

      <AdminStats totalAdmin={totalAdmin} adminAktif={adminAktif} sedangBertugas={sedangBertugas} offlineCount={offlineCount} />
      
      <AdminFilters searchQuery={searchQuery} setSearchQuery={setSearchQuery} statusFilter={statusFilter} setStatusFilter={setStatusFilter} sortBy={sortBy} setSortBy={setSortBy} />
      
      <AdminTable 
        admins={admins} 
        isLoading={isLoading} 
        onDetail={(admin) => console.log('Detail', admin)} 
        onPermissions={(admin) => setManagingPerms(admin)}
        onRevoke={(admin) => console.log('Revoke', admin)}
      />

      <AdminAddModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onSave={(data) => { console.log(data); setIsAddOpen(false); fetchAdmins(); }} />
      <AdminPermissionsModal admin={managingPerms} onClose={() => setManagingPerms(null)} onSave={(perms) => { console.log(perms); setManagingPerms(null); fetchAdmins(); }} />
    </div>
  );
}

