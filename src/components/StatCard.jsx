import { TrendingUp, TrendingDown, Phone, FileText, AlertTriangle, ShieldCheck } from 'lucide-react';

const iconMap = {
  Phone: Phone,
  FileText: FileText,
  AlertTriangle: AlertTriangle,
  ShieldCheck: ShieldCheck,
};

export default function StatCard({ card }) {
  const Icon = iconMap[card.icon];

  return (
    <div className={`bg-white rounded-xl border border-slate-200 p-5 card-hover transition-all cursor-default ${card.isAlert ? 'ring-1 ring-red-200' : ''}`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-11 h-11 rounded-xl ${card.iconBg} flex items-center justify-center flex-shrink-0`}>
          <Icon className={card.iconColor} size={22} />
        </div>
        {card.isAlert && (
          <span className="relative flex h-3 w-3 mt-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        )}
      </div>

      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{card.label}</p>

      <p className={`text-4xl font-extrabold mb-2 ${card.isAlert ? 'text-red-600' : 'text-slate-800'}`}>
        {card.value}
        {card.id === 'relawan-aktif' && (
          <span className="text-lg font-semibold text-slate-400 ml-1">personil</span>
        )}
      </p>

      <div className="flex items-center gap-1.5">
        {card.trendUp === true && (
          <span className="flex items-center gap-0.5 bg-emerald-50 text-emerald-600 text-xs font-semibold px-1.5 py-0.5 rounded-md">
            <TrendingUp size={11} />
            {card.trend}
          </span>
        )}
        {card.trendUp === false && (
          <span className="flex items-center gap-0.5 bg-red-50 text-red-500 text-xs font-semibold px-1.5 py-0.5 rounded-md">
            <TrendingDown size={11} />
            {card.trend}
          </span>
        )}
        <span className="text-slate-400 text-xs">{card.trendLabel}</span>
      </div>
    </div>
  );
}
