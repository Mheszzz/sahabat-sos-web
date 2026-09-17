import { useState, useEffect } from 'react';
import {
  User, Bell, AlertTriangle, Users, MapPin, Server, Shield,
  Save, CheckCircle, Database, Plus, Trash2, Edit2
} from 'lucide-react';
import { masterDataService } from '../services/masterDataService';

const settingsNav = [
  { id: 'profil', label: 'Profil Admin', icon: User },
  { id: 'notifikasi', label: 'Notifikasi', icon: Bell },
  { id: 'sos', label: 'SOS & Emergency', icon: AlertTriangle },
  { id: 'relawan', label: 'Relawan', icon: Users },
  { id: 'master_data', label: 'Master Data Laporan', icon: Database },
  { id: 'peta', label: 'Peta & Lokasi', icon: MapPin },
  { id: 'sistem', label: 'Sistem', icon: Server },
  { id: 'keamanan', label: 'Keamanan', icon: Shield },
];

export default function PengaturanPage() {
  const [activeTab, setActiveTab] = useState('profil');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [adminName, setAdminName] = useState('Dimas Wibisono');
  const [adminEmail, setAdminEmail] = useState('superadmin@sahabatsos.id');
  const [adminPhone, setAdminPhone] = useState('+62 812-8888-2026');
  const [sosRadius, setSosRadius] = useState(5);
  const [autoDispatch, setAutoDispatch] = useState(true);
  const [soundAlert, setSoundAlert] = useState(true);
  const [autoSms, setAutoSms] = useState(true);

  // Master Data state
  const [kategoriList, setKategoriList] = useState([]);
  const [pesanCepatList, setPesanCepatList] = useState([]);
  const [newKategori, setNewKategori] = useState('');
  const [newPesan, setNewPesan] = useState('');

  const fetchMasterData = async () => {
    try {
      const resKat = await masterDataService.getKategori();
      if (resKat && resKat.data) setKategoriList(resKat.data);
      const resPes = await masterDataService.getPesanCepat();
      if (resPes && resPes.data) setPesanCepatList(resPes.data);
    } catch (error) {
      console.error('Gagal mengambil master data:', error);
    }
  };

  useEffect(() => {
    if (activeTab === 'master_data') {
      fetchMasterData();
    }
  }, [activeTab]);

  const handleAddKategori = async (e) => {
    e.preventDefault();
    if(!newKategori) return;
    try {
      await masterDataService.createKategori({ nama: newKategori });
      setNewKategori('');
      fetchMasterData();
    } catch (error) { console.error(error); }
  };

  const handleDeleteKategori = async (id) => {
    if(!window.confirm('Hapus kategori ini?')) return;
    try {
      await masterDataService.deleteKategori(id);
      fetchMasterData();
    } catch (error) { console.error(error); }
  };

  const handleAddPesan = async (e) => {
    e.preventDefault();
    if(!newPesan) return;
    try {
      await masterDataService.createPesanCepat({ pesan: newPesan });
      setNewPesan('');
      fetchMasterData();
    } catch (error) { console.error(error); }
  };

  const handleDeletePesan = async (id) => {
    if(!window.confirm('Hapus pesan cepat ini?')) return;
    try {
      await masterDataService.deletePesanCepat(id);
      fetchMasterData();
    } catch (error) { console.error(error); }
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="page-shell space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-[24px] font-extrabold tracking-[-0.04em] text-slate-900">Pengaturan Sistem</h1>
          <p className="mt-1 text-[14px] font-medium text-slate-500">
            Kelola preferensi akun, parameter respon otomatis, notifikasi, dan keamanan sistem.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 rounded-xl border border-[#bbf7d0] bg-[#ecfdf5] px-3.5 py-2 text-[12px] font-bold text-[#15803d]">
            <CheckCircle size={14} />
            <span>Perubahan berhasil disimpan!</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
        <div className="rounded-[22px] border border-[#e2e8f0] bg-white p-3 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
          <div className="space-y-1.5">
            {settingsNav.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-bold transition-all ${isActive ? 'bg-[#0a271f] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  <Icon size={16} className={isActive ? 'text-[#7ae7c3]' : 'text-slate-400'} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <form onSubmit={handleSave} className="space-y-6">
            {activeTab === 'profil' && (
              <div className="rounded-[22px] border border-[#e2e8f0] bg-white p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
                <div className="border-b border-[#f1f5f9] pb-4">
                  <h2 className="text-[16px] font-bold text-slate-900">Profil Administrator</h2>
                  <p className="mt-1 text-[12px] text-slate-400">Informasi akun penanggung jawab sistem pusat.</p>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="min-w-0">
                    <label className="form-label break-words">Nama Lengkap</label>
                    <input type="text" value={adminName} onChange={e => setAdminName(e.target.value)} className="form-input" />
                  </div>

                  <div className="min-w-0">
                    <label className="form-label break-words">Alamat Email</label>
                    <input type="email" value={adminEmail} onChange={e => setAdminEmail(e.target.value)} className="form-input" />
                  </div>

                  <div className="min-w-0">
                    <label className="form-label break-words">Nomor Telepon Darurat</label>
                    <input type="text" value={adminPhone} onChange={e => setAdminPhone(e.target.value)} className="form-input" />
                  </div>

                  <div className="min-w-0">
                    <label className="form-label break-words">Role Akses</label>
                    <input type="text" value="Super Admin (Level 1)" disabled className="form-input cursor-not-allowed bg-slate-50 text-slate-500" />
                  </div>
                </div>
              </div>
            )}

            {(activeTab === 'sos' || activeTab === 'profil') && (
              <div className="rounded-[22px] border border-[#e2e8f0] bg-white p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
                <div className="border-b border-[#f1f5f9] pb-4">
                  <h2 className="text-[16px] font-bold text-slate-900">Parameter Respon SOS & Darurat</h2>
                  <p className="mt-1 text-[12px] text-slate-400">Pengaturan algoritma penugasan otomatis dan batas radius responder.</p>
                </div>

                <div className="mt-5 space-y-5">
                  <div className="min-w-0">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <label className="text-[13px] font-bold text-slate-700 break-words">Radius Pencarian Relawan</label>
                      <span className="rounded-lg bg-[#ecfdf5] px-2.5 py-1 text-[12px] font-black text-[#0f766e]">{sosRadius} km</span>
                    </div>

                    <input
                      type="range"
                      min="1"
                      max="15"
                      value={sosRadius}
                      onChange={e => setSosRadius(Number(e.target.value))}
                      className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[#d5eee8] accent-[#0a271f]"
                    />

                    <div className="mt-2 flex justify-between text-[11px] text-slate-400">
                      <span>1 km</span>
                      <span>15 km</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-4 min-w-0">
                    <div className="min-w-0 pr-3">
                      <p className="text-[13px] font-bold text-slate-800 break-words">Auto-Dispatch Relawan Terdekat</p>
                      <p className="mt-1 text-[12px] text-slate-400 break-words">Kirim sinyal otomatis ke 3 relawan paling dekat tanpa menunggu konfirmasi manual.</p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center flex-shrink-0">
                      <input type="checkbox" checked={autoDispatch} onChange={e => setAutoDispatch(e.target.checked)} className="sr-only peer" />
                      <div className="h-6 w-11 rounded-full bg-slate-200 peer-checked:bg-[#0a271f] transition-colors" />
                      <div className="absolute left-1 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-5" />
                    </label>
                  </div>

                  <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-4 min-w-0">
                    <div className="min-w-0 pr-3">
                      <p className="text-[13px] font-bold text-slate-800 break-words">Sirene Audio Otomatis di Browser</p>
                      <p className="mt-1 text-[12px] text-slate-400 break-words">Putar suara sirine darurat saat kasus baru berprioritas tinggi masuk.</p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center flex-shrink-0">
                      <input type="checkbox" checked={soundAlert} onChange={e => setSoundAlert(e.target.checked)} className="sr-only peer" />
                      <div className="h-6 w-11 rounded-full bg-slate-200 peer-checked:bg-[#0a271f] transition-colors" />
                      <div className="absolute left-1 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-5" />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifikasi' && (
              <div className="rounded-[22px] border border-[#e2e8f0] bg-white p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
                <div className="border-b border-[#f1f5f9] pb-4">
                  <h2 className="text-[16px] font-bold text-slate-900">Pengaturan Notifikasi</h2>
                  <p className="mt-1 text-[12px] text-slate-400">Konfigurasi jalur komunikasi peringatan dini.</p>
                </div>

                <div className="mt-5 flex items-center justify-between gap-4 min-w-0">
                  <div className="min-w-0 pr-3">
                    <p className="text-[13px] font-bold text-slate-800 break-words">SMS Gateway Darurat</p>
                    <p className="mt-1 text-[12px] text-slate-400 break-words">Kirim SMS cadangan jika koneksi internet pengguna terputus.</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center flex-shrink-0">
                    <input type="checkbox" checked={autoSms} onChange={e => setAutoSms(e.target.checked)} className="sr-only peer" />
                    <div className="h-6 w-11 rounded-full bg-slate-200 peer-checked:bg-[#0a271f] transition-colors" />
                    <div className="absolute left-1 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-5" />
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'master_data' && (
              <div className="space-y-6">
                {/* Kategori Laporan */}
                <div className="rounded-[22px] border border-[#e2e8f0] bg-white p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
                  <div className="border-b border-[#f1f5f9] pb-4 mb-4">
                    <h2 className="text-[16px] font-bold text-slate-900">Kategori Laporan Darurat</h2>
                    <p className="mt-1 text-[12px] text-slate-400">Kelola jenis-jenis keadaan darurat yang bisa dipilih oleh pengguna.</p>
                  </div>
                  
                  <form onSubmit={handleAddKategori} className="flex gap-2 mb-4">
                    <input 
                      type="text" 
                      value={newKategori} 
                      onChange={e => setNewKategori(e.target.value)} 
                      placeholder="Tambah Kategori Baru..." 
                      className="form-input flex-1"
                    />
                    <button type="submit" className="btn-base btn-primary px-4">
                      <Plus size={15} /> Tambah
                    </button>
                  </form>

                  <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2">
                    {kategoriList.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl bg-slate-50">
                        <span className="text-[13px] font-bold text-slate-700">{item.nama}</span>
                        <button type="button" onClick={() => handleDeleteKategori(item.id)} className="text-red-500 hover:text-red-700 p-1">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                    {kategoriList.length === 0 && (
                      <p className="text-center text-slate-400 text-[12px] py-4">Belum ada kategori.</p>
                    )}
                  </div>
                </div>

                {/* Pesan Cepat */}
                <div className="rounded-[22px] border border-[#e2e8f0] bg-white p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
                  <div className="border-b border-[#f1f5f9] pb-4 mb-4">
                    <h2 className="text-[16px] font-bold text-slate-900">Pesan Cepat (Quick Messages)</h2>
                    <p className="mt-1 text-[12px] text-slate-400">Pesan darurat instan yang dapat dikirim oleh pengguna hanya dengan 1 tap.</p>
                  </div>
                  
                  <form onSubmit={handleAddPesan} className="flex gap-2 mb-4">
                    <input 
                      type="text" 
                      value={newPesan} 
                      onChange={e => setNewPesan(e.target.value)} 
                      placeholder="Tambah Pesan Cepat Baru..." 
                      className="form-input flex-1"
                    />
                    <button type="submit" className="btn-base btn-primary px-4">
                      <Plus size={15} /> Tambah
                    </button>
                  </form>

                  <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2">
                    {pesanCepatList.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl bg-slate-50">
                        <span className="text-[13px] font-bold text-slate-700">{item.pesan}</span>
                        <button type="button" onClick={() => handleDeletePesan(item.id)} className="text-red-500 hover:text-red-700 p-1">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                    {pesanCepatList.length === 0 && (
                      <p className="text-center text-slate-400 text-[12px] py-4">Belum ada pesan cepat.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button type="button" className="btn-base btn-secondary">Batal</button>
              <button type="submit" className="btn-base btn-primary h-10 px-6">
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
