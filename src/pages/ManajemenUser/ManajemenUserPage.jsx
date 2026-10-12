import { useState } from 'react';
import { Lock, ArrowLeft, UserPlus } from 'lucide-react';
import { useOutletContext, Link } from 'react-router-dom';
import PageHeader from '../../components/global/PageHeader';
import { useUsers } from '../../hooks/manajemen-user/useUsers';
import UserTabs from '../../components/manajemen-user/UserTabs';
import UserTable from '../../components/manajemen-user/UserTable';
import RelawanAddModal from '../../components/manajemen-user/RelawanAddModal';

export default function ManajemenUserPage() {
  const { currentUser } = useOutletContext() || {};
  const isSuperAdmin = currentUser?.role === 'Super Admin' || currentUser?.role === 'superadmin';
  const { activeTab, setActiveTab, search, setSearch, pendingRelawans, isLoading, filteredData, handleVerify, handleUpdateStatusRelawan, fetchRelawan } = useUsers();
  const [isAddRelawanOpen, setIsAddRelawanOpen] = useState(false);

  if (!isSuperAdmin) {
    return (
      <div className="p-6 lg:p-12 max-w-[800px] mx-auto text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto"><Lock size={30} /></div>
        <h1 className="text-[24px] font-black text-slate-900">403 — Akses Ditolak</h1>
        <Link to="/" className="btn-base btn-primary text-[13px] h-10 px-5 inline-flex"><ArrowLeft size={14} /><span>Kembali ke Dashboard</span></Link>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1680px] w-full mx-auto">
      <PageHeader 
        title="Manajemen Relawan"
        description="Kelola data relawan dan verifikasi pendaftaran relawan baru di platform Sahabat SOS."
        actions={<button onClick={() => setIsAddRelawanOpen(true)} className="btn-base btn-primary text-[13px] h-10 px-4"><UserPlus size={15} /><span>+ Tambah Relawan</span></button>}
      />
      <UserTabs activeTab={activeTab} setActiveTab={setActiveTab} pendingCount={pendingRelawans.length} />
      <UserTable
        activeTab={activeTab}
        search={search}
        setSearch={setSearch}
        data={filteredData}
        onVerify={handleVerify}
        onUpdateStatus={handleUpdateStatusRelawan}
      />

      <RelawanAddModal
        isOpen={isAddRelawanOpen}
        onClose={() => setIsAddRelawanOpen(false)}
        onSave={() => { setIsAddRelawanOpen(false); fetchRelawan(); }}
      />
    </div>
  );
}

