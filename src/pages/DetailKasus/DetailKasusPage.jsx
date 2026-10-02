import {
  ArrowLeft, Phone, MapPin, User, Shield, Clock, CheckCircle2,
  AlertTriangle, Printer, ShieldAlert, Smartphone, Wifi, WifiOff,
  Battery, UserCheck, RefreshCw, Loader2, X, ChevronDown, ChevronUp,
  PhoneCall, Mail,
} from 'lucide-react';
import Badge from '../../components/global/Badge';
import InitialsAvatar from '../../components/global/InitialsAvatar';
import { useDetailKasus } from '../../hooks/detail-kasus/useDetailKasus';

// ─── Helper: format tanggal ───────────────────────────────────────────────────
function formatDateTime(dt) {
  if (!dt) return '—';
  return new Date(dt).toLocaleString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

// ─── Sub-component: Feedback Toast ───────────────────────────────────────────
function FeedbackToast({ feedback }) {
  if (!feedback) return null;
  const isSuccess = feedback.type === 'success';
  return (
    <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 rounded-2xl px-5 py-3.5 shadow-xl border text-[13px] font-bold transition-all animate-fade-in
      ${isSuccess ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}
    >
      {isSuccess ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
      <span>{feedback.message}</span>
    </div>
  );
}

// ─── Sub-component: Info Row ──────────────────────────────────────────────────
function InfoRow({ label, value, highlight = false }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
      <p className={`mt-0.5 text-[13px] font-semibold ${highlight ? 'text-emerald-700' : 'text-slate-800'}`}>
        {value || <span className="text-slate-400 italic font-normal">—</span>}
      </p>
    </div>
  );
}

// ─── Sub-component: Section Card ─────────────────────────────────────────────
function SectionCard({ icon: Icon, title, children, className = '' }) {
  return (
    <div className={`bg-white border border-[#eaedf1] rounded-2xl p-5 shadow-xs space-y-4 ${className}`}>
      <h2 className="text-[14px] font-bold text-slate-900 flex items-center gap-2">
        {Icon && <Icon size={15} className="text-slate-400 flex-shrink-0" />}
        <span>{title}</span>
      </h2>
      <div className="pt-3 border-t border-slate-100">
        {children}
      </div>
    </div>
  );
}

// ─── Sub-component: Empty State ───────────────────────────────────────────────
function EmptyInfo({ message = 'Data tidak tersedia.' }) {
  return (
    <p className="text-[12px] text-slate-400 italic py-2">{message}</p>
  );
}

// ─── Sub-component: Modal Konfirmasi Selesai ──────────────────────────────────
function SelesaiModal({ kasus, catatanSelesai, setCatatanSelesai, loadingSelesai, onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-[16px] font-black text-slate-900">Selesaikan Kasus?</h3>
            <p className="text-[12px] text-slate-500 mt-1">
              Tindakan ini akan menandai kasus sebagai selesai dan masuk ke riwayat.
            </p>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 cursor-pointer">
            <X size={14} />
          </button>
        </div>

        {/* Ringkasan Kasus */}
        <div className="bg-slate-50 rounded-xl p-3.5 space-y-1.5 text-[12px]">
          <p className="font-bold text-slate-700">Ringkasan Kasus #{kasus?.id}</p>
          <p className="text-slate-500">Kategori: <span className="font-semibold text-slate-700">{kasus?.kategori_laporan || '—'}</span></p>
          <p className="text-slate-500">Pelapor: <span className="font-semibold text-slate-700">{kasus?.pengguna?.name || '—'}</span></p>
          <p className="text-slate-500">Status Saat Ini: <span className="font-semibold text-slate-700">{kasus?.status || '—'}</span></p>
        </div>

        {/* Field Catatan */}
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
            Catatan Penanganan (Opsional)
          </label>
          <textarea
            rows={3}
            value={catatanSelesai}
            onChange={(e) => setCatatanSelesai(e.target.value)}
            placeholder="Contoh: Korban berhasil dievakuasi ke RSUD. Kondisi stabil."
            className="form-input text-[12px] resize-none w-full"
          />
        </div>

        <div className="flex gap-2 pt-1">
          <button onClick={onClose} className="btn-base btn-secondary text-[12px] h-9 flex-1">
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={loadingSelesai}
            className="btn-base btn-primary text-[12px] h-9 flex-1"
          >
            {loadingSelesai ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
            <span>{loadingSelesai ? 'Menyimpan...' : 'Ya, Selesaikan'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-component: Panel Dispatch Relawan ────────────────────────────────────
function DispatchPanel({ relawanList, loadingRelawan, selectedRelawanId, setSelectedRelawanId, loadingDispatch, onConfirm, onClose }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-bold text-slate-800">Pilih Relawan untuk Ditugaskan</p>
        <button onClick={onClose} className="w-6 h-6 rounded-lg hover:bg-slate-200 flex items-center justify-center text-slate-400 cursor-pointer">
          <X size={12} />
        </button>
      </div>

      {loadingRelawan ? (
        <div className="flex items-center gap-2 py-3 text-slate-500 text-[12px]">
          <Loader2 size={14} className="animate-spin text-[#0b6f61]" />
          <span>Memuat daftar relawan...</span>
        </div>
      ) : relawanList.length === 0 ? (
        <EmptyInfo message="Tidak ada relawan tersedia saat ini." />
      ) : (
        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {relawanList.map((vol) => {
            const isSelected = selectedRelawanId === vol.id;
            const name = vol.name || vol.nama || `Relawan #${vol.id}`;
            return (
              <button
                key={vol.id}
                onClick={() => setSelectedRelawanId(vol.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer
                  ${isSelected ? 'border-[#0b6f61] bg-emerald-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}
              >
                <InitialsAvatar name={name} size={32} />
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-bold text-slate-800 truncate">{name}</p>
                  <p className="text-[10px] text-slate-400 truncate">{vol.role_title || 'Relawan'}</p>
                </div>
                <div className="flex-shrink-0">
                  <Badge
                    variant={vol.status === 'bertugas' ? 'Sedang Bertugas' : 'Online'}
                    isPill
                  />
                </div>
              </button>
            );
          })}
        </div>
      )}

      <button
        onClick={onConfirm}
        disabled={!selectedRelawanId || loadingDispatch}
        className="btn-base btn-primary text-[12px] h-9 w-full disabled:opacity-50"
      >
        {loadingDispatch ? <Loader2 size={13} className="animate-spin" /> : <UserCheck size={13} />}
        <span>{loadingDispatch ? 'Menugaskan...' : 'Tugaskan Relawan'}</span>
      </button>
    </div>
  );
}

// ─── Main Page Component ──────────────────────────────────────────────────────
export default function DetailKasusPage() {
  const {
    id,
    kasus,
    activities,
    relawanList,
    loadingKasus,
    loadingActivities,
    loadingRelawan,
    loadingDispatch,
    loadingSelesai,
    errorKasus,
    selectedRelawanId,
    setSelectedRelawanId,
    showDispatchPanel,
    setShowDispatchPanel,
    showSelesaiModal,
    setShowSelesaiModal,
    catatanSelesai,
    setCatatanSelesai,
    feedback,
    navigate,
    fetchKasus,
    handleDispatch,
    handleSelesai,
    handleLogAksi,
    handleOpenDispatchPanel,
  } = useDetailKasus();

  const pengguna = kasus?.pengguna ?? null;
  const kontakDarurat = Array.isArray(pengguna?.kontak_darurat) ? pengguna.kontak_darurat : [];
  const relawanBertugas = kasus?.relawan ?? null;
  const isSelesai = kasus?.status === 'selesai' || kasus?.status === 'batal';

  // ─── Loading Screen ────────────────────────────────────────────────────
  if (loadingKasus) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-slate-500">
        <Loader2 size={28} className="animate-spin text-[#0b6f61]" />
        <p className="text-[14px] font-semibold">Memuat detail kasus...</p>
      </div>
    );
  }

  // ─── Error Screen ──────────────────────────────────────────────────────
  if (errorKasus || !kasus) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-slate-500 p-8">
        <AlertTriangle size={32} className="text-red-400" />
        <p className="text-[15px] font-bold text-slate-700">{errorKasus || 'Data kasus tidak ditemukan.'}</p>
        <div className="flex gap-2">
          <button onClick={() => navigate(-1)} className="btn-base btn-secondary text-[12px] h-9">
            <ArrowLeft size={13} /> Kembali
          </button>
          <button onClick={fetchKasus} className="btn-base btn-primary text-[12px] h-9">
            <RefreshCw size={13} /> Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1680px] w-full mx-auto">
      <FeedbackToast feedback={feedback} />
      {showSelesaiModal && (
        <SelesaiModal
          kasus={kasus}
          catatanSelesai={catatanSelesai}
          setCatatanSelesai={setCatatanSelesai}
          loadingSelesai={loadingSelesai}
          onConfirm={handleSelesai}
          onClose={() => setShowSelesaiModal(false)}
        />
      )}

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer flex-shrink-0 mt-0.5"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[12px] font-bold text-[#0b6f61]">#{kasus.id}</span>
              <Badge variant={kasus.status} isPill />
              {kasus.urgensi && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">
                  {kasus.urgensi}
                </span>
              )}
            </div>
            <h1 className="text-[20px] font-black text-slate-900 mt-1 leading-tight">
              {kasus.kategori_laporan || 'Kasus Tanpa Kategori'}
            </h1>
            <p className="text-[12px] text-slate-400 mt-0.5">{formatDateTime(kasus.waktu_laporan)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
          <button onClick={() => window.print()} className="btn-base btn-secondary text-[12px] h-9">
            <Printer size={13} />
            <span className="hidden sm:inline">Cetak</span>
          </button>
          {!isSelesai && (
            <button
              onClick={() => setShowSelesaiModal(true)}
              className="btn-base btn-primary text-[12px] h-9"
            >
              <CheckCircle2 size={13} />
              <span>Selesaikan Kasus</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Dua Kolom Utama ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-6 items-start">

        {/* ─── KOLOM KIRI ───────────────────────────────────────────────── */}
        <div className="space-y-5">

          {/* Informasi Utama Kasus */}
          <SectionCard icon={MapPin} title="Informasi Utama Kasus">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoRow label="Lokasi Kejadian" value={kasus.lokasi_laporan} />
              <InfoRow label="Kategori" value={kasus.kategori_laporan} />
              <InfoRow label="Status" value={kasus.status} highlight />
              <InfoRow label="Waktu Laporan" value={formatDateTime(kasus.waktu_laporan)} />
              {kasus.deskripsi && (
                <div className="sm:col-span-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Deskripsi</p>
                  <p className="text-[13px] text-slate-700 mt-0.5 leading-relaxed">{kasus.deskripsi}</p>
                </div>
              )}
            </div>
          </SectionCard>

          {/* Profil Korban */}
          <SectionCard icon={User} title="Profil Korban">
            {!pengguna ? (
              <EmptyInfo message="Data profil korban tidak tersedia dari backend." />
            ) : (
              <div className="space-y-5">
                {/* Identitas */}
                <div>
                  <p className="text-[11px] font-bold text-slate-500 mb-2">Identitas</p>
                  <div className="flex items-center gap-3 mb-3">
                    <InitialsAvatar name={pengguna.name} src={pengguna.foto_url} size={44} />
                    <div>
                      <p className="text-[14px] font-bold text-slate-900">{pengguna.name || '—'}</p>
                      <p className="text-[11px] text-slate-400">{pengguna.email || '—'}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <InfoRow label="No. Telepon" value={pengguna.no_telp} />
                    <InfoRow label="Kategori User" value={pengguna.kategori_user} highlight />
                  </div>
                </div>

                {/* Disabilitas & Kebutuhan */}
                <div>
                  <p className="text-[11px] font-bold text-slate-500 mb-2">Disabilitas & Kebutuhan Komunikasi</p>
                  <div className="grid grid-cols-2 gap-3">
                    <InfoRow label="Jenis Disabilitas" value={pengguna.jenis_disabilitas || pengguna.kategori_user} highlight />
                    <InfoRow label="Metode Komunikasi" value={pengguna.metode_komunikasi} />
                    <InfoRow label="Kebutuhan Aksesibilitas" value={pengguna.kebutuhan_aksesibilitas} />
                    {pengguna.keterangan_medis && (
                      <div className="col-span-2">
                        <InfoRow label="Keterangan Medis" value={pengguna.keterangan_medis} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Kontak Darurat */}
                <div>
                  <p className="text-[11px] font-bold text-slate-500 mb-2">Kontak Darurat</p>
                  {kontakDarurat.length === 0 ? (
                    <EmptyInfo message="Tidak ada kontak darurat yang terdaftar." />
                  ) : (
                    <div className="space-y-2">
                      {kontakDarurat.map((k, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                          <div>
                            <p className="text-[12px] font-bold text-slate-800">{k.nama || '—'}</p>
                            <p className="text-[11px] text-slate-400">{k.hubungan || 'Keluarga'} · {k.no_telp || '—'}</p>
                          </div>
                          <div className="flex items-center gap-1.5">
                            {k.no_telp && (
                              <a
                                href={`tel:${k.no_telp}`}
                                className="w-8 h-8 rounded-xl border border-emerald-200 bg-emerald-50 flex items-center justify-center text-emerald-700 hover:bg-emerald-100 transition-colors"
                                title={`Hubungi ${k.nama}`}
                              >
                                <PhoneCall size={13} />
                              </a>
                            )}
                            {k.email && (
                              <a
                                href={`mailto:${k.email}`}
                                className="w-8 h-8 rounded-xl border border-blue-200 bg-blue-50 flex items-center justify-center text-blue-700 hover:bg-blue-100 transition-colors"
                                title={`Email ${k.nama}`}
                              >
                                <Mail size={13} />
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </SectionCard>

          {/* Status Perangkat Korban */}
          <SectionCard icon={Smartphone} title="Status Perangkat Korban">
            {!kasus.device_info ? (
              <EmptyInfo message="Informasi perangkat tidak tersedia dari backend." />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {/* Battery */}
                <div className="flex items-center gap-2">
                  <Battery size={15} className="text-slate-400 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Baterai</p>
                    <p className="text-[13px] font-bold text-slate-800">{kasus.device_info?.battery_level != null ? `${kasus.device_info.battery_level}%` : '—'}</p>
                  </div>
                </div>
                {/* Koneksi */}
                <div className="flex items-center gap-2">
                  {kasus.device_info?.is_online ? (
                    <Wifi size={15} className="text-emerald-500 flex-shrink-0" />
                  ) : (
                    <WifiOff size={15} className="text-red-400 flex-shrink-0" />
                  )}
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Koneksi</p>
                    <p className={`text-[13px] font-bold ${kasus.device_info?.is_online ? 'text-emerald-700' : 'text-red-600'}`}>
                      {kasus.device_info?.is_online ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
                {/* Device ID */}
                <InfoRow label="Device ID" value={kasus.device_info?.device_id} />
                {/* Last Seen */}
                <div className="col-span-2 sm:col-span-1">
                  <InfoRow label="Terakhir Terlihat" value={formatDateTime(kasus.device_info?.last_seen)} />
                </div>
                {/* Lokasi Update Terakhir */}
                <div className="col-span-2">
                  <InfoRow label="Lokasi Terakhir Diperbarui" value={formatDateTime(kasus.device_info?.location_updated_at)} />
                </div>
              </div>
            )}
          </SectionCard>

          {/* Activity Log */}
          <SectionCard icon={Clock} title="Log Riwayat Aktivitas">
            {loadingActivities ? (
              <div className="flex items-center gap-2 py-4 text-slate-500 text-[12px]">
                <Loader2 size={14} className="animate-spin text-[#0b6f61]" />
                <span>Memuat riwayat aktivitas...</span>
              </div>
            ) : (!Array.isArray(activities) || activities.length === 0) ? (
              <EmptyInfo message="Belum ada riwayat aktivitas tercatat untuk kasus ini." />
            ) : (
              <div className="space-y-4">
                {activities.map((log, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-[#0b6f61] mt-1.5 flex-shrink-0" />
                      {idx < activities.length - 1 && (
                        <div className="w-0.5 h-full bg-slate-200 mt-1" style={{ minHeight: 24 }} />
                      )}
                    </div>
                    <div className="flex-1 pb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-bold text-slate-900">{log.aktor || 'Sistem'}</span>
                        {log.role_aktor && (
                          <Badge variant={log.role_aktor} isPill />
                        )}
                      </div>
                      <p className="text-[12px] text-slate-600 mt-0.5">{log.deskripsi || log.jenis}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{formatDateTime(log.created_at || log.waktu)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </div>

        {/* ─── KOLOM KANAN ──────────────────────────────────────────────── */}
        <div className="space-y-5">

          {/* Relawan Bertugas / Dispatch */}
          <SectionCard icon={Shield} title="Penugasan Relawan">
            {relawanBertugas ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <InitialsAvatar name={relawanBertugas.name} src={relawanBertugas.foto_url} size={40} bgClass="bg-emerald-700" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-slate-900">{relawanBertugas.name || '—'}</p>
                    <p className="text-[11px] text-slate-500">{relawanBertugas.role_title || 'Relawan'}</p>
                    <Badge variant="Sedang Bertugas" isPill showDot className="mt-1" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {relawanBertugas.no_telp && (
                    <a href={`tel:${relawanBertugas.no_telp}`} className="btn-base btn-primary text-[12px] h-9 w-full justify-center">
                      <Phone size={13} />
                      <span>Telepon</span>
                    </a>
                  )}
                  {!isSelesai && (
                    <button
                      onClick={() => setShowDispatchPanel(!showDispatchPanel)}
                      className="btn-base btn-secondary text-[12px] h-9 w-full"
                    >
                      {showDispatchPanel ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                      <span>Ganti Relawan</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <EmptyInfo message="Belum ada relawan yang ditugaskan ke kasus ini." />
                {!isSelesai && (
                  <button
                    onClick={handleOpenDispatchPanel}
                    className="btn-base btn-primary text-[12px] h-9 w-full"
                  >
                    <UserCheck size={13} />
                    <span>Tugaskan Relawan</span>
                  </button>
                )}
              </div>
            )}

            {showDispatchPanel && !isSelesai && (
              <div className="mt-3">
                <DispatchPanel
                  relawanList={relawanList}
                  loadingRelawan={loadingRelawan}
                  selectedRelawanId={selectedRelawanId}
                  setSelectedRelawanId={setSelectedRelawanId}
                  loadingDispatch={loadingDispatch}
                  onConfirm={handleDispatch}
                  onClose={() => { setShowDispatchPanel(false); setSelectedRelawanId(null); }}
                />
              </div>
            )}
          </SectionCard>

          {/* Kontak Korban Langsung */}
          <SectionCard icon={PhoneCall} title="Hubungi Korban / Pihak Terkait">
            <div className="space-y-2">
              {pengguna?.no_telp ? (
                <a
                  href={`tel:${pengguna.no_telp}`}
                  onClick={() => handleLogAksi(`Korban (${pengguna.name})`)}
                  className="btn-base btn-primary text-[12px] h-9 w-full justify-center"
                >
                  <Phone size={13} />
                  <span>Hubungi Korban ({pengguna.no_telp})</span>
                </a>
              ) : (
                <EmptyInfo message="Nomor telepon korban tidak tersedia." />
              )}

              {kontakDarurat.length > 0 && kontakDarurat.map((k, i) => (
                k.no_telp ? (
                  <a
                    key={i}
                    href={`tel:${k.no_telp}`}
                    onClick={() => handleLogAksi(`Kontak Darurat Keluarga (${k.nama})`)}
                    className="btn-base btn-secondary text-[12px] h-9 w-full justify-start"
                  >
                    <PhoneCall size={13} />
                    <span>{k.nama} ({k.hubungan || 'Kontak Darurat'})</span>
                  </a>
                ) : null
              ))}

              {/* Eskalasi */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Eskalasi Medis / Aparat</p>
                <button
                  onClick={() => {
                    handleLogAksi('Ambulans 118');
                    window.location.href = 'tel:118';
                  }}
                  className="btn-base btn-danger w-full text-[12px] h-9"
                >
                  <ShieldAlert size={13} />
                  <span>Panggil Ambulans (118)</span>
                </button>
                <button
                  onClick={() => {
                    handleLogAksi('Kepolisian 110');
                    window.location.href = 'tel:110';
                  }}
                  className="btn-base btn-secondary w-full text-[12px] h-9"
                >
                  <ShieldAlert size={13} />
                  <span>Eskalasi ke Kepolisian (110)</span>
                </button>
              </div>
            </div>
          </SectionCard>

          {/* Lokasi dari koordinat */}
          {(kasus.latitude || kasus.lat) && (kasus.longitude || kasus.lng) && (
            <SectionCard icon={MapPin} title="Koordinat Lokasi">
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-3">
                  <InfoRow label="Latitude" value={kasus.latitude ?? kasus.lat} />
                  <InfoRow label="Longitude" value={kasus.longitude ?? kasus.lng} />
                </div>
                <a
                  href={`https://www.google.com/maps?q=${kasus.latitude ?? kasus.lat},${kasus.longitude ?? kasus.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-base btn-secondary w-full text-[12px] h-9 justify-center"
                >
                  <MapPin size={13} />
                  <span>Buka di Google Maps</span>
                </a>
              </div>
            </SectionCard>
          )}
        </div>
      </div>
    </div>
  );
}
