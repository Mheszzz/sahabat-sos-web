import { Users } from 'lucide-react';
import ModernEmergencyMap from './ModernEmergencyMap';

export default function MapPanel({ relawanCount = 54, onOpenDetail }) {
  return (
    <div className="overflow-hidden rounded-[20px] border border-[#e2e8f0] bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
      <div className="flex items-center justify-between border-b border-[#f1f5f9] px-5 py-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-[15px] font-bold text-slate-900">Peta Pemantauan Wilayah</h2>
            <span className="h-2.5 w-2.5 rounded-full bg-[#10b981] pulse-soft" />
          </div>
          <p className="mt-1 text-[11px] font-medium text-slate-400">Jakarta & Sekitarnya — Real-time Command Center</p>
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#ecfdf5] px-3 py-1.5 text-[11px] font-bold text-[#0f766e]">
          <Users size={12} />
          <span>{relawanCount} Relawan Terdekat</span>
        </div>
      </div>

      <ModernEmergencyMap
        height="275px"
        onOpenDetail={onOpenDetail}
        showFilterBar={true}
        showLegend={true}
      />
    </div>
  );
}
