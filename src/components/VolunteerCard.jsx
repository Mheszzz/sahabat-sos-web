// VolunteerCard.jsx — Volunteer entry in dashboard list
import { Phone } from 'lucide-react';

const statusConfig = {
  'Online':  { dot: 'bg-green-500',  label: 'Siap', textCls: 'text-green-700' },
  'Bertugas': { dot: 'bg-blue-500',  label: 'Bertugas', textCls: 'text-blue-700' },
  'Siaga':    { dot: 'bg-amber-400', label: 'Siaga', textCls: 'text-amber-700' },
  'Offline':  { dot: 'bg-slate-300', label: 'Offline', textCls: 'text-slate-500' },
};

export default function VolunteerCard({ relawan }) {
  const s = statusConfig[relawan.status] || statusConfig['Online'];

  return (
    <div className="flex items-center gap-3 py-3 min-w-0">
      {/* Avatar */}
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${relawan.avatarBg || 'bg-slate-500'}`}
      >
        {relawan.avatar || relawan.nama?.[0] || '?'}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-[13px] font-semibold text-slate-800 truncate">{relawan.nama}</p>
          <span className={`flex items-center gap-1 text-[11px] font-semibold ${s.textCls} flex-shrink-0`}>
            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
            {s.label}
          </span>
        </div>
        <p className="text-[11.5px] text-slate-400 truncate">{relawan.peran}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 flex-shrink-0 text-[11.5px] text-slate-400">
        {relawan.jarak && <span>{relawan.jarak}</span>}
        <button
          className="btn-icon"
          style={{ width: 30, height: 30 }}
          title={`Hubungi ${relawan.nama}`}
          onClick={() => alert(`Menghubungi ${relawan.nama} (${relawan.kontak})`)}
        >
          <Phone size={12} />
        </button>
      </div>
    </div>
  );
}
