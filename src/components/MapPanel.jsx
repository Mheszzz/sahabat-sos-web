import { mapPins } from '../data/dummyData';

const PIN_STYLES = {
  sos: { bg: 'bg-red-500', shadow: 'shadow-red-300', label: 'text-red-700 bg-red-50 border-red-200' },
  relawan: { bg: 'bg-emerald-500', shadow: 'shadow-emerald-300', label: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  posko: { bg: 'bg-blue-500', shadow: 'shadow-blue-300', label: 'text-blue-700 bg-blue-50 border-blue-200' },
};

function MapPin({ pin }) {
  const style = PIN_STYLES[pin.type];
  const isDarurat = pin.type === 'sos';
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-full group cursor-pointer"
      style={{ left: pin.x, top: pin.y }}
    >
      {/* Tooltip */}
      <div className={`absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded text-[10px] font-semibold border opacity-0 group-hover:opacity-100 transition-opacity ${style.label} z-10`}>
        {pin.label}
      </div>
      {/* Pin */}
      <div className="relative flex flex-col items-center">
        {isDarurat && (
          <span className={`absolute -top-1 -left-1 w-5 h-5 rounded-full ${style.bg} opacity-40 animate-ping`}></span>
        )}
        <div className={`w-3.5 h-3.5 rounded-full ${style.bg} shadow-md ${style.shadow} border-2 border-white`}></div>
        <div className={`w-0.5 h-1.5 ${style.bg} opacity-70`}></div>
      </div>
    </div>
  );
}

export default function MapPanel({ relawanCount = 54 }) {
  // Fake map grid lines for OSM-like appearance
  const gridCols = 8;
  const gridRows = 6;

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Peta Pemantauan Wilayah</h3>
          <p className="text-xs text-slate-400 mt-0.5">Jakarta & Sekitarnya — Real-time</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
          <span className="text-xs font-semibold text-emerald-600">{relawanCount} Relawan Terdekat</span>
        </div>
      </div>

      {/* Map container */}
      <div className="relative h-52 bg-[#e8f0f7] overflow-hidden">
        {/* Road network mock */}
        <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
          {/* Horizontal roads */}
          <line x1="0" y1="40%" x2="100%" y2="40%" stroke="#94a3b8" strokeWidth="2"/>
          <line x1="0" y1="60%" x2="100%" y2="60%" stroke="#94a3b8" strokeWidth="1.5"/>
          <line x1="0" y1="25%" x2="100%" y2="28%" stroke="#94a3b8" strokeWidth="1"/>
          <line x1="0" y1="75%" x2="100%" y2="73%" stroke="#94a3b8" strokeWidth="1"/>
          {/* Vertical roads */}
          <line x1="30%" y1="0" x2="32%" y2="100%" stroke="#94a3b8" strokeWidth="2"/>
          <line x1="55%" y1="0" x2="54%" y2="100%" stroke="#94a3b8" strokeWidth="1.5"/>
          <line x1="70%" y1="0" x2="71%" y2="100%" stroke="#94a3b8" strokeWidth="1"/>
          <line x1="15%" y1="0" x2="14%" y2="100%" stroke="#94a3b8" strokeWidth="1"/>
          {/* Diagonal roads */}
          <line x1="0" y1="30%" x2="50%" y2="55%" stroke="#94a3b8" strokeWidth="1"/>
          <line x1="50%" y1="55%" x2="100%" y2="45%" stroke="#94a3b8" strokeWidth="1"/>
        </svg>

        {/* Block areas */}
        <div className="absolute" style={{left:'10%', top:'15%', width:'18%', height:'30%', background:'rgba(148,163,184,0.12)', border:'1px solid rgba(148,163,184,0.2)', borderRadius:'4px'}}></div>
        <div className="absolute" style={{left:'56%', top:'35%', width:'22%', height:'25%', background:'rgba(148,163,184,0.12)', border:'1px solid rgba(148,163,184,0.2)', borderRadius:'4px'}}></div>
        <div className="absolute" style={{left:'35%', top:'62%', width:'15%', height:'25%', background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.2)', borderRadius:'4px'}}></div>

        {/* District labels */}
        <span className="absolute text-[9px] text-slate-400 font-medium" style={{left:'12%', top:'10%'}}>Menteng</span>
        <span className="absolute text-[9px] text-slate-400 font-medium" style={{left:'44%', top:'22%'}}>Sudirman</span>
        <span className="absolute text-[9px] text-slate-400 font-medium" style={{left:'60%', top:'64%'}}>Manggarai</span>
        <span className="absolute text-[9px] text-slate-400 font-medium" style={{left:'20%', top:'72%'}}>Blok M</span>

        {/* Map Pins */}
        {mapPins.map((pin) => (
          <MapPin key={pin.id} pin={pin} />
        ))}
      </div>

      {/* Legend */}
      <div className="px-4 py-2.5 bg-slate-50 flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
          <span className="text-[10px] text-slate-500 font-medium">SOS Darurat (3)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
          <span className="text-[10px] text-slate-500 font-medium">Relawan Aktif (4)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
          <span className="text-[10px] text-slate-500 font-medium">Posko (2)</span>
        </div>
      </div>
    </div>
  );
}
