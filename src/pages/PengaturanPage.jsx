import { useState } from 'react';
import {
  User, Bell, AlertTriangle, Users, MapPin, Server, Shield,
  Save, Sliders, CheckCircle, Radio
} from 'lucide-react';

const settingsNav = [
  { id: 'profil',     label: 'Profil Admin',     icon: User },
  { id: 'notifikasi', label: 'Notifikasi',        icon: Bell },
  { id: 'sos',        label: 'SOS & Emergency',  icon: AlertTriangle },
  { id: 'relawan',    label: 'Relawan',          icon: Users },
  { id: 'peta',       label: 'Peta & Lokasi',    icon: MapPin },
  { id: 'sistem',     label: 'Sistem',           icon: Server },
  { id: 'keamanan',   label: 'Keamanan',         icon: Shield },
];

export default function PengaturanPage() {
  const [activeTab, setActiveTab] = useState('profil');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form states
  const [adminName, setAdminName] = useState('Dimas Wibisono');
  const [adminEmail, setAdminEmail] = useState('superadmin@sahabatsos.id');
  const [adminPhone, setAdminPhone] = useState('+62 812-8888-2026');
  const [sosRadius, setSosRadius] = useState(5);
  const [autoDispatch, setAutoDispatch] = useState(true);
  const [soundAlert, setSoundAlert] = useState(true);
  const [autoSms, setAutoSms] = useState(true);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1680px] w-full mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-black text-slate-900 tracking-tight leading-tight">
            Pengaturan Sistem
          </h1>
          <p className="text-[14px] text-slate-500 mt-1 font-medium">
            Kelola preferensi akun, parameter respon otomatis, notifikasi, dan keamanan sistem.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 bg-[#f0fdf4] border border-green-200 text-[#16a34a] px-3.5 py-1.5 rounded-xl text-[12px] font-bold animate-fade-in">
            <CheckCircle size={14} />
            <span>Perubahan berhasil disimpan!</span>
          </div>
        )}
      </div>

      {/* Main Split Layout: Left Navigation + Right Content */}
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 items-start">
        {/* Left: Settings Navigation Card */}
        <div className="bg-white border border-[#eaedf1] rounded-2xl p-3 shadow-xs space-y-1">
          {settingsNav.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-bold transition-all cursor-pointer text-left ${
                  isActive
                    ? 'bg-[#0a271f] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-[#34d399]' : 'text-slate-400'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Settings Content Cards */}
        <div className="space-y-6">
          <form onSubmit={handleSave} className="space-y-6">
            {/* Profil Admin */}
            {activeTab === 'profil' && (
              <div className="bg-white border border-[#eaedf1] rounded-2xl p-6 shadow-xs space-y-5">
                <div className="border-b border-[#f1f5f9] pb-4">
                  <h2 className="text-[16px] font-bold text-slate-900">Profil Administrator</h2>
                  <p className="text-[12px] text-slate-400 mt-0.5">Informasi akun penanggung jawab sistem pusat.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Nama Lengkap</label>
                    <input
                      type="text"
                      value={adminName}
                      onChange={e => setAdminName(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label className="form-label">Alamat Email</label>
                    <input
                      type="email"
                      value={adminEmail}
                      onChange={e => setAdminEmail(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label className="form-label">Nomor Telepon Darurat</label>
                    <input
                      type="text"
                      value={adminPhone}
                      onChange={e => setAdminPhone(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label className="form-label">Role Akses</label>
                    <input
                      type="text"
                      value="Super Admin (Level 1)"
                      disabled
                      className="form-input bg-slate-50 text-slate-500 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SOS & Emergency */}
            {(activeTab === 'sos' || activeTab === 'profil') && (
              <div className="bg-white border border-[#eaedf1] rounded-2xl p-6 shadow-xs space-y-5">
                <div className="border-b border-[#f1f5f9] pb-4">
                  <h2 className="text-[16px] font-bold text-slate-900">Parameter Respon SOS & Darurat</h2>
                  <p className="text-[12px] text-slate-400 mt-0.5">Pengaturan algoritma penugasan otomatis dan batas radius responder.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[13px] font-bold text-slate-700">Radius Pencarian Relawan</label>
                      <span className="text-[12px] font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg">
                        {sosRadius} km
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="15"
                      value={sosRadius}
                      onChange={e => setSosRadius(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#059669]"
                    />
                    <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                      <span>1 km (Sangat Dekat)</span>
                      <span>15 km (Cakupan Metropolitan)</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-[13px] font-bold text-slate-800">Auto-Dispatch Relawan Terdekat</p>
                      <p className="text-[12px] text-slate-400">Secara instan kirim sinyal ke 3 relawan paling dekat tanpa menunggu konfirmasi manual operator.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={autoDispatch}
                      onChange={e => setAutoDispatch(e.target.checked)}
                      className="w-5 h-5 accent-[#059669] cursor-pointer"
                    />
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-[13px] font-bold text-slate-800">Sirene Audio Otomatis di Browser</p>
                      <p className="text-[12px] text-slate-400">Putar suara sirine darurat saat kasus baru berprioritas tinggi masuk.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={soundAlert}
                      onChange={e => setSoundAlert(e.target.checked)}
                      className="w-5 h-5 accent-[#059669] cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Notifikasi */}
            {activeTab === 'notifikasi' && (
              <div className="bg-white border border-[#eaedf1] rounded-2xl p-6 shadow-xs space-y-4">
                <div className="border-b border-[#f1f5f9] pb-4">
                  <h2 className="text-[16px] font-bold text-slate-900">Pengaturan Notifikasi</h2>
                  <p className="text-[12px] text-slate-400 mt-0.5">Konfigurasi jalur komunikasi peringatan dini.</p>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-[13px] font-bold text-slate-800">SMS Gateway Darurat</p>
                    <p className="text-[12px] text-slate-400">Kirim SMS cadangan jika koneksi internet pengguna terputus.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoSms}
                    onChange={e => setAutoSms(e.target.checked)}
                    className="w-5 h-5 accent-[#059669] cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                className="btn-base btn-secondary"
                onClick={() => alert('Perubahan dibatalkan')}
              >
                Batal
              </button>
              <button
                type="submit"
                className="btn-base btn-primary text-[13px] h-10 px-6"
              >
                <Save size={14} />
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
