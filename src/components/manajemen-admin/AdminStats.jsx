import { Users, UserCheck, Activity, Clock } from 'lucide-react';

export default function AdminStats({ totalAdmin, adminAktif, sedangBertugas, offlineCount }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      <div className="bg-white border border-[#eaedf1] rounded-2xl p-5 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-[13px] font-semibold text-slate-500">Total Admin</p>
          <p className="text-[30px] font-black text-slate-900 leading-none mt-2">{totalAdmin}</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600">
          <Users size={22} />
        </div>
      </div>
      <div className="bg-white border border-[#eaedf1] rounded-2xl p-5 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-[13px] font-semibold text-slate-500">Admin Aktif</p>
          <p className="text-[30px] font-black text-slate-900 leading-none mt-2">{adminAktif}</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-[#ecfdf5] flex items-center justify-center text-[#10b981]">
          <UserCheck size={22} />
        </div>
      </div>
      <div className="bg-white border border-[#eaedf1] rounded-2xl p-5 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-[13px] font-semibold text-slate-500">Sedang Bertugas</p>
          <p className="text-[30px] font-black text-slate-900 leading-none mt-2">{sedangBertugas}</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-[#eff6ff] flex items-center justify-center text-[#3b82f6]">
          <Activity size={22} />
        </div>
      </div>
      <div className="bg-white border border-[#eaedf1] rounded-2xl p-5 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-[13px] font-semibold text-slate-500">Offline</p>
          <p className="text-[30px] font-black text-slate-900 leading-none mt-2">{offlineCount}</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
          <Clock size={22} />
        </div>
      </div>
    </div>
  );
}
