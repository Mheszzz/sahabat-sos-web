import { useState, useEffect } from 'react';
import {
  User, Bell, AlertTriangle, Users, MapPin, Server, Shield,
  Save, CheckCircle, Database, Plus, Trash2, Edit2, Phone, X
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { masterDataService } from '../services/masterDataService';

const settingsNav = [
  { id: 'profil',       label: 'Profil Admin',           icon: User },
  { id: 'notifikasi',   label: 'Notifikasi',             icon: Bell },
  { id: 'kontak',       label: 'Kontak Darurat',         icon: Phone },
  { id: 'sos',          label: 'SOS & Emergency',        icon: AlertTriangle },
  { id: 'master_data',  label: 'Master Data Laporan',    icon: Database },
  { id: 'peta',         label: 'Peta & Lokasi',          icon: MapPin },
  { id: 'sistem',       label: 'Sistem',                 icon: Server },
  { id: 'keamanan',     label: 'Keamanan',               icon: Shield },
];

function Toggle({ checked, onChange }) {
  return (
    <label className="toggle-wrap" style={{ cursor: 'pointer' }}>
      <input type="checkbox" checked={checked} onChange={onChange} />
      <div className="toggle-track">
        <div className="toggle-thumb" />
      </div>
    </label>
  );
}

function SettingRow({ title, desc, children }) {
  return (
    <div className="flex items-center justify-between gap-6 py-4" style={{ borderBottom: '1px solid var(--color-border-soft)' }}>
      <div className="min-w-0">
        <p style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--color-text)' }}>{title}</p>
        {desc && <p style={{ fontSize: 12.5, color: 'var(--color-text-muted)', marginTop: 3 }}>{desc}</p>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

function SectionPanel({ title, desc, children }) {
  return (
    <div className="card-base overflow-hidden">
      <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--color-border-soft)' }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text)' }}>{title}</h2>
        {desc && <p style={{ fontSize: 12.5, color: 'var(--color-text-muted)', marginTop: 4 }}>{desc}</p>}
      </div>
      <div className="px-6 pb-2">{children}</div>
    </div>
  );
}

export default function PengaturanPage() {
  const [activeTab, setActiveTab] = useState('profil');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Profil
  const [adminName,  setAdminName]  = useState('Dimas Wibisono');
  const [adminEmail, setAdminEmail] = useState('superadmin@sahabatsos.id');
  const [adminPhone, setAdminPhone] = useState('+62 812-8888-2026');

  // SOS Params
  const [sosRadius,    setSosRadius]    = useState(5);
  const [autoDispatch, setAutoDispatch] = useState(true);
  const [soundAlert,   setSoundAlert]   = useState(true);

  // Notifications
  const [autoSms, setAutoSms] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);

  // Master Data
  const [kategoriList,   setKategoriList]   = useState([]);
  const [pesanCepatList, setPesanCepatList] = useState([]);
  const [kontakList,     setKontakList]     = useState([]);
  const [newKategori, setNewKategori] = useState('');
  const [newPesan,    setNewPesan]    = useState('');
  
  // Form Kontak
  const [newKontakNama, setNewKontakNama] = useState('');
  const [newKontakNo,   setNewKontakNo]   = useState('');
  const [editingKontakId, setEditingKontakId] = useState(null);
  
  const [mdLoading, setMdLoading] = useState(false);

  const fetchMasterData = async () => {
    try {
      setMdLoading(true);
      const [resKat, resPes] = await Promise.all([
        masterDataService.getKategori(),
        masterDataService.getPesanCepat(),
      ]);
      if (resKat?.data) setKategoriList(resKat.data);
      if (resPes?.data) setPesanCepatList(resPes.data);
    } catch (err) {
      console.error('Gagal mengambil master data:', err);
    } finally {
      setMdLoading(false);
    }
  };

  const fetchKontak = async () => {
    try {
      setMdLoading(true);
      const res = await masterDataService.getKontakDarurat();
      if (res?.data) setKontakList(res.data);
    } catch (err) {
      console.error('Gagal mengambil kontak darurat:', err);
    } finally {
      setMdLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'master_data') fetchMasterData();
    if (activeTab === 'kontak') fetchKontak();
  }, [activeTab]);

  const handleAddKategori = async (e) => {
    e.preventDefault();
    if (!newKategori.trim()) return;
    try {
      await masterDataService.createKategori({ nama: newKategori });
      setNewKategori('');
      fetchMasterData();
    } catch (err) { console.error(err); }
  };

  const handleDeleteKategori = async (id) => {
    if (!window.confirm('Hapus kategori ini?')) return;
    try {
      await masterDataService.deleteKategori(id);
      fetchMasterData();
    } catch (err) { console.error(err); }
  };

  const handleAddPesan = async (e) => {
    e.preventDefault();
    if (!newPesan.trim()) return;
    try {
      await masterDataService.createPesanCepat({ pesan: newPesan });
      setNewPesan('');
      fetchMasterData();
    } catch (err) { console.error(err); }
  };

  const handleDeletePesan = async (id) => {
    if (!window.confirm('Hapus pesan cepat ini?')) return;
    try {
      await masterDataService.deletePesanCepat(id);
      fetchMasterData();
    } catch (err) { console.error(err); }
  };

  const handleSubmitKontak = async (e) => {
    e.preventDefault();
    if (!newKontakNama.trim() || !newKontakNo.trim()) return;
    
    try {
      if (editingKontakId) {
        await masterDataService.updateKontakDarurat(editingKontakId, {
          nama_instansi: newKontakNama,
          no_telepon: newKontakNo
        });
        setEditingKontakId(null);
      } else {
        await masterDataService.createKontakDarurat({
          nama_instansi: newKontakNama,
          no_telepon: newKontakNo
        });
      }
      setNewKontakNama('');
      setNewKontakNo('');
      fetchKontak();
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan kontak.');
    }
  };

  const handleDeleteKontak = async (id) => {
    if (!window.confirm('Hapus kontak darurat ini?')) return;
    try {
      await masterDataService.deleteKontakDarurat(id);
      fetchKontak();
    } catch (err) { console.error(err); }
  };

  const handleEditKontak = (k) => {
    setEditingKontakId(k.id);
    setNewKontakNama(k.nama_instansi || k.nama || '');
    setNewKontakNo(k.no_telepon || k.nomor || k.no_telp || '');
  };

  const cancelEditKontak = () => {
    setEditingKontakId(null);
    setNewKontakNama('');
    setNewKontakNo('');
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="page-shell space-y-5">
      <PageHeader
        title="Pengaturan Sistem"
        description="Kelola preferensi akun, parameter respons, notifikasi, dan keamanan sistem."
        actions={
          savedSuccess && (
            <div className="flex items-center gap-2 rounded-xl px-3 py-2" style={{ background: 'var(--color-success-light)', border: '1px solid var(--color-success-border)' }}>
              <CheckCircle size={14} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
              <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--color-success)' }}>Perubahan disimpan!</span>
            </div>
          )
        }
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[220px_1fr]">
        {/* Sidebar Nav */}
        <div className="card-base p-2">
          <div className="space-y-0.5">
            {settingsNav.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all cursor-pointer"
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    background: isActive ? 'var(--nav-bg)' : 'transparent',
                    color: isActive ? 'white' : 'var(--color-text-secondary)',
                    border: 'none',
                  }}
                >
                  <Icon size={15} style={{ color: isActive ? '#34D399' : 'var(--color-text-muted)', flexShrink: 0 }} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="space-y-5">

          {/* ── Profil ── */}
          {activeTab === 'profil' && (
            <SectionPanel title="Profil Administrator" desc="Informasi akun penanggung jawab sistem pusat.">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 pt-4 pb-2">
                <div>
                  <label className="form-label">Nama Lengkap</label>
                  <input type="text" value={adminName} onChange={e => setAdminName(e.target.value)} className="form-input" />
                </div>
                <div>
                  <label className="form-label">Alamat Email</label>
                  <input type="email" value={adminEmail} onChange={e => setAdminEmail(e.target.value)} className="form-input" />
                </div>
                <div>
                  <label className="form-label">Nomor Telepon Darurat</label>
                  <input type="text" value={adminPhone} onChange={e => setAdminPhone(e.target.value)} className="form-input" />
                </div>
                <div>
                  <label className="form-label">Role Akses</label>
                  <input type="text" value="Super Admin (Level 1)" disabled className="form-input" />
                </div>
              </div>
            </SectionPanel>
          )}

          {/* ── SOS ── */}
          {(activeTab === 'sos' || activeTab === 'profil') && (
            <SectionPanel title="Parameter Respons SOS & Darurat" desc="Konfigurasi algoritma penugasan otomatis dan radius responder.">
              <div className="pt-2 pb-2">
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <label style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--color-text)' }}>Radius Pencarian Relawan</label>
                    <span
                      className="rounded-lg px-2.5 py-1"
                      style={{ fontSize: 12, fontWeight: 700, background: 'var(--color-primary-soft)', color: 'var(--color-primary)' }}
                    >
                      {sosRadius} km
                    </span>
                  </div>
                  <input
                    type="range" min="1" max="15" value={sosRadius}
                    onChange={e => setSosRadius(Number(e.target.value))}
                    className="w-full h-2 cursor-pointer appearance-none rounded-full"
                    style={{ background: 'var(--color-border)', accentColor: 'var(--color-primary)' }}
                  />
                  <div className="flex justify-between mt-1">
                    <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>1 km</span>
                    <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>15 km</span>
                  </div>
                </div>
                <SettingRow title="Auto-Dispatch Relawan Terdekat" desc="Kirim sinyal otomatis ke 3 relawan paling dekat tanpa menunggu konfirmasi manual.">
                  <Toggle checked={autoDispatch} onChange={e => setAutoDispatch(e.target.checked)} />
                </SettingRow>
                <SettingRow title="Sirene Audio Otomatis" desc="Putar suara sirine saat kasus berprioritas tinggi masuk.">
                  <Toggle checked={soundAlert} onChange={e => setSoundAlert(e.target.checked)} />
                </SettingRow>
              </div>
            </SectionPanel>
          )}

          {/* ── Notifikasi ── */}
          {activeTab === 'notifikasi' && (
            <SectionPanel title="Pengaturan Notifikasi" desc="Konfigurasi jalur komunikasi peringatan dini.">
              <SettingRow title="SMS Gateway Darurat" desc="Kirim SMS cadangan jika koneksi internet terputus.">
                <Toggle checked={autoSms} onChange={e => setAutoSms(e.target.checked)} />
              </SettingRow>
              <SettingRow title="Push Notification Browser" desc="Notifikasi langsung di browser saat ada laporan baru.">
                <Toggle checked={pushNotif} onChange={e => setPushNotif(e.target.checked)} />
              </SettingRow>
            </SectionPanel>
          )}

          {/* ── Kontak Darurat ── */}
          {activeTab === 'kontak' && (
            <SectionPanel title="Daftar Kontak Darurat" desc="Kelola nomor telepon penting untuk eskalasi keadaan darurat (Polisi, RS, Pemadam).">
              <div className="pt-4 pb-2">
                <form onSubmit={handleSubmitKontak} className="flex gap-2 mb-6 items-end bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="flex-1">
                    <label className="form-label text-xs mb-1">Nama Instansi</label>
                    <input
                      type="text" value={newKontakNama}
                      onChange={e => setNewKontakNama(e.target.value)}
                      placeholder="Cth: Polres Metro Jakarta Selatan" className="form-input w-full"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="form-label text-xs mb-1">Nomor Telepon</label>
                    <input
                      type="text" value={newKontakNo}
                      onChange={e => setNewKontakNo(e.target.value)}
                      placeholder="Cth: 110" className="form-input w-full"
                    />
                  </div>
                  <div className="flex gap-2">
                    {editingKontakId && (
                      <button type="button" onClick={cancelEditKontak} className="btn-base btn-secondary" style={{ flexShrink: 0 }}>
                        <X size={14} /> Batal
                      </button>
                    )}
                    <button type="submit" className="btn-base btn-primary" style={{ flexShrink: 0 }}>
                      {editingKontakId ? <Save size={14} /> : <Plus size={14} />} {editingKontakId ? 'Simpan' : 'Tambah'}
                    </button>
                  </div>
                </form>

                {mdLoading ? <LoadingSpinner text="Memuat kontak darurat..." /> : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {kontakList.length === 0
                      ? <EmptyState icon={Phone} title="Belum ada kontak" description="Tambahkan kontak instansi darurat di atas." />
                      : kontakList.map(item => (
                          <div key={item.id} className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ border: '1px solid var(--color-border)', background: 'var(--color-surface-2)' }}>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full flex items-center justify-center text-red-600 bg-red-100 flex-shrink-0">
                                <Phone size={16} />
                              </div>
                              <div>
                                <p style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--color-text)' }}>{item.nama_instansi || item.nama}</p>
                                <p style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--color-text-secondary)', marginTop: 2 }}>{item.no_telepon || item.nomor}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button type="button" onClick={() => handleEditKontak(item)} className="btn-icon" style={{ width: 32, height: 32 }}>
                                <Edit2 size={13} />
                              </button>
                              <button type="button" onClick={() => handleDeleteKontak(item.id)} className="btn-icon" style={{ width: 32, height: 32, color: 'var(--color-danger)', border: '1px solid var(--color-danger-border)' }}>
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        ))
                    }
                  </div>
                )}
              </div>
            </SectionPanel>
          )}

          {/* ── Master Data ── */}
          {activeTab === 'master_data' && (
            <div className="space-y-5">
              {/* Kategori */}
              <SectionPanel title="Kategori Laporan Darurat" desc="Kelola jenis keadaan darurat yang dapat dipilih pengguna.">
                <div className="pt-4 pb-2">
                  <form onSubmit={handleAddKategori} className="flex gap-2 mb-4">
                    <input
                      type="text" value={newKategori}
                      onChange={e => setNewKategori(e.target.value)}
                      placeholder="Nama kategori baru..." className="form-input flex-1"
                    />
                    <button type="submit" className="btn-base btn-primary" style={{ flexShrink: 0 }}>
                      <Plus size={14} /> Tambah
                    </button>
                  </form>
                  {mdLoading ? <LoadingSpinner text="Memuat kategori..." /> : (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {kategoriList.length === 0
                        ? <EmptyState icon={Database} title="Belum ada kategori" description="Tambahkan kategori baru di atas." />
                        : kategoriList.map(item => (
                            <div key={item.id} className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ border: '1px solid var(--color-border)', background: 'var(--color-surface-2)' }}>
                              <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--color-text)' }}>{item.nama}</span>
                              <button type="button" onClick={() => handleDeleteKategori(item.id)} className="btn-icon" style={{ width: 30, height: 30, color: 'var(--color-danger)', border: '1px solid var(--color-danger-border)' }}>
                                <Trash2 size={13} />
                              </button>
                            </div>
                          ))
                      }
                    </div>
                  )}
                </div>
              </SectionPanel>

              {/* Pesan Cepat */}
              <SectionPanel title="Pesan Cepat (Quick Messages)" desc="Pesan darurat instan yang dapat dikirim pengguna dengan 1 tap.">
                <div className="pt-4 pb-2">
                  <form onSubmit={handleAddPesan} className="flex gap-2 mb-4">
                    <input
                      type="text" value={newPesan}
                      onChange={e => setNewPesan(e.target.value)}
                      placeholder="Isi pesan cepat baru..." className="form-input flex-1"
                    />
                    <button type="submit" className="btn-base btn-primary" style={{ flexShrink: 0 }}>
                      <Plus size={14} /> Tambah
                    </button>
                  </form>
                  {mdLoading ? <LoadingSpinner text="Memuat pesan..." /> : (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {pesanCepatList.length === 0
                        ? <EmptyState icon={Database} title="Belum ada pesan cepat" description="Tambahkan pesan baru di atas." />
                        : pesanCepatList.map(item => (
                            <div key={item.id} className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ border: '1px solid var(--color-border)', background: 'var(--color-surface-2)' }}>
                              <span style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--color-text)' }}>{item.pesan}</span>
                              <button type="button" onClick={() => handleDeletePesan(item.id)} className="btn-icon" style={{ width: 30, height: 30, color: 'var(--color-danger)', border: '1px solid var(--color-danger-border)' }}>
                                <Trash2 size={13} />
                              </button>
                            </div>
                          ))
                      }
                    </div>
                  )}
                </div>
              </SectionPanel>
            </div>
          )}

          {/* Placeholder for other tabs */}
          {(activeTab === 'peta' || activeTab === 'sistem' || activeTab === 'keamanan') && (
            <SectionPanel title={settingsNav.find(n => n.id === activeTab)?.label || 'Pengaturan'} desc="Konfigurasi lanjutan akan tersedia pada pembaruan berikutnya.">
              <div className="py-6">
                <EmptyState title="Segera Hadir" description="Fitur pengaturan ini sedang dalam pengembangan." />
              </div>
            </SectionPanel>
          )}

          {/* Save Button — hanya tampil untuk tab yg punya form */}
          {['profil', 'sos', 'notifikasi'].includes(activeTab) && (
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" className="btn-base btn-secondary">Batal</button>
              <button type="submit" className="btn-base btn-primary">
                <Save size={14} /> Simpan Perubahan
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
