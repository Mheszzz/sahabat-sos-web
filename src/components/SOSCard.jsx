import { MapPin, User, Shield, Phone, Eye, Clock, Car, HeartPulse } from 'lucide-react';

const iconMap = {
  ambulance: { icon: Car, bg: 'bg-red-50 text-red-500' },
  wheelchair: { icon: User, bg: 'bg-blue-50 text-blue-600' },
  user: { icon: User, bg: 'bg-amber-50 text-amber-600' },
  medical: { icon: HeartPulse, bg: 'bg-emerald-50 text-emerald-600' },
};

const badgeStyleMap = {
  'Prioritas Tinggi': 'bg-[#fef2f2] text-[#ef4444]',
  'Sedang Ditangani': 'bg-[#eff6ff] text-[#2563eb]',
  'Menunggu Respon': 'bg-[#fff7ed] text-[#d97706]',
  'Prioritas Rendah': 'bg-[#ecfdf5] text-[#15803d]',
};

export default function SOSCard({ kasus, onOpenDetail }) {
  const iconData = iconMap[kasus.iconType] || { icon: User, bg: 'bg-slate-100 text-slate-600' };
  const MainIcon = iconData.icon;
  const tagStyle = badgeStyleMap[kasus.statusTag] || 'bg-slate-100 text-slate-600';
  const isDarurat = kasus.tagType === 'DARURAT SOS';

  return (
    <div className="rounded-xl border border-[#e5e7eb] bg-[#fafbfc] p-3.5 transition-all duration-150 hover:border-slate-300 hover:bg-white hover:shadow-[0_4px_12px_-8px_rgba(15,23,42,0.12)]">
      {/* Top row - ID, tag, status */}
      <div className="mb-2.5 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconData.bg} flex-shrink-0`}>
            <MainIcon size={15} />
          </div>

          <div className="flex min-w-0 flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-extrabold tracking-[0.04em] text-slate-800">{kasus.id}</span>
            <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-[0.08em] ${isDarurat ? 'bg-[#fef2f2] text-[#b42318]' : 'bg-[#eaf8f5] text-[#0b6f61]'}`}>
              {kasus.tagType}
            </span>
          </div>
        </div>

        <span className={`inline-flex flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${tagStyle}`}>
          {kasus.statusTag}
        </span>
      </div>

      {/* Category title */}
      <h3 className="mb-2.5 text-[13px] font-bold leading-snug tracking-[-0.01em] text-slate-900">{kasus.kategori}</h3>

      {/* Info rows */}
      <div className="space-y-1.5 text-[11px] text-slate-500">
        <div className="flex items-start gap-1.5">
          <MapPin size={12} className="mt-0.5 flex-shrink-0 text-slate-400" />
          <span className="leading-relaxed">{kasus.lokasi}</span>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <div className="flex items-center gap-1">
            <User size={12} className="text-slate-400 flex-shrink-0" />
            <span className="font-semibold text-slate-700">{kasus.pelapor.nama}</span>
          </div>

          <div className="flex items-center gap-1">
            <Shield size={12} className="text-slate-400 flex-shrink-0" />
            <span className={kasus.relawan?.nama ? 'font-semibold text-slate-700' : 'italic text-slate-400'}>
              {kasus.relawan?.nama ? kasus.relawan.nama : 'Belum ditugaskan'}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between gap-2 border-t border-[#eef2f7] pt-2.5">
        <div className="flex items-center gap-2 text-[10px] text-slate-400">
          <div className="flex items-center gap-1">
            <Clock size={11} />
            <span>{kasus.waktu}</span>
          </div>
          {kasus.eta && (
            <>
              <span>·</span>
              <span className="font-bold text-[#059669]">{kasus.eta}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={() => alert(`Menghubungi relawan untuk kasus ${kasus.id}`)}
            className="inline-flex items-center gap-1 rounded-lg bg-[#0b6f61] px-2.5 py-1 text-[10px] font-bold text-white transition-colors hover:bg-[#095c52]"
          >
            <Phone size={11} />
            <span>Hubungi</span>
          </button>

          <button
            onClick={() => onOpenDetail?.(kasus.id)}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-bold text-slate-600 transition-colors hover:bg-slate-50"
          >
            <Eye size={11} />
            <span>Detail</span>
          </button>
        </div>
      </div>
    </div>
  );
}
