import { useState } from 'react';
import { UserPlus, X } from 'lucide-react';

export default function AdminAddModal({ isOpen, onClose, onSave }) {
  const [form, setForm] = useState({ nama: '', email: '', password: '' });
  const [isConfirming, setIsConfirming] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isConfirming) {
      setIsConfirming(true);
      return;
    }
    onSave(form);
    setForm({ nama: '', email: '', password: '' });
    setIsConfirming(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#eaedf1] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <UserPlus size={16} />
            </div>
            <h2 className="text-[17px] font-bold text-slate-900">Tambah Admin Baru</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[13px] font-semibold text-slate-700 block mb-1">Nama Lengkap</label>
            <input type="text" required value={form.nama} onChange={e => setForm({...form, nama: e.target.value})} className="w-full h-10 rounded-xl border border-slate-200 px-3 text-[13px]" />
          </div>
          <div>
            <label className="text-[13px] font-semibold text-slate-700 block mb-1">Email</label>
            <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full h-10 rounded-xl border border-slate-200 px-3 text-[13px]" />
          </div>
          <div>
            <label className="text-[13px] font-semibold text-slate-700 block mb-1">Kata Sandi</label>
            <input type="password" required value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="w-full h-10 rounded-xl border border-slate-200 px-3 text-[13px]" />
          </div>
          
          <div className="flex justify-end gap-2 pt-3">
            <button type="button" onClick={onClose} className="px-4 h-10 rounded-xl bg-slate-100 text-slate-700 text-[13px] font-semibold">Batal</button>
            <button type="submit" className="px-4 h-10 rounded-xl bg-emerald-600 text-white text-[13px] font-semibold">{isConfirming ? 'Ya, Buat Akun' : 'Lanjutkan'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
