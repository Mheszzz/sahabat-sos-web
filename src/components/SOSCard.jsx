import { MapPin, User, Shield, Phone, Eye, Clock, Ambulance, Car, HeartPulse } from 'lucide-react';

const iconMap = {
  ambulance:  { icon: Car,        bg: 'bg-red-50 text-red-500' },
  wheelchair: { icon: User,       bg: 'bg-blue-50 text-blue-600' },
  user:       { icon: User,       bg: 'bg-amber-50 text-amber-600' },
  medical:    { icon: HeartPulse, bg: 'bg-emerald-50 text-emerald-600' },
};

const badgeStyleMap = {
  'Prioritas Tinggi': 'bg-[#fef2f2] text-[#ef4444] border border-red-100',
  'Sedang Ditangani': 'bg-[#eff6ff] text-[#2563eb] border border-blue-100',
  'Menunggu Respon':  'bg-[#fffbeb] text-[#d97706] border border-amber-100',
  'Prioritas Rendah': 'bg-[#f0fdf4] text-[#16a34a] border border-green-100',
};

export default function SOSCard({ kasus, onOpenDetail }) {
  const iconData = iconMap[kasus.iconType] || { icon: User, bg: 'bg-slate-50 text-slate-500' };
  const MainIcon = iconData.icon;
  const tagStyle = badgeStyleMap[kasus.statusTag] || 'bg-slate-50 text-slate-600 border border-slate-200';

  const isDarurat = kasus.tagType === 'DARURAT SOS';

  return (
    <div className="bg-white border border-[#eaedf1] rounded-2xl p-4 hover:border-slate-300 hover:shadow-xs transition-all duration-150">
      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2.5">
          {/* Boxed Icon */}
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${iconData.bg}`}>
            <MainIcon size={17} />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Case Code */}
            <span className="text-[12px] font-bold text-emerald-600">
              {kasus.id}
            </span>

            {/* Type Tag */}
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
              isDarurat ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
            }`}>
              {kasus.tagType}
            </span>
          </div>
        </div>

        {/* Status / Priority Tag */}
        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex-shrink-0 ${tagStyle}`}>
          {kasus.statusTag}
        </span>
      </div>

      {/* Case Title */}
      <h3 className="text-[14px] font-bold text-slate-900 leading-snug mb-2.5">
        {kasus.kategori}
      </h3>

      {/* Info Details */}
      <div className="space-y-1.5 text-[12px] text-slate-600 mb-3.5">
        <div className="flex items-start gap-2">
          <MapPin size={13} className="text-slate-400 mt-0.5 flex-shrink-0" />
          <span className="leading-tight text-slate-500">{kasus.lokasi}</span>
        </div>

        <div className="flex items-center gap-4 flex-wrap text-slate-500">
          <div className="flex items-center gap-1.5">
            <User size={13} className="text-slate-400 flex-shrink-0" />
            <span className="font-semibold text-slate-700">{kasus.pelapor.nama}</span>
            <span className="text-slate-400">({kasus.pelapor.role || 'Pelapor'})</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Shield size={13} className="text-slate-400 flex-shrink-0" />
            <span className={kasus.relawan?.nama ? 'font-semibold text-slate-700' : 'text-slate-400 italic'}>
              {kasus.relawan?.nama ? `${kasus.relawan.nama} (Relawan)` : 'Relawan belum ditugaskan'}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Footer: Timestamp & ETA | Actions */}
      <div className="pt-2.5 border-t border-[#f1f5f9] flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
          <div className="flex items-center gap-1">
            <Clock size={12} className="text-slate-400" />
            <span>{kasus.waktu}</span>
          </div>
          {kasus.eta && (
            <>
              <span>•</span>
              <span className="font-bold text-[#059669]">{kasus.eta}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert(`Menghubungi relawan untuk kasus ${kasus.id}`)}
            className="flex items-center gap-1.5 bg-[#0a271f] hover:bg-[#061e18] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <Phone size={12} />
            <span>Hubungi Relawan</span>
          </button>

          <button
            onClick={() => onOpenDetail?.(kasus.id)}
            className="flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer shadow-2xs"
          >
            <Eye size={12} />
            <span>Detail</span>
          </button>
        </div>
      </div>
    </div>
  );
}
