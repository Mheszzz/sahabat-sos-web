import { Navigation, Phone } from 'lucide-react';

const statusStyles = {
  Bertugas: 'bg-amber-100 text-amber-700',
  Siaga: 'bg-emerald-100 text-emerald-700',
};

const avatarColors = [
  'from-blue-400 to-blue-600',
  'from-emerald-400 to-teal-600',
  'from-violet-400 to-purple-600',
  'from-orange-400 to-amber-600',
];

export default function VolunteerCard({ relawan, index }) {
  const gradient = avatarColors[index % avatarColors.length];

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition-all cursor-default">
      {/* Avatar */}
      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm`}>
        {relawan.avatar}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-sm font-semibold text-slate-800 truncate">{relawan.nama}</p>
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0 ${statusStyles[relawan.status]}`}>
            {relawan.status}
          </span>
        </div>
        <p className="text-[11px] text-slate-400 truncate">{relawan.peran}</p>
        <div className="flex items-center gap-1 mt-1">
          <Navigation size={10} className="text-slate-400" />
          <span className="text-[11px] text-slate-500 font-medium">{relawan.jarak}</span>
          <span className="text-slate-300">·</span>
          <span className="text-[11px] text-slate-400">ETA {relawan.eta}</span>
        </div>
      </div>

      {/* Action */}
      <button
        id={`btn-tugaskan-${relawan.id}`}
        className="flex-shrink-0 bg-[#062c26] hover:bg-emerald-800 text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer"
      >
        Tugaskan
      </button>
    </div>
  );
}
