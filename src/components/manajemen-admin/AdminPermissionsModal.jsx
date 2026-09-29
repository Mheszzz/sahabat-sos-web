import { useState } from 'react';
import { X, Shield } from 'lucide-react';

const PERMISSIONS = [
  { key: 'MANAGE_USERS', label: 'Mengelola Akun Pengguna' },
  { key: 'VIEW_REPORTS', label: 'Melihat Laporan Darurat' },
  { key: 'RESOLVE_CASES', label: 'Menyelesaikan Kasus' }
];

export default function AdminPermissionsModal({ admin, onClose, onSave }) {
  const [selected, setSelected] = useState(admin?.permissions || []);

  if (!admin) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-[17px] font-bold text-slate-900">Kelola Hak Akses</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400">
            <X size={16} />
          </button>
        </div>
        
        <div className="space-y-2">
          {PERMISSIONS.map(p => (
            <label key={p.key} className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50">
              <input 
                type="checkbox" 
                checked={selected.includes(p.key)}
                onChange={(e) => {
                  if (e.target.checked) setSelected([...selected, p.key]);
                  else setSelected(selected.filter(x => x !== p.key));
                }}
                className="w-4 h-4 text-emerald-600"
              />
              <span className="text-[13px] font-medium text-slate-700">{p.label}</span>
            </label>
          ))}
        </div>

        <div className="flex justify-end gap-2 pt-3">
          <button type="button" onClick={onClose} className="px-4 h-10 rounded-xl bg-slate-100 text-slate-700 text-[13px] font-semibold">Batal</button>
          <button onClick={() => onSave(selected)} className="px-4 h-10 rounded-xl bg-emerald-600 text-white text-[13px] font-semibold">Simpan Perubahan</button>
        </div>
      </div>
    </div>
  );
}
