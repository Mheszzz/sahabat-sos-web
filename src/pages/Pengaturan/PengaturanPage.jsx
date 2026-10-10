import { useState } from 'react';
import { Save, CheckCircle, User } from 'lucide-react';

export default function PengaturanPage() {
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [adminName, setAdminName] = useState('Dimas Wibisono');
  const [adminEmail, setAdminEmail] = useState('superadmin@sahabatsos.id');
  const [adminPhone, setAdminPhone] = useState('+62 812-8888-2026');

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="page-shell space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-[24px] font-extrabold tracking-[-0.04em] text-slate-900">Pengaturan Sistem</h1>
          <p className="mt-1 text-[14px] font-medium text-slate-500">Kelola informasi profil dan akun administrator.</p>
        </div>
        {savedSuccess && (
          <div className="flex items-center gap-2 rounded-xl border border-[#bbf7d0] bg-[#ecfdf5] px-3.5 py-2 text-[12px] font-bold text-[#15803d]">
            <CheckCircle size={14} />
            <span>Perubahan berhasil disimpan!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="rounded-[22px] border border-[#e2e8f0] bg-white p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
          <div className="border-b border-[#f1f5f9] pb-4 mb-5 flex items-center gap-2">
            <User size={16} className="text-[#0b6f61]" />
            <div>
              <h2 className="text-[16px] font-bold text-slate-900">Profil Administrator</h2>
              <p className="mt-0.5 text-[12px] text-slate-400">Informasi akun penanggung jawab sistem pusat.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="min-w-0">
              <label className="form-label">Nama Lengkap</label>
              <input type="text" value={adminName} onChange={e => setAdminName(e.target.value)} className="form-input" />
            </div>
            <div className="min-w-0">
              <label className="form-label">Alamat Email</label>
              <input type="email" value={adminEmail} onChange={e => setAdminEmail(e.target.value)} className="form-input" />
            </div>
            <div className="min-w-0">
              <label className="form-label">Nomor Telepon Darurat</label>
              <input type="text" value={adminPhone} onChange={e => setAdminPhone(e.target.value)} className="form-input" />
            </div>
            <div className="min-w-0">
              <label className="form-label">Role Akses</label>
              <input type="text" value="Super Admin (Level 1)" disabled className="form-input cursor-not-allowed bg-slate-50 text-slate-500" />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 pt-2">
          <button type="button" className="btn-base btn-secondary">Batal</button>
          <button type="submit" className="btn-base btn-primary h-10 px-6">
            <Save size={14} />
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </form>
    </div>
  );
}
