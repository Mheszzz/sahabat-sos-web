import { useState } from 'react';
import { Layers, Navigation, Battery, Phone, UserCheck, Radio, Maximize2 } from 'lucide-react';
import { mapPins, volunteers } from '../data/dummyData';

const layerToggles = [
  { id:'sos',    label:'SOS Aktif',    color:'bg-red-500',     count:3, enabled:true },
  { id:'relawan',label:'Relawan',      color:'bg-emerald-500', count:4, enabled:true },
  { id:'posko',  label:'Posko Medis',  color:'bg-blue-500',    count:2, enabled:true },
  { id:'ambu',   label:'Ambulans',     color:'bg-amber-500',   count:1, enabled:false },
];

const PIN_STYLES = {
  sos:     { bg:'bg-red-500',     border:'border-red-300',     pulse:true },
  relawan: { bg:'bg-emerald-500', border:'border-emerald-300', pulse:false },
  posko:   { bg:'bg-blue-500',    border:'border-blue-300',    pulse:false },
};

const volBattery = [88, 62, 97, 45];

export default function PetaPemantauanPage() {
  const [layers, setLayers] = useState(layerToggles.reduce((a, l) => ({ ...a, [l.id]: l.enabled }), {}));
  const toggleLayer = id => setLayers(p => ({ ...p, [id]: !p[id] }));

  const visiblePins = mapPins.filter(p => layers[p.type] !== false);

  return (
    <div className="flex h-full overflow-hidden">
      {/* Map area (flex-1) */}
      <div className="flex-1 relative bg-[#dce9f5] overflow-hidden min-h-0">

        {/* Layer toggle overlay (top-right) */}
        <div className="absolute top-4 right-4 z-20 bg-white rounded-xl shadow-lg border border-slate-200 p-3 space-y-2 min-w-[170px]">
          <div className="flex items-center gap-2 mb-2">
            <Layers size={14} className="text-slate-500" />
            <p className="text-xs font-bold text-slate-700">Layer Peta</p>
          </div>
          {layerToggles.map(lyr => (
            <button
              key={lyr.id}
              onClick={() => toggleLayer(lyr.id)}
              className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                layers[lyr.id] ? 'bg-slate-50 text-slate-800' : 'opacity-40 text-slate-400'
              }`}
            >
              <span className={`w-3 h-3 rounded-full flex-shrink-0 ${lyr.color}`}></span>
              <span className="flex-1 text-left">{lyr.label}</span>
              <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded-full">{lyr.count}</span>
            </button>
          ))}
        </div>

        {/* Live badge top-left */}
        <div className="absolute top-4 left-4 z-20 bg-white rounded-xl shadow-lg border border-slate-200 px-3 py-2 flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
          <span className="text-xs font-bold text-slate-800">Live — Peta Pemantauan Wilayah</span>
          <span className="text-xs text-slate-400">Jakarta & Sekitarnya</span>
        </div>

        {/* SVG Road network */}
        <svg className="absolute inset-0 w-full h-full opacity-25" xmlns="http://www.w3.org/2000/svg">
          <line x1="0" y1="35%" x2="100%" y2="38%" stroke="#64748b" strokeWidth="3"/>
          <line x1="0" y1="55%" x2="100%" y2="52%" stroke="#64748b" strokeWidth="2"/>
          <line x1="0" y1="20%" x2="100%" y2="23%" stroke="#64748b" strokeWidth="1.5"/>
          <line x1="0" y1="70%" x2="100%" y2="68%" stroke="#64748b" strokeWidth="1.5"/>
          <line x1="28%" y1="0" x2="30%" y2="100%" stroke="#64748b" strokeWidth="3"/>
          <line x1="52%" y1="0" x2="51%" y2="100%" stroke="#64748b" strokeWidth="2"/>
          <line x1="72%" y1="0" x2="73%" y2="100%" stroke="#64748b" strokeWidth="1.5"/>
          <line x1="12%" y1="0" x2="11%" y2="100%" stroke="#64748b" strokeWidth="1"/>
          <line x1="0" y1="28%" x2="55%" y2="50%" stroke="#64748b" strokeWidth="1.5"/>
          <line x1="55%" y1="50%" x2="100%" y2="42%" stroke="#64748b" strokeWidth="1.5"/>
          <line x1="0" y1="60%" x2="45%" y2="40%" stroke="#64748b" strokeWidth="1"/>
        </svg>

        {/* City blocks */}
        {[
          {left:'8%',top:'12%',w:'20%',h:'35%',green:false},
          {left:'56%',top:'32%',w:'24%',h:'28%',green:false},
          {left:'33%',top:'60%',w:'18%',h:'30%',green:true},
          {left:'70%',top:'62%',w:'16%',h:'25%',green:false},
        ].map((b,i) => (
          <div key={i} className="absolute" style={{
            left:b.left,top:b.top,width:b.w,height:b.h,
            background: b.green ? 'rgba(16,185,129,0.08)' : 'rgba(148,163,184,0.1)',
            border: `1px solid ${b.green ? 'rgba(16,185,129,0.2)' : 'rgba(148,163,184,0.2)'}`,
            borderRadius:'6px'
          }} />
        ))}

        {/* District labels */}
        {[
          {x:'10%',y:'8%',label:'Menteng'},{x:'44%',y:'18%',label:'Sudirman'},
          {x:'60%',y:'62%',label:'Manggarai'},{x:'18%',y:'70%',label:'Blok M'},
          {x:'75%',y:'28%',label:'Kuningan'},{x:'58%',y:'80%',label:'Pasar Minggu'},
        ].map((d,i) => (
          <span key={i} className="absolute text-[10px] text-slate-500 font-semibold" style={{left:d.x,top:d.y}}>{d.label}</span>
        ))}

        {/* Map Pins */}
        {visiblePins.map(pin => {
          const style = PIN_STYLES[pin.type] || PIN_STYLES.posko;
          return (
            <div key={pin.id} className="absolute -translate-x-1/2 -translate-y-full group cursor-pointer z-10" style={{left:pin.x,top:pin.y}}>
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white text-slate-800 text-[10px] font-bold px-2 py-1 rounded-lg shadow-lg border border-slate-200 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                {pin.label}
              </div>
              <div className="relative flex flex-col items-center">
                {style.pulse && (
                  <span className={`absolute -top-1.5 -left-1.5 w-6 h-6 rounded-full ${style.bg} opacity-30 animate-ping`}></span>
                )}
                <div className={`w-4 h-4 rounded-full ${style.bg} border-2 border-white shadow-md`}></div>
                <div className={`w-0.5 h-2 ${style.bg} opacity-60`}></div>
              </div>
            </div>
          );
        })}

        {/* Legend bottom-left */}
        <div className="absolute bottom-4 left-4 z-20 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 px-4 py-2.5 flex items-center gap-4 flex-wrap">
          {[
            {color:'bg-red-500',label:'SOS Darurat'},
            {color:'bg-emerald-500',label:'Relawan Aktif'},
            {color:'bg-blue-500',label:'Posko Medis'},
            {color:'bg-amber-500',label:'Ambulans'},
          ].map(l => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className={`w-2.5 h-2.5 rounded-full ${l.color}`}></div>
              <span className="text-[11px] text-slate-600 font-medium">{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right drawer */}
      <div className="w-80 flex-shrink-0 bg-white border-l border-slate-200 flex flex-col overflow-hidden">
        {/* Drawer header */}
        <div className="px-4 py-4 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-800">Daftar Kehadiran Relawan</h2>
          <div className="flex items-center gap-3 mt-2">
            <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              114 Siaga
            </span>
            <span className="flex items-center gap-1.5 bg-amber-50 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              28 Bertugas
            </span>
          </div>
        </div>

        {/* Volunteer list */}
        <div className="flex-1 overflow-y-auto sidebar-scroll p-3 space-y-3">
          {volunteers.map((rel, idx) => {
            const grad = ['from-blue-400 to-blue-600','from-emerald-400 to-teal-600','from-violet-400 to-purple-600','from-orange-400 to-amber-600'][idx];
            const bat = volBattery[idx];
            return (
              <div key={rel.id} className="bg-slate-50 rounded-xl border border-slate-100 p-3 hover:border-slate-200 transition-all">
                <div className="flex items-start gap-3 mb-2.5">
                  <div className="relative">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${grad} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm`}>
                      {rel.avatar}
                    </div>
                    <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${rel.status === 'Siaga' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800">{rel.nama}</p>
                    <p className="text-xs text-slate-400 truncate">{rel.peran}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Navigation size={10} className="text-slate-400" />
                      <span className="text-[11px] text-slate-600 font-medium">{rel.jarak}</span>
                      <span className="text-slate-300 text-xs">·</span>
                      <span className="text-[11px] text-slate-400">ETA {rel.eta}</span>
                    </div>
                  </div>
                </div>
                {/* Battery */}
                <div className="flex items-center gap-2 mb-2.5">
                  <Battery size={12} className={bat > 50 ? 'text-emerald-500' : bat > 20 ? 'text-amber-500' : 'text-red-500'} />
                  <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${bat > 50 ? 'bg-emerald-500' : bat > 20 ? 'bg-amber-500' : 'bg-red-500'}`} style={{width:`${bat}%`}} />
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">{bat}%</span>
                </div>
                {/* Actions */}
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-1 border border-slate-200 hover:bg-white text-slate-600 text-xs font-semibold py-1.5 rounded-lg transition-all cursor-pointer">
                    <Phone size={11} /> Hubungi
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1 bg-[#062c26] hover:bg-emerald-800 text-white text-xs font-semibold py-1.5 rounded-lg transition-all cursor-pointer">
                    <UserCheck size={11} /> Tugaskan
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
