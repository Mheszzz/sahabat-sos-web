import { useState } from 'react';
import { UserPlus, Loader2 } from 'lucide-react';
import { useOutletContext, Navigate } from 'react-router-dom';
import PageHeader from '../../components/global/PageHeader';
import { useAdminData } from '../../hooks/manajemen-admin/useAdminData';
import AdminStats from '../../components/manajemen-admin/AdminStats';
import AdminFilters from '../../components/manajemen-admin/AdminFilters';
import AdminTable from '../../components/manajemen-admin/AdminTable';
import AdminAddModal from '../../components/manajemen-admin/AdminAddModal';
import AdminPermissionsModal from '../../components/manajemen-admin/AdminPermissionsModal';
import { adminService } from '../../api/services/adminService';

export default function ManajemenAdminPage() {
  const { currentUser } = useOutletContext() || {};
  const { 
    admins, isLoading, error,
    searchQuery, setSearchQuery, 
    statusFilter, setStatusFilter, 
    roleFilter, setRoleFilter,
    sortBy, setSortBy, 
    totalAdmin, adminDenganAkses, adminTanpaAkses, adminBaru, fetchAdmins 
  } = useAdminData();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [managingPerms, setManagingPerms] = useState(null);
  const [confirmRevoke, setConfirmRevoke] = useState(null); // stores admin object to revoke
  const [isRevoking, setIsRevoking] = useState(false);

  const handleRevokeConfirm = async () => {
    if (!confirmRevoke) return;
    try {
      setIsRevoking(true);
      await adminService.revokeAdminPermissions(confirmRevoke.id);
      fetchAdmins();
    } catch (err) {
      alert('Gagal mencabut hak akses admin.');
    } finally {
      setIsRevoking(false);
      setConfirmRevoke(null);
    }
  };

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

      <AdminStats 
        totalAdmin={totalAdmin} 
        adminDenganAkses={adminDenganAkses} 
        adminTanpaAkses={adminTanpaAkses} 
        adminBaru={adminBaru} 
      />
      
      <AdminFilters 
        searchQuery={searchQuery} setSearchQuery={setSearchQuery} 
        statusFilter={statusFilter} setStatusFilter={setStatusFilter} 
        roleFilter={roleFilter} setRoleFilter={setRoleFilter}
        sortBy={sortBy} setSortBy={setSortBy} 
      />
      
      <AdminTable 
        admins={admins} 
        isLoading={isLoading}
        error={error} 
        onDetail={(admin) => console.log('Detail aktivitas admin', admin)} 
        onPermissions={(admin) => setManagingPerms(admin)}
        onToggleStatus={(admin) => setConfirmRevoke(admin)}
      />

      <AdminAddModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onSave={() => { setIsAddOpen(false); fetchAdmins(); }} />
      <AdminPermissionsModal admin={managingPerms} onClose={() => setManagingPerms(null)} onSave={(perms) => { console.log(perms); setManagingPerms(null); fetchAdmins(); }} />

      {/* Confirmation Dialog for Revoke Permissions */}
      {confirmRevoke && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl animate-fade-in">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Cabut Seluruh Akses?</h3>
            <p className="text-[13px] text-slate-600 mb-6 leading-relaxed">
              Apakah Anda yakin ingin mencabut seluruh hak akses untuk admin <strong>{confirmRevoke.name || confirmRevoke.nama}</strong>? Admin ini hanya akan dapat mengakses beranda.
            </p>
            <div className="flex gap-2 justify-end">
              <button 
                onClick={() => setConfirmRevoke(null)}
                disabled={isRevoking}
                className="px-4 h-10 rounded-xl bg-slate-100 text-slate-700 text-[13px] font-semibold hover:bg-slate-200 transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button 
                onClick={handleRevokeConfirm}
                disabled={isRevoking}
                className="px-4 h-10 rounded-xl bg-red-600 text-white text-[13px] font-semibold hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isRevoking ? <><Loader2 size={14} className="animate-spin" /><span>Memproses...</span></> : <span>Ya, Cabut Akses</span>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

