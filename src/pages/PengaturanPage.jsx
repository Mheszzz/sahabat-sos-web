import { useState } from 'react';
import {
  Settings, Radio, Accessibility, Wifi, Users,
  Save, ToggleLeft, ToggleRight, Sliders, ShieldCheck,
  Edit2, Trash2, Plus, CheckCircle, AlertCircle, Server
} from 'lucide-react';

const subTabs = [
  { id:'umum',      label:'Umum & Respon Otomatis',           icon: Settings },
  { id:'akses',     label:'Aksesibilitas & Format Media',       icon: Accessibility },
  { id:'hardware',  label:'Jaringan Gateway & Hardware SOS',    icon: Radio },
  { id:'admin',     label:'Manajemen Admin & Relawan',          icon: Users },
];

function Toggle({ enabled, onToggle, label, desc }) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-slate-100 last:border-0">
      <div>
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        {desc && <p className="text-xs text-slate-400 mt-0.5">{desc}</p>}
      </div>
      <button onClick={onToggle} className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer flex-shrink-0 ${enabled ? 'bg-emerald-500' : 'bg-slate-200'}`}>
        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${enabled ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
      </button>
    </div>
  );
}

const adminUsers = [
  { id:'ADM-001', nama:'Dimas Wibisono', email:'dimas@sahabatsos.id', role:'Super Admin', status:'Aktif', lastLogin:'07 Sep 2026, 14:30' },
  { id:'ADM-002', nama:'Sari Kusuma',    email:'sari@sahabatsos.id',   role:'Admin',       status:'Aktif', lastLogin:'07 Sep 2026, 11:15' },
  { id:'ADM-003', nama:'Budi Hartono',   email:'budi@sahabatsos.id',   role:'Operator',    status:'Aktif', lastLogin:'06 Sep 2026, 22:10' },
  { id:'ADM-004', nama:'Rini Astuti',    email:'rini@sahabatsos.id',   role:'Operator',    status:'Nonaktif', lastLogin:'01 Sep 2026, 08:45' },
];

const roleStyles = {
  'Super Admin': 'bg-violet-100 text-violet-700',
  'Admin':       'bg-blue-100 text-blue-700',
  'Operator':    'bg-amber-100 text-amber-700',
};

export default function PengaturanPage() {
  const [activeTab, setActiveTab] = useState('umum');
  const [radius, setRadius] = useState(5);
  const [autoAssign, setAutoAssign] = useState(true);
  const [sirenTime, setSirenTime] = useState(3);
  const [tts, setTts] = useState(true);
  const [iconMode, setIconMode] = useState(false);
  const [translate, setTranslate] = useState(true);

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-800">Pengaturan & Konfigurasi Sistem</h1>
        <p className="text-sm text-slate-400 mt-0.5">Kelola parameter operasional, aksesibilitas, hardware, dan akses admin</p>
      </div>

      {/* Sub-tab navigation */}
      <div className="bg-white rounded-xl border border-slate-200 p-1.5 flex items-center gap-1 flex-wrap">
        {subTabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer flex-1 justify-center ${
                activeTab === tab.id ? 'bg-[#062c26] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              <Icon size={15} />
              <span className="hidden md:inline whitespace-nowrap">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab: Umum */}
      {activeTab === 'umum' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Card 1 */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center"><Sliders size={16} className="text-emerald-600" /></div>
              <h2 className="text-sm font-bold text-slate-800">Parameter Respon & Penugasan Otomatis</h2>
            </div>
            {/* Radius slider */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-slate-700">Radius Pencarian Relawan Terdekat</label>
                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">{radius} km</span>
              </div>
              <input
                type="range" min={1} max={10} step={0.5} value={radius}
                onChange={e => setRadius(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1"><span>1 km</span><span>10 km</span></div>
            </div>
            <Toggle enabled={autoAssign} onToggle={() => setAutoAssign(p=>!p)} label="Auto-assign Volunteer Otomatis" desc="Sistem otomatis menugaskan relawan terdekat saat SOS diterima" />
            {/* Sirine time */}
            <div className="flex items-center justify-between pt-3.5">
              <div>
                <p className="text-sm font-semibold text-slate-800">Ambang Waktu Peringatan Sirine</p>
                <p className="text-xs text-slate-400 mt-0.5">Sirine aktif jika SOS tidak direspons dalam waktu ini</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number" min={1} max={30} value={sirenTime}
                  onChange={e => setSirenTime(parseInt(e.target.value))}
                  className="w-16 text-center border border-slate-200 rounded-lg text-sm font-bold text-slate-800 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
                <span className="text-xs text-slate-400">menit</span>
              </div>
            </div>
            <button className="mt-5 w-full flex items-center justify-center gap-2 bg-[#062c26] hover:bg-emerald-900 text-white text-sm font-semibold py-2.5 rounded-xl transition-all cursor-pointer">
              <Save size={15} /> Simpan Pengaturan Respon
            </button>
          </div>

          {/* Card info */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center"><ShieldCheck size={16} className="text-blue-600" /></div>
              <h2 className="text-sm font-bold text-slate-800">Ringkasan Konfigurasi Aktif</h2>
            </div>
            <div className="space-y-3">
              {[
                { label:'Mode Operasi', value:'Siaga Penuh 24/7', ok:true },
                { label:'Radius Aktif', value:`${radius} km dari titik SOS`, ok:true },
                { label:'Auto-assign', value:autoAssign ? 'Aktif' : 'Nonaktif', ok:autoAssign },
                { label:'Waktu Sirine', value:`${sirenTime} menit setelah SOS`, ok:true },
                { label:'Socket.io Server', value:'Terhubung — ws://localhost:3001', ok:true },
                { label:'Backup API', value:'Aktif — REST Fallback Mode', ok:true },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
                  <span className="text-xs text-slate-500">{item.label}</span>
                  <div className="flex items-center gap-1.5">
                    {item.ok ? <CheckCircle size={13} className="text-emerald-500" /> : <AlertCircle size={13} className="text-amber-500" />}
                    <span className={`text-xs font-semibold ${item.ok ? 'text-slate-700' : 'text-amber-600'}`}>{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Aksesibilitas */}
      {activeTab === 'akses' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center"><Accessibility size={16} className="text-violet-600" /></div>
            <h2 className="text-sm font-bold text-slate-800">Fitur Aksesibilitas & Komunikasi Difabel</h2>
          </div>
          <Toggle enabled={tts} onToggle={() => setTts(p=>!p)} label="Modul Teks-ke-Suara (TTS)" desc="Konversi notifikasi teks ke audio untuk pengguna tunanetra" />
          <Toggle enabled={iconMode} onToggle={() => setIconMode(p=>!p)} label="Simbol / Icon Mode Sederhana (Tunanetra)" desc="Ganti elemen teks dengan simbol visual kontras tinggi" />
          <Toggle enabled={translate} onToggle={() => setTranslate(p=>!p)} label="Auto-translate Bahasa Isyarat Video Call" desc="Aktifkan overlay interpretasi BISINDO/SIBI pada video call darurat" />
          <div className="mt-5 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-xs text-blue-700 font-semibold mb-1">Panduan Aksesibilitas WCAG 2.1 AA</p>
            <p className="text-xs text-blue-600">Semua fitur UI telah dikalibrasi memenuhi standar kontras minimum 4.5:1 dan target sentuh 44x44px untuk pengguna difabel motorik.</p>
          </div>
          <button className="mt-4 flex items-center gap-2 bg-[#062c26] hover:bg-emerald-900 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all cursor-pointer">
            <Save size={15} /> Simpan Pengaturan Aksesibilitas
          </button>
        </div>
      )}

      {/* Tab: Hardware */}
      {activeTab === 'hardware' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center"><Server size={16} className="text-amber-600" /></div>
              <h2 className="text-sm font-bold text-slate-800">Status Koneksi Server & Gateway</h2>
            </div>
            <div className="space-y-3">
              {[
                { label:'Socket.io Server', host:'ws://api.sahabatsos.id:3001', status:'Connected', ok:true },
                { label:'REST API Backend', host:'https://api.sahabatsos.id/v2', status:'Online', ok:true },
                { label:'GIS / Map Service', host:'tiles.openstreetmap.org', status:'Standby', ok:false },
                { label:'Gateway IoT SOS-01', host:'192.168.1.105 (MQTT)', status:'Connected', ok:true },
                { label:'Gateway IoT SOS-02', host:'192.168.1.106 (MQTT)', status:'Offline', ok:false },
                { label:'Ambulans Tracker', host:'gps.sahabatsos.id/live', status:'Online', ok:true },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${item.ok ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                    <div>
                      <p className="text-xs font-semibold text-slate-800">{item.label}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{item.host}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.ok ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center"><Radio size={16} className="text-red-500" /></div>
              <h2 className="text-sm font-bold text-slate-800">Konfigurasi Tombol Fisik SOS IoT</h2>
            </div>
            <div className="space-y-3">
              {[
                { id:'IoT-001', lokasi:'Halte Transjakarta Dukuh Atas', baterai:87, status:'Online' },
                { id:'IoT-002', lokasi:'Stasiun MRT Blok M', baterai:62, status:'Online' },
                { id:'IoT-003', lokasi:'Bandara Soetta Terminal 2', baterai:34, status:'Low Battery' },
                { id:'IoT-004', lokasi:'Plaza Indonesia Lantai B1', baterai:0, status:'Offline' },
              ].map(d => (
                <div key={d.id} className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-600 font-mono">{d.id}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        d.status === 'Online' ? 'bg-emerald-100 text-emerald-700' :
                        d.status === 'Low Battery' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                      }`}>{d.status}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-700">{d.baterai}%</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-1.5">{d.lokasi}</p>
                  <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${d.baterai > 50 ? 'bg-emerald-500' : d.baterai > 20 ? 'bg-amber-500' : 'bg-red-500'}`} style={{width:`${d.baterai}%`}} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Admin */}
      {activeTab === 'admin' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center"><Users size={16} className="text-blue-600" /></div>
              <h2 className="text-sm font-bold text-slate-800">Pengelola Admin & Hak Akses</h2>
            </div>
            <button className="flex items-center gap-1.5 bg-[#062c26] hover:bg-emerald-900 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-all cursor-pointer">
              <Plus size={13} /> Tambah Admin
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {['ID','NAMA & EMAIL','ROLE','STATUS','LOGIN TERAKHIR','AKSI'].map(h => (
                    <th key={h} className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {adminUsers.map((u,idx) => (
                  <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 align-middle"><span className="text-xs font-bold text-slate-500 font-mono">{u.id}</span></td>
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${['from-violet-400 to-purple-600','from-blue-400 to-blue-600','from-amber-400 to-orange-500','from-slate-400 to-slate-600'][idx]} flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0`}>
                          {u.nama.split(' ').map(w=>w[0]).join('').slice(0,2)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{u.nama}</p>
                          <p className="text-xs text-slate-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${roleStyles[u.role]}`}>{u.role}</span>
                    </td>
                    <td className="p-4 align-middle">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${u.status === 'Aktif' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'Aktif' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                        {u.status}
                      </span>
                    </td>
                    <td className="p-4 align-middle"><span className="text-xs text-slate-500">{u.lastLogin}</span></td>
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-1.5">
                        <button className="flex items-center gap-1 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-all cursor-pointer">
                          <Edit2 size={11} /> Edit
                        </button>
                        <button className="flex items-center gap-1 border border-red-200 hover:bg-red-50 text-red-500 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-all cursor-pointer">
                          <Trash2 size={11} /> Cabut
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
