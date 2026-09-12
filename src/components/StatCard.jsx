import { TrendingUp, TrendingDown, Phone, FileText, AlertTriangle, ShieldCheck } from 'lucide-react';

const iconMap = {
  Phone: Phone,
  FileText: FileText,
  AlertTriangle: AlertTriangle,
  ShieldCheck: ShieldCheck,
};

export default function StatCard({ card }) {
  const Icon = iconMap[card.icon] || FileText;

  return (
    <div className="bg-white border border-[#eaedf1] rounded-2xl p-5 shadow-xs flex flex-col justify-between h-full min-h-[148px] hover:border-slate-300 transition-all duration-150">
      {/* Top: Icon & Label */}
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${card.iconBg}`}>
          <Icon size={18} className={card.iconColor} />
        </div>
        <span className="text-[13px] font-semibold text-slate-500 leading-tight">
          {card.label}
        </span>
      </div>

      {/* Middle: Big Value */}
      <div className="mt-3 flex items-baseline gap-1.5">
        <span className="text-[30px] font-black text-slate-900 tracking-tight leading-none">
          {card.value}
        </span>
        {card.valueSuffix && (
          <span className="text-[14px] font-semibold text-slate-400">
            {card.valueSuffix}
          </span>
        )}
      </div>

      {/* Bottom: Trend / Description */}
      <div className="mt-3 text-[12px] flex items-center gap-1.5 font-medium flex-wrap">
        {card.trend && (
          <span className={`font-bold inline-flex items-center gap-0.5 ${card.trendUp ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
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
