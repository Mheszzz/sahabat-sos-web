import { TrendingUp, TrendingDown, Phone, FileText, AlertTriangle, ShieldCheck } from 'lucide-react';

const iconMap = {
  Phone,
  FileText,
  AlertTriangle,
  ShieldCheck,
};

export default function StatCard({ card }) {
  const Icon = iconMap[card.icon] || FileText;

  return (
    <div className="relative flex h-full min-h-[120px] flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.06),0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_8px_20px_-14px_rgba(15,23,42,0.18)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[12px] font-semibold leading-relaxed text-slate-500">{card.label}</p>
        </div>
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${card.iconBg} flex-shrink-0`}>
          <Icon size={17} className={card.iconColor} />
        </div>
      </div>

      <div className="mt-2 flex items-end gap-1.5">
        <span className="text-[26px] font-extrabold leading-none tracking-[-0.04em] text-slate-900">
          {card.value}
        </span>
        {card.valueSuffix && (
          <span className="pb-0.5 text-[11px] font-semibold text-slate-400">{card.valueSuffix}</span>
        )}
      </div>

      <div className="mt-2.5 flex items-center gap-2 text-[11px]">
        {card.trend && (
          <span className={`inline-flex items-center gap-1 font-bold ${card.trendUp ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
            {card.trendUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {card.trend}
          </span>
        )}
        <span className={card.isAlert ? 'font-semibold text-[#ef4444]' : 'text-slate-400'}>
          {card.trendLabel}
        </span>
      </div>
    </div>
  );
}