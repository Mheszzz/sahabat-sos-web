// StatCard.jsx — Unified stat / KPI card used on dashboard and other pages
import { AlertTriangle, Phone, FileText, ShieldCheck, Users } from 'lucide-react';

const iconMap = {
  AlertTriangle, Phone, FileText, ShieldCheck, Users,
};

export default function StatCard({ card }) {
  const Icon = iconMap[card.icon] || Users;
  const isAlert = card.isAlert;

  return (
    <div
      className="card-base p-5 flex items-start gap-4"
      style={isAlert ? { border: '1px solid #FECACA', background: '#FFFAFA' } : {}}
    >
      {/* Icon */}
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${card.iconBg || 'bg-slate-100'} ${card.iconColor || 'text-slate-500'}`}
      >
        <Icon size={18} />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p className="text-[12px] font-semibold text-slate-500 leading-none">{card.label}</p>
        <p
          className={`text-[28px] font-bold leading-none mt-2 tracking-tight ${isAlert ? 'text-red-600' : 'text-slate-900'}`}
        >
          {card.value ?? '—'}
          {card.valueSuffix && (
            <span className="text-[15px] font-semibold text-slate-400 ml-1">{card.valueSuffix}</span>
          )}
        </p>
        {card.trendLabel && (
          <p className="text-[11.5px] text-slate-400 mt-1.5 leading-none">{card.trendLabel}</p>
        )}
      </div>

      {/* Alert pulse indicator */}
      {isAlert && card.value > 0 && (
        <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0 mt-1" style={{ animation: 'pulseSoft 1.5s ease-in-out infinite' }} />
      )}
    </div>
  );
}