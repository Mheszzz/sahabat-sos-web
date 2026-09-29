import { Users, HeartHandshake, ShieldCheck } from 'lucide-react';

export default function UserTabs({ activeTab, setActiveTab, pendingCount }) {
  return (
    <div className="flex flex-wrap items-center gap-2 bg-white border border-[#eaedf1] p-1.5 rounded-2xl w-fit shadow-xs">
      <button
        onClick={() => setActiveTab('pengguna')}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold transition-all cursor-pointer ${
          activeTab === 'pengguna' ? 'bg-[#0a271f] text-white' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <Users size={15} />
        <span>Pengguna Difabel</span>
      </button>
      <button
        onClick={() => setActiveTab('relawan')}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold transition-all cursor-pointer ${
          activeTab === 'relawan' ? 'bg-[#0a271f] text-white' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <HeartHandshake size={15} />
        <span>Relawan Terdaftar</span>
      </button>
      <button
        onClick={() => setActiveTab('pending')}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold transition-all cursor-pointer ${
          activeTab === 'pending' ? 'bg-[#b45309] text-white' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <ShieldCheck size={15} />
        <span>Pending Verifikasi {pendingCount > 0 && `(${pendingCount})`}</span>
      </button>
    </div>
  );
}
