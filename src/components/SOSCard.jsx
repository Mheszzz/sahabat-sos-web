// SOSCard.jsx — Case card on dashboard active cases list
import { MapPin, Clock, Phone, Eye, User } from 'lucide-react';

const priorityConfig = {
  'KRITIS': { bar: 'bg-red-500',   text: 'text-red-600',   bg: 'bg-red-50',   label: 'Kritis' },
  'TINGGI': { bar: 'bg-orange-400', text: 'text-orange-600', bg: 'bg-orange-50', label: 'Tinggi' },
  'SEDANG': { bar: 'bg-amber-400', text: 'text-amber-600', bg: 'bg-amber-50', label: 'Sedang' },
  'default': { bar: 'bg-slate-300', text: 'text-slate-500', bg: 'bg-slate-50', label: '' },
};

const statusConfig = {
  'SOS Darurat':      { badge: 'badge badge-red',   label: 'SOS Darurat' },
  'Sedang Ditangani': { badge: 'badge badge-blue',  label: 'Ditangani' },
  'Menunggu Respon':  { badge: 'badge badge-amber', label: 'Menunggu' },
  'default':          { badge: 'badge badge-slate', label: '—' },
};

export default function SOSCard({ kasus, onOpenDetail }) {
  const p = priorityConfig[kasus.prioritas] || priorityConfig['default'];
  const s = statusConfig[kasus.status] || statusConfig['default'];

  return (
    <div className="flex gap-0 rounded-xl border border-slate-200 bg-white overflow-hidden hover:border-slate-300 hover:shadow-sm transition-all">
      {/* Priority bar */}
      <div className={`w-1 flex-shrink-0 ${p.bar}`} />

      {/* Content */}
      <div className="flex-1 p-4 min-w-0">
        {/* Top row */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold text-slate-400 tracking-wide">{kasus.id}</span>
              <span className={s.badge}>{s.label}</span>
              {kasus.prioritas && (
                <span className={`text-[10.5px] font-bold px-1.5 py-0.5 rounded ${p.bg} ${p.text}`}>
                  {p.label}
                </span>
              )}
            </div>
            <p className="text-[13.5px] font-semibold text-slate-800 mt-1.5 leading-snug line-clamp-1">
              {kasus.kategori}
            </p>
          </div>
          <span className="text-[11px] text-slate-400 whitespace-nowrap flex-shrink-0 mt-0.5 flex items-center gap-1">
            <Clock size={11} />
            {kasus.waktu}
          </span>
        </div>

        {/* Info row */}
        <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-slate-500">
          {kasus.lokasi && (
            <span className="flex items-center gap-1 min-w-0">
              <MapPin size={11} className="flex-shrink-0" />
              <span className="truncate max-w-[180px]">{kasus.lokasi}</span>
            </span>
          )}
          {kasus.pelapor?.nama && (
            <span className="flex items-center gap-1">
              <User size={11} className="flex-shrink-0" />
              {kasus.pelapor.nama}
            </span>
          )}
          {kasus.relawan?.nama && (
            <span className="font-medium text-emerald-700 flex items-center gap-1">
              Relawan: {kasus.relawan.nama}
            </span>
          )}
          {kasus.eta && (
            <span className="font-semibold text-blue-600">ETA {kasus.eta}</span>
          )}
        </div>

        {/* Action row */}
        <div className="mt-3 flex items-center gap-2 justify-end">
          <button
            onClick={() => alert(`Menghubungi kontak ${kasus.pelapor?.kontak || ''}...`)}
            className="btn-icon"
            title="Hubungi"
          >
            <Phone size={13} />
          </button>
          <button
            onClick={() => onOpenDetail?.(kasus.id)}
            className="btn-base btn-primary"
            style={{ height: '32px', padding: '0 12px', fontSize: '12px' }}
          >
            <Eye size={12} />
            Detail
          </button>
        </div>
      </div>
    </div>
  );
}
