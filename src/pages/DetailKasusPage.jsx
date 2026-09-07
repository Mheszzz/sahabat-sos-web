import { ArrowLeft, Printer, PhoneCall, ShieldAlert, MapPin, Phone, Copy, CheckCircle, Clock, Ambulance, Navigation, MessageSquare, User, AlertTriangle } from 'lucide-react';
import { sosCases, volunteers } from '../data/dummyData';

const timelineSteps = [
  { label:'Laporan Diterima', time:'14:47:03', done:true,  active:false, icon:CheckCircle, color:'text-emerald-600 bg-emerald-50 border-emerald-200' },
  { label:'Relawan Ditugaskan', time:'14:47:51', done:true,  active:false, icon:User,         color:'text-emerald-600 bg-emerald-50 border-emerald-200' },
  { label:'Ambulans Dikerahkan', time:'14:48:30', done:true,  active:false, icon:Ambulance,    color:'text-emerald-600 bg-emerald-50 border-emerald-200' },
  { label:'Menuju TKP',         time:'14:49:12', done:false, active:true,  icon:Navigation,   color:'text-blue-600 bg-blue-50 border-blue-200' },
  { label:'Tiba di Lokasi',     time:'—',        done:false, active:false, icon:CheckCircle,  color:'text-slate-400 bg-slate-50 border-slate-200' },
  { label:'Kasus Selesai',      time:'—',        done:false, active:false, icon:CheckCircle,  color:'text-slate-400 bg-slate-50 border-slate-200' },
];

const PIN_MAP = {
  victim:   {bg:'bg-red-500',   pulse:true },
  relawan:  {bg:'bg-emerald-500', pulse:false},
  ambulans: {bg:'bg-blue-500',    pulse:false},
};

export default function DetailKasusPage({ kasusId, onBack }) {
  const kasus = sosCases.find(c => c.id === kasusId) || sosCases[0];
  const relawan = volunteers[0];

  return (
    <div className="p-6 space-y-5">
      {/* Emergency banner */}
      <div className={`rounded-xl p-4 flex items-center justify-between flex-wrap gap-4 ${kasus.type === 'darurat' ? 'bg-red-600' : 'bg-blue-600'}`}>
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 text-white flex items-center justify-center cursor-pointer transition-all">
            <ArrowLeft size={16} />
          </button>
          <div className="flex items-center gap-2">
            {kasus.type === 'darurat' && (
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
              </span>
            )}
            <div>
              <p className="text-white/70 text-[10px] font-semibold uppercase tracking-widest">
                {kasus.type === 'darurat' ? 'PANGGILAN DARURAT SOS' : 'LAPORAN PENGGUNA'}
              </p>
              <h1 className="text-white font-extrabold text-base leading-tight">
                #{kasus.id} — {kasus.pelapor.nama} ({kasus.pelapor.disabilitas})
              </h1>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-all cursor-pointer">
            <CheckCircle size={13} /> Selesaikan Kasus
          </button>
          <button className="flex items-center gap-1.5 bg-white text-red-600 hover:bg-red-50 text-xs font-semibold px-3 py-2 rounded-lg transition-all cursor-pointer">
            <ShieldAlert size={13} /> Alihkan Polisi/Ambulans
          </button>
          <button className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-all cursor-pointer">
            <Printer size={13} /> Cetak Laporan
          </button>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-5">

        {/* LEFT: Info + Timeline */}
        <div className="space-y-4">

          {/* Pelapor card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <User size={15} className="text-slate-400" /> Profil Pelapor
            </h2>
            <div className="flex items-start gap-4">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white font-extrabold text-lg flex-shrink-0 shadow-md ${
                kasus.type === 'darurat' ? 'bg-gradient-to-br from-red-400 to-red-600' : 'bg-gradient-to-br from-blue-400 to-blue-600'
              }`}>
                {kasus.pelapor.nama.split(' ').map(w=>w[0]).join('').slice(0,2)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-extrabold text-slate-800">{kasus.pelapor.nama}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{kasus.pelapor.disabilitas}</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3">
                  {[
                    {label:'No. Telepon', value:kasus.pelapor.kontak},
                    {label:'Kontak Darurat', value:'+62 812-9999-0001'},
                    {label:'ID Pelapor', value:'USR-2291'},
                    {label:'Waktu Laporan', value:kasus.waktu},
                  ].map(item => (
                    <div key={item.label}>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{item.label}</p>
                      <p className="text-xs font-semibold text-slate-700 mt-0.5">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Location card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <MapPin size={15} className="text-slate-400" /> Lokasi Kejadian (TKP)
            </h2>
            <div className="bg-slate-50 rounded-xl border border-slate-100 p-3 mb-3">
              <p className="text-sm font-semibold text-slate-800">{kasus.lokasiFull}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                {label:'Latitude', value:`${kasus.koordinat.lat}`},
                {label:'Longitude', value:`${kasus.koordinat.lng}`},
                {label:'Kecamatan', value:'Setiabudi'},
                {label:'Kota', value:'Jakarta Selatan'},
              ].map(item => (
                <div key={item.label} className="bg-slate-50 rounded-lg p-2.5">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{item.label}</p>
                  <p className="text-xs font-bold text-slate-700 mt-0.5 font-mono">{item.value}</p>
                </div>
              ))}
            </div>
            <button className="mt-3 flex items-center gap-1.5 text-xs text-slate-500 hover:text-emerald-600 font-semibold transition-colors cursor-pointer">
              <Copy size={12} /> Salin Koordinat
            </button>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Clock size={15} className="text-slate-400" /> Timeline Penanganan
            </h2>
            <div className="relative pl-6">
              <div className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-slate-100"></div>
              <div className="space-y-4">
                {timelineSteps.map((step, idx) => {
                  const Icon = step.icon;
                  return (
                    <div key={idx} className="flex items-start gap-4 relative">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 -ml-6 relative z-10 bg-white ${step.done || step.active ? step.color.split(' ')[2] : 'border-slate-200'}`}>
                        {(step.done || step.active) ? (
                          <Icon size={10} className={step.done ? 'text-emerald-600' : 'text-blue-600'} />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-slate-200"></span>
                        )}
                      </div>
                      <div className={`flex-1 pb-1 ${!step.done && !step.active ? 'opacity-40' : ''}`}>
                        <div className="flex items-center justify-between">
                          <p className={`text-sm font-semibold ${step.active ? 'text-blue-600' : step.done ? 'text-slate-800' : 'text-slate-400'}`}>
                            {step.label}
                            {step.active && <span className="ml-2 text-[10px] font-bold bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full animate-pulse">Sedang berlangsung</span>}
                          </p>
                          <span className="text-xs text-slate-400 font-mono">{step.time}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Admin notes */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <MessageSquare size={15} className="text-slate-400" /> Catatan Operator Admin
            </h2>
            <textarea
              rows={3}
              placeholder="Tambahkan catatan operasional di sini..."
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all resize-none"
            />
            <button className="mt-2 flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all cursor-pointer">
              Simpan Catatan
            </button>
          </div>
        </div>

        {/* RIGHT: Mini map + Assigned team */}
        <div className="space-y-4">

          {/* Mini map */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800">Peta Live — Rute Relawan ke TKP</h3>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span></span>
                Live
              </span>
            </div>
            <div className="relative h-56 bg-[#dce9f5] overflow-hidden">
              <svg className="absolute inset-0 w-full h-full opacity-25" xmlns="http://www.w3.org/2000/svg">
                <line x1="0" y1="45%" x2="100%" y2="48%" stroke="#64748b" strokeWidth="2.5"/>
                <line x1="0" y1="65%" x2="100%" y2="62%" stroke="#64748b" strokeWidth="1.5"/>
                <line x1="40%" y1="0" x2="42%" y2="100%" stroke="#64748b" strokeWidth="2.5"/>
                <line x1="65%" y1="0" x2="66%" y2="100%" stroke="#64748b" strokeWidth="1.5"/>
              </svg>
              {/* Route line */}
              <svg className="absolute inset-0 w-full h-full">
                <line x1="30%" y1="35%" x2="58%" y2="55%" stroke="#10b981" strokeWidth="2.5" strokeDasharray="6,3" />
                <line x1="58%" y1="55%" x2="75%" y2="50%" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,3" />
              </svg>
              {/* Victim pin */}
              <div className="absolute" style={{left:'75%',top:'46%'}} >
                <div className="relative flex flex-col items-center -translate-x-1/2 -translate-y-full group">
                  <div className="absolute bottom-full mb-1 whitespace-nowrap bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">Korban — {kasus.pelapor.nama}</div>
                  <span className="absolute -top-1.5 -left-1.5 w-7 h-7 rounded-full bg-red-400 opacity-30 animate-ping"></span>
                  <div className="w-5 h-5 rounded-full bg-red-500 border-2 border-white shadow-lg relative z-10"></div>
                  <div className="w-0.5 h-2 bg-red-500 opacity-70"></div>
                </div>
              </div>
              {/* Relawan pin */}
              <div className="absolute" style={{left:'30%',top:'35%'}}>
                <div className="relative flex flex-col items-center -translate-x-1/2 -translate-y-full group">
                  <div className="absolute bottom-full mb-1 whitespace-nowrap bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">Relawan — {relawan.nama}</div>
                  <div className="w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-md relative z-10"></div>
                  <div className="w-0.5 h-2 bg-emerald-500 opacity-70"></div>
                </div>
              </div>
              {/* Ambulans pin */}
              <div className="absolute" style={{left:'58%',top:'55%'}}>
                <div className="relative flex flex-col items-center -translate-x-1/2 -translate-y-full group">
                  <div className="absolute bottom-full mb-1 whitespace-nowrap bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">Ambulans TBI</div>
                  <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-md relative z-10"></div>
                  <div className="w-0.5 h-2 bg-blue-500 opacity-70"></div>
                </div>
              </div>
              {/* Labels */}
              <span className="absolute text-[9px] text-slate-400 font-medium" style={{left:'5%',top:'8%'}}>Sudirman</span>
              <span className="absolute text-[9px] text-slate-400 font-medium" style={{left:'65%',top:'70%'}}>Setiabudi</span>
            </div>
            {/* Map legend */}
            <div className="px-4 py-2.5 bg-slate-50 flex items-center gap-4">
              {[{color:'bg-red-500',label:'Korban'},{color:'bg-emerald-500',label:'Relawan'},{color:'bg-blue-500',label:'Ambulans'}].map(l => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${l.color}`}></div>
                  <span className="text-[10px] text-slate-500 font-medium">{l.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Assigned relawan card */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h3 className="text-sm font-bold text-slate-800 mb-3">Relawan & Tim Medis Ditugaskan</h3>
            <div className="space-y-3">
              {/* Relawan */}
              <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow">
                  {kasus.relawan.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800">{kasus.relawan.nama}</p>
                  <p className="text-xs text-emerald-600 font-semibold">{kasus.relawan.badge}</p>
                  <p className="text-xs text-slate-400">{relawan.kontak}</p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <button className="flex items-center gap-1 bg-[#062c26] text-white text-[11px] font-semibold px-2.5 py-1.5 rounded-lg cursor-pointer hover:bg-emerald-800 transition-all">
                    <Phone size={10} /> Hubungi
                  </button>
                  <button className="flex items-center gap-1 bg-slate-100 text-slate-700 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg cursor-pointer hover:bg-slate-200 transition-all">
                    <MessageSquare size={10} /> Chat
                  </button>
                </div>
              </div>
              {/* Ambulans */}
              {kasus.ambulans && (
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white flex-shrink-0 shadow">
                    <Ambulance size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800">Tim Ambulans TBI</p>
                    <p className="text-xs text-blue-600 font-semibold">{kasus.ambulans}</p>
                    <p className="text-xs text-slate-400">+62 21-5555-0119</p>
                  </div>
                  <button className="flex items-center gap-1 bg-blue-600 text-white text-[11px] font-semibold px-2.5 py-1.5 rounded-lg cursor-pointer hover:bg-blue-700 transition-all">
                    <Phone size={10} /> Hubungi
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quick stats */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h3 className="text-sm font-bold text-slate-800 mb-3">Ringkasan Kasus</h3>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                {label:'Status Kini', value:kasus.status, color:'text-blue-600'},
                {label:'Durasi', value:'8 menit berjalan', color:'text-slate-700'},
                {label:'ETA Relawan', value:relawan.eta, color:'text-emerald-600'},
                {label:'Jarak TKP', value:relawan.jarak, color:'text-slate-700'},
              ].map(item => (
                <div key={item.label} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{item.label}</p>
                  <p className={`text-sm font-bold mt-0.5 ${item.color}`}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
