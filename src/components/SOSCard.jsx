import { MapPin, Users, Phone, ArrowRight, Ambulance, Clock, AlertCircle } from 'lucide-react';

const accentStyles = {
  red: {
    border: 'border-l-red-500',
    badge: 'bg-red-100 text-red-700',
    dot: 'bg-red-500',
    bg: 'bg-red-50/50',
  },
  blue: {
    border: 'border-l-blue-500',
    badge: 'bg-blue-100 text-blue-700',
    dot: 'bg-blue-500',
    bg: 'bg-blue-50/30',
  },
  amber: {
    border: 'border-l-amber-500',
    badge: 'bg-amber-100 text-amber-700',
    dot: 'bg-amber-500',
    bg: 'bg-amber-50/30',
  },
};

const statusStyles = {
  'Sedang Ditangani': 'bg-blue-100 text-blue-700',
  'Menunggu Respon': 'bg-amber-100 text-amber-700',
  'Teratasi': 'bg-emerald-100 text-emerald-700',
};

export default function SOSCard({ kasus }) {
  const accent = accentStyles[kasus.accentColor] || accentStyles.blue;
  const isDarurat = kasus.type === 'darurat';

  return (
    <div className={`bg-white rounded-xl border border-slate-200 border-l-4 ${accent.border} p-4 card-hover transition-all`}>
      {/* Top badges row */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-md ${accent.badge} flex items-center gap-1`}>
            {isDarurat && <AlertCircle size={10} />}
            {kasus.id}
          </span>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${isDarurat ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
            {kasus.priority}
          </span>
          {isDarurat && (
            <span className="relative flex h-2 w-2 mt-0.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          )}
        </div>
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${statusStyles[kasus.status] || 'bg-slate-100 text-slate-600'}`}>
          {kasus.status}
        </span>
      </div>

      {/* Category */}
      <p className="text-sm font-semibold text-slate-800 mb-2 leading-tight">{kasus.category}</p>

      {/* Details grid */}
      <div className="grid grid-cols-1 gap-1.5 mb-3">
        <div className="flex items-start gap-2">
          <MapPin size={12} className="text-slate-400 mt-0.5 flex-shrink-0" />
          <span className="text-xs text-slate-500 leading-tight">{kasus.lokasi}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users size={12} className="text-slate-400 flex-shrink-0" />
          <span className="text-xs text-slate-600 font-medium">{kasus.pelapor.nama}</span>
          <span className="text-xs text-slate-400">·</span>
          <span className="text-xs text-slate-400">{kasus.pelapor.disabilitas}</span>
        </div>
        {kasus.relawan.nama !== 'Belum Ditugaskan' && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0 flex items-center justify-center">
              <span className="text-[7px] text-white font-bold">{kasus.relawan.avatar.charAt(0)}</span>
            </div>
            <span className="text-xs text-slate-600 font-medium">{kasus.relawan.nama}</span>
            <span className="text-[10px] bg-emerald-50 text-emerald-600 px-1.5 rounded font-medium">{kasus.relawan.badge}</span>
          </div>
        )}
        {kasus.relawan.nama === 'Belum Ditugaskan' && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-400 flex-shrink-0"></div>
            <span className="text-xs text-amber-600 font-medium italic">Relawan belum ditugaskan</span>
          </div>
        )}
      </div>

      {/* Ambulance status */}
      {kasus.ambulans && (
        <div className="bg-slate-50 border border-slate-100 rounded-lg px-3 py-1.5 mb-3 flex items-center gap-2">
          <Ambulance size={12} className="text-slate-400" />
          <span className="text-[11px] text-slate-600 font-medium">{kasus.ambulans}</span>
        </div>
      )}

      {/* Time */}
      <div className="flex items-center gap-1 mb-3">
        <Clock size={11} className="text-slate-400" />
        <span className="text-[11px] text-slate-400">{kasus.waktu}</span>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 pt-2 border-t border-slate-100">
        {kasus.status !== 'Teratasi' && (
          <button
            id={`btn-hubungi-${kasus.id}`}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer"
          >
            <Phone size={11} />
            Hubungi Relawan
          </button>
        )}
        {kasus.type === 'laporan' && kasus.status !== 'Teratasi' && (
          <button
            id={`btn-teratasi-${kasus.id}`}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer"
          >
            Tandai Teratasi
          </button>
        )}
        <button
          id={`btn-detail-${kasus.id}`}
          className="flex items-center gap-1 text-slate-500 hover:text-slate-700 text-xs font-semibold px-2 py-1.5 rounded-lg hover:bg-slate-50 transition-all ml-auto cursor-pointer"
        >
          Lihat Detail
          <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
}
