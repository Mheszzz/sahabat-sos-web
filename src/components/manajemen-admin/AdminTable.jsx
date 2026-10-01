import { Eye, Shield, Trash2, Activity, User } from 'lucide-react';
import Badge from '../global/Badge';
import InitialsAvatar from '../global/InitialsAvatar';

export default function AdminTable({ admins, isLoading, onDetail, onPermissions, onRevoke }) {
  if (isLoading) return <div className="text-center p-10 text-slate-500">Memuat data...</div>;
  if (admins.length === 0) return <div className="text-center p-10 text-slate-500">Tidak ada data admin ditemukan.</div>;

  return (
    <div className="bg-white border border-[#eaedf1] rounded-2xl shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-[#eaedf1]">
              <th className="p-4 text-[12px] font-semibold text-slate-500 uppercase tracking-wider w-[250px]">Profil Admin</th>
              <th className="p-4 text-[12px] font-semibold text-slate-500 uppercase tracking-wider">Status & Operasional</th>
              <th className="p-4 text-[12px] font-semibold text-slate-500 uppercase tracking-wider">Performa</th>
              <th className="p-4 text-[12px] font-semibold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eaedf1]">
            {admins.map(admin => (
              <tr key={admin.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <InitialsAvatar name={admin.nama} className="w-10 h-10 rounded-xl" />
                    <div>
                      <p className="text-[14px] font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">{admin.nama}</p>
                      <p className="text-[12px] text-slate-500">{admin.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex flex-col items-start gap-1.5">
                    <Badge variant={admin.status === 'Aktif' ? 'success' : 'danger'}>{admin.status}</Badge>
                    <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                      {admin.operasional === 'Sedang Bertugas' ? <Activity size={10} className="text-blue-500"/> : <User size={10}/>}
                      {admin.operasional}
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <p className="text-[13px] font-medium text-slate-700">{admin.kasusDitangani} Kasus</p>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onDetail(admin)} className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 flex items-center justify-center transition-all" title="Detail">
                      <Eye size={14} />
                    </button>
                    <button onClick={() => onPermissions(admin)} className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 flex items-center justify-center transition-all" title="Hak Akses">
                      <Shield size={14} />
                    </button>
                    <button onClick={() => onRevoke(admin)} className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50 flex items-center justify-center transition-all" title="Cabut Akses">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
