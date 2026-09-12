import { Users, Radio } from 'lucide-react';
import ModernEmergencyMap from './ModernEmergencyMap';

export default function MapPanel({ relawanCount = 54, onOpenDetail }) {
  return (
    <div className="bg-white border border-[#eaedf1] rounded-2xl overflow-hidden shadow-xs">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-[#f1f5f9] flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-[14px] font-bold text-slate-900 leading-tight">Peta Pemantauan Wilayah</h2>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Jakarta & Sekitarnya — Real-time Command Center</p>
        </div>
        <div className="flex items-center gap-1.5 bg-[#ecfdf5] text-[#059669] px-3 py-1 rounded-full text-[11px] font-bold">
          <Users size={12} />
          <span>{relawanCount} Relawan Terdekat</span>
        </div>
      </div>

      {/* Modern Emergency Leaflet Map */}
      <ModernEmergencyMap
        height="265px"
        onOpenDetail={onOpenDetail}
        showFilterBar={false}
        showLegend={true}
      />
    </div>
  );
}
