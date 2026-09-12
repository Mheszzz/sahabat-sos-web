import { useState } from 'react';
import { Radio, AlertTriangle, Phone, ShieldCheck, Users, Clock, Navigation } from 'lucide-react';
import ModernEmergencyMap, { emergencyMapData } from '../components/ModernEmergencyMap';
import { volunteers } from '../data/dummyData';

export default function PetaPemantauanPage({ onOpenDetail }) {
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);

  const sosCount = emergencyMapData.filter(d => d.type === 'sos').length;
  const relawanCount = emergencyMapData.filter(d => d.type === 'relawan').length;
  const poskoCount = emergencyMapData.filter(d => d.type === 'posko').length;
  const laporanCount = emergencyMapData.filter(d => d.type === 'laporan').length;

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1680px] w-full mx-auto">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
              Emergency Response GIS Center
            </span>
          </div>
          <h1 className="text-[26px] font-black text-slate-900 tracking-tight leading-tight mt-0.5">
            Peta Pemantauan Wilayah
          </h1>
          <p className="text-[14px] text-slate-500 mt-1 font-medium">
            Pemantauan geospasial real-time, koordinasi titik SOS, dan pelacakan unit relawan siaga.
          </p>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-2 bg-white border border-[#eaedf1] px-4 py-2 rounded-xl text-[12px] font-semibold text-slate-600 shadow-xs">
          <Radio size={14} className="text-emerald-600 animate-pulse" />
          <span>Satelit Geospasial GPS Online (Akurasi 3m)</span>
        </div>
      </div>

      {/* ── Metric Summary Badges ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-[#eaedf1] rounded-2xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[12px] font-bold text-slate-400">🔴 SOS Aktif</span>
            <p className="text-[24px] font-black text-red-600 mt-1">{sosCount}</p>
          </div>
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
        </div>

        <div className="bg-white border border-[#eaedf1] rounded-2xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[12px] font-bold text-slate-400">🟢 Relawan Aktif</span>
            <p className="text-[24px] font-black text-emerald-600 mt-1">{relawanCount}</p>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
        </div>

        <div className="bg-white border border-[#eaedf1] rounded-2xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[12px] font-bold text-slate-400">🔵 Posko Siaga</span>
            <p className="text-[24px] font-black text-blue-600 mt-1">{poskoCount}</p>
          </div>
          <span className="w-2 h-2 rounded-full bg-blue-500" />
        </div>

        <div className="bg-white border border-[#eaedf1] rounded-2xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[12px] font-bold text-slate-400">🟠 Laporan Pending</span>
            <p className="text-[24px] font-black text-amber-600 mt-1">{laporanCount}</p>
          </div>
          <span className="w-2 h-2 rounded-full bg-amber-500" />
        </div>
      </div>

      {/* ── Large Map Canvas with Dispatch Panel Layout ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6 items-start">
        {/* Main Command Center Map */}
        <div className="w-full">
          <ModernEmergencyMap
            height="560px"
            onOpenDetail={onOpenDetail}
            showFilterBar={true}
            showLegend={true}
          />
        </div>

        {/* Right Dispatch & Responders Panel */}
        <div className="bg-white border border-[#eaedf1] rounded-2xl p-5 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3.5 flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-slate-900">Unit Relawan Siaga Terdekat</h2>
            <span className="text-[11px] font-bold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full">
              Live GPS
            </span>
          </div>

          {/* Volunteer List */}
          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {volunteers.map(vol => (
              <div
                key={vol.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-[#f8fafc] hover:bg-white hover:border-slate-300 transition-all cursor-pointer"
                onClick={() => setSelectedVolunteer(vol)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${vol.avatarBg}`}>
                      {vol.avatar}
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-slate-900 leading-tight">{vol.nama}</p>
                      <p className="text-[11px] text-slate-400">{vol.peran}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    vol.status === 'Bertugas' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {vol.status}
                  </span>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Jarak: <strong>{vol.jarak}</strong> · {vol.eta}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(`Menghubungi ${vol.nama} (${vol.kontak})`);
                    }}
                    className="text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Phone size={11} />
                    <span>Panggil</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Broadcast Alert Button */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <button
              onClick={() => alert('Sirene darurat dibunyikan di seluruh Posko Jabodetabek')}
              className="btn-base btn-primary w-full text-[12px] h-10"
            >
              <AlertTriangle size={14} />
              <span>Bunyikan Sirene di Seluruh Posko</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
